# Exemplos Práticos - Internacionalização

## 🔧 Exemplos de Código Completos

### Exemplo 1: AuthService com i18n

**Arquivo:** `src/auth/auth.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto, lang: string = 'pt-br') {
    const { email, name, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        this.i18n.t('auth.errors.user_already_exists', lang)
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: this.i18n.t('auth.messages.registered_successfully', lang),
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
      },
    };
  }

  async login(loginDto: LoginDto, lang: string = 'pt-br') {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(
        this.i18n.t('auth.errors.invalid_credentials', lang)
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException(
        this.i18n.t('auth.errors.invalid_credentials', lang)
      );
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: this.i18n.t('auth.messages.logged_in_successfully', lang),
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        planType: user.planType,
      },
    };
  }
}
```

---

### Exemplo 2: AuthController com i18n

**Arquivo:** `src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    return this.authService.register(registerDto, lang);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    return this.authService.login(loginDto, lang);
  }
}
```

---

### Exemplo 3: HabitsService com i18n

**Arquivo:** `src/habits/habits.service.ts` (parcial)

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import { CreateCheckinDto } from './dto/checkin.dto';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class HabitsService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async createHabit(
    userId: string,
    createHabitDto: CreateHabitDto,
    lang: string = 'pt-br',
  ) {
    // Validar dados
    if (!createHabitDto.name) {
      throw new BadRequestException(
        this.i18n.t('habits.errors.habit_name_required', lang)
      );
    }

    const habit = await this.prisma.habit.create({
      data: {
        userId,
        ...createHabitDto,
      },
    });

    return {
      message: this.i18n.t('habits.messages.habit_created', lang),
      data: habit,
    };
  }

  async getHabits(userId: string) {
    return await this.prisma.habit.findMany({
      where: { userId, isActive: true },
      include: { habitLogs: true },
    });
  }

  async getHabit(
    habitId: string,
    userId: string,
    lang: string = 'pt-br',
  ) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { habitLogs: true },
    });

    if (!habit || habit.userId !== userId) {
      throw new NotFoundException(
        this.i18n.t('habits.errors.habit_not_found', lang)
      );
    }

    return habit;
  }

  async updateHabit(
    habitId: string,
    userId: string,
    updateHabitDto: UpdateHabitDto,
    lang: string = 'pt-br',
  ) {
    await this.getHabit(habitId, userId, lang);

    const habit = await this.prisma.habit.update({
      where: { id: habitId },
      data: updateHabitDto,
    });

    return {
      message: this.i18n.t('habits.messages.habit_updated', lang),
      data: habit,
    };
  }

  async deleteHabit(
    habitId: string,
    userId: string,
    lang: string = 'pt-br',
  ) {
    await this.getHabit(habitId, userId, lang);

    const habit = await this.prisma.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });

    return {
      message: this.i18n.t('habits.messages.habit_deleted', lang),
      data: habit,
    };
  }

  async createCheckin(
    habitId: string,
    userId: string,
    createCheckinDto: CreateCheckinDto,
    lang: string = 'pt-br',
  ) {
    // Verify habit belongs to user
    await this.getHabit(habitId, userId, lang);

    const date = new Date(createCheckinDto.date);

    const checkin = await this.prisma.habitLog.create({
      data: {
        habitId,
        date,
        status: createCheckinDto.status,
        notes: createCheckinDto.notes,
      },
    });

    return {
      message: this.i18n.t('habits.messages.checkin_created', lang),
      data: checkin,
    };
  }
}
```

---

### Exemplo 4: HabitsController com i18n

**Arquivo:** `src/habits/habits.controller.ts` (parcial)

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import { CreateCheckinDto } from './dto/checkin.dto';

@Controller('api/habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private habitsService: HabitsService) {}

  @Post()
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.createHabit(
        req.user.id,
        createHabitDto,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getHabits(@Request() req) {
    return this.habitsService.getHabits(req.user.id);
  }

  @Get(':id')
  async getHabit(
    @Param('id') habitId: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return this.habitsService.getHabit(habitId, req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateHabit(
    @Param('id') habitId: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.updateHabit(
        habitId,
        req.user.id,
        updateHabitDto,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id') habitId: string,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.deleteHabit(
        habitId,
        req.user.id,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/checkin')
  async createCheckin(
    @Param('id') habitId: string,
    @Body() createCheckinDto: CreateCheckinDto,
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.habitsService.createCheckin(
        habitId,
        req.user.id,
        createCheckinDto,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
```

---

### Exemplo 5: UsersService com i18n

**Arquivo:** `src/users/users.service.ts` (parcial)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async getProfile(userId: string, lang: string = 'pt-br') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang)
      );
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    lang: string = 'pt-br',
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang)
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        credits: true,
      },
    });

    return {
      message: this.i18n.t('users.messages.profile_updated', lang),
      data: updatedUser,
    };
  }
}
```

---

### Exemplo 6: DTOs com Validação i18n

**Arquivo:** `src/auth/dto/auth.dto.ts`

```typescript
import { IsEmail, MinLength, MaxLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'auth.errors.invalid_email' })
  email: string;

  @IsString({ message: 'auth.errors.email_required' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  name: string;

  @IsString({ message: 'auth.errors.password_required' })
  @MinLength(8, { message: 'auth.errors.weak_password' })
  @MaxLength(255, { message: 'Senha muito longa' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'auth.errors.invalid_email' })
  email: string;

  @IsString({ message: 'auth.errors.password_required' })
  @MinLength(1, { message: 'auth.errors.password_required' })
  password: string;
}
```

---

### Exemplo 7: Exception Filter Global

**Arquivo:** `src/common/exceptions/all-exceptions.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from '../../i18n/i18n.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private i18n: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extrair idioma da query, header ou cookie
    const lang =
      (request.query.lang as string) ||
      request.header('accept-language')?.split(',')[0] ||
      'pt-br';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = this.i18n.t('common.errors.internal_error', lang);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const { message: errMessage } = exceptionResponse as any;
        if (errMessage) {
          // Se a mensagem é uma chave i18n, traduzir
          if (errMessage.includes('.')) {
            message = this.i18n.t(errMessage, lang);
          } else {
            message = errMessage;
          }
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

---

### Exemplo 8: Middleware para Extrair Idioma

**Arquivo:** `src/common/middleware/language.middleware.ts`

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Prioridade: query > cookie > header > padrão
    let lang = (req.query.lang as string) || 'pt-br';

    if (req.cookies?.lang) {
      lang = req.cookies.lang;
    }

    if (req.header('accept-language')) {
      const acceptLanguage = req.header('accept-language');
      if (acceptLanguage.includes('en')) {
        lang = 'en-us';
      } else if (acceptLanguage.includes('es')) {
        lang = 'es-es';
      } else if (acceptLanguage.includes('pt')) {
        lang = 'pt-br';
      }
    }

    req.body = req.body || {};
    req.body.lang = lang;

    next();
  }
}
```

---

### Exemplo 9: Interceptador para Adicionar Idioma

**Arquivo:** `src/common/interceptors/language.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Extrair idioma da query
    const lang = request.query.lang || request.header('accept-language') || 'pt-br';

    // Armazenar no contexto
    request.lang = lang;

    return next.handle();
  }
}
```

---

### Exemplo 10: Teste E2E com i18n

**Arquivo:** `test/i18n.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('i18n E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth - Portuguese', () => {
    it('should return Portuguese error message for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('inválido');
    });

    it('should register user successfully in Portuguese', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@test.com`,
          name: 'Test User',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('sucesso');
    });
  });

  describe('Auth - English', () => {
    it('should return English error message for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login?lang=en-us')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('invalid');
    });
  });

  describe('Auth - Spanish', () => {
    it('should return Spanish error message for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login?lang=es-es')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('inválido');
    });
  });

  describe('Language Detection Priority', () => {
    it('should prioritize query parameter over header', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login?lang=en-us')
        .set('Accept-Language', 'pt-BR')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.body.message).toContain('invalid');
    });

    it('should use header language when query param is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Accept-Language', 'en-US')
        .send({ email: 'invalid', password: 'password123' });

      expect(response.body.message).toContain('invalid');
    });
  });
});
```

---

## 🧪 Teste Prático - Passo a Passo

### Teste 1: Registrar usuário em português

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@teste.com",
    "name": "Usuário Teste",
    "password": "senha123456"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Registrado com sucesso",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "usuario@teste.com",
    "name": "Usuário Teste"
  }
}
```

---

### Teste 2: Erro de validação em português

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-invalido",
    "name": "Test",
    "password": "weak"
  }'
```

**Resposta esperada (422):**
```json
{
  "statusCode": 422,
  "message": "Email inválido",
  "timestamp": "2026-01-07T...",
  "path": "/api/auth/register"
}
```

---

### Teste 3: Mesmo erro em inglês

```bash
curl -X POST http://localhost:3000/api/auth/register?lang=en-us \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-invalido",
    "name": "Test",
    "password": "weak"
  }'
```

**Resposta esperada (422):**
```json
{
  "statusCode": 422,
  "message": "Invalid email address",
  "timestamp": "2026-01-07T...",
  "path": "/api/auth/register"
}
```

---

### Teste 4: Erro de usuário existente

```bash
# Tentar registrar o mesmo email novamente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@teste.com",
    "name": "Outro Usuário",
    "password": "senha123456"
  }'
```

**Resposta esperada (400):**
```json
{
  "statusCode": 400,
  "message": "Usuário já existe",
  "timestamp": "2026-01-07T...",
  "path": "/api/auth/register"
}
```

---

## 📊 Matriz de Suporte de Idiomas

| Idioma | Código | Status | Tradução |
|--------|--------|--------|----------|
| Português (Brasil) | pt-br | ✅ Implementado | 100% |
| Inglês (EUA) | en-us | ✅ Implementado | 100% |
| Espanhol (Espanha) | es-es | ⏳ Pronto para adicionar | 100% |
| Francês | fr-fr | 🔄 Futuro | 0% |
| Alemão | de-de | 🔄 Futuro | 0% |

---

## 🎓 Dicas de Boas Práticas

1. **Consistência**: Use os mesmos termos em todas as traduções
2. **Contexto**: Forneça contexto adequado para variações de tradução
3. **Pluralização**: Use regras de pluralização específicas do idioma
4. **Formatação**: Mantenha formatação consistente entre idiomas
5. **Testes**: Sempre teste com múltiplos idiomas

