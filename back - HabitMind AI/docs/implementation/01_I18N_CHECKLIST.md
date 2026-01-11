# Checklist Executável - Internacionalização HabitMind AI

## 📋 Fase 1: Setup Backend (2-3 horas)

### ✅ Passo 1: Instalação de Dependências
- [ ] Executar: `npm install nestjs-i18n`
- [ ] Verificar instalação em `package.json`

**Comando:**
```bash
npm install nestjs-i18n
```

---

### ✅ Passo 2: Criar Estrutura de Diretórios

- [ ] Criar diretório: `src/i18n/`
- [ ] Criar diretório: `src/i18n/locales/`
- [ ] Criar diretório: `src/i18n/schemas/`

**Arquivos a criar:**
```
src/i18n/
├── i18n.module.ts
├── i18n.service.ts
├── locales/
│   ├── pt-br.json
│   ├── en-us.json
│   └── es-es.json
└── schemas/
    ├── auth.json
    ├── habits.json
    ├── users.json
    ├── common.json
    └── ai.json
```

---

### ✅ Passo 3: Implementar i18n.module.ts

**Arquivo:** `src/i18n/i18n.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { I18nService } from './i18n.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt-br',
      loaderOptions: {
        path: path.join(__dirname, './locales'),
        watch: true,
      },
      resolvers: [
        { use: 'query', options: ['lang', 'language'] },
        { use: 'cookie', options: ['lang'] },
        { use: 'header', options: ['accept-language'] },
      ],
    }),
  ],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nCustomModule {}
```

---

### ✅ Passo 4: Implementar i18n.service.ts

**Arquivo:** `src/i18n/i18n.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { I18nService as I18nBaseService } from 'nestjs-i18n';

@Injectable()
export class I18nService {
  constructor(private i18n: I18nBaseService) {}

  /**
   * Traduz uma chave
   * @param key Chave da tradução (ex: 'auth.errors.user_not_found')
   * @param lang Idioma (ex: 'pt-br', 'en-us')
   */
  t(key: string, lang?: string): string {
    return this.i18n.translate(key, { lang });
  }

  /**
   * Traduz com parâmetros
   * @param key Chave da tradução
   * @param params Parâmetros para interpolação
   * @param lang Idioma
   */
  tParams(key: string, params: any, lang?: string): string {
    return this.i18n.translate(key, { args: params, lang });
  }

  /**
   * Retorna todos os idiomas disponíveis
   */
  getAvailableLanguages(): string[] {
    return ['pt-br', 'en-us', 'es-es'];
  }
}
```

---

### ✅ Passo 5: Criar Arquivos de Tradução

#### **pt-br.json** (Português Brasil)

```json
{
  "auth": {
    "errors": {
      "user_already_exists": "Usuário já existe",
      "invalid_credentials": "Email ou senha inválido",
      "user_not_found": "Usuário não encontrado",
      "weak_password": "Senha muito fraca. Mínimo 8 caracteres",
      "invalid_email": "Email inválido",
      "email_required": "Email é obrigatório",
      "password_required": "Senha é obrigatória"
    },
    "messages": {
      "registered_successfully": "Registrado com sucesso",
      "logged_in_successfully": "Conectado com sucesso",
      "check_email": "Verifique seu email para continuar"
    }
  },
  "habits": {
    "errors": {
      "habit_not_found": "Hábito não encontrado",
      "invalid_habit_data": "Dados do hábito inválidos",
      "habit_already_exists": "Este hábito já existe",
      "habit_name_required": "Nome do hábito é obrigatório",
      "invalid_frequency": "Frequência inválida"
    },
    "messages": {
      "habit_created": "Hábito criado com sucesso",
      "habit_updated": "Hábito atualizado com sucesso",
      "habit_deleted": "Hábito deletado com sucesso",
      "checkin_created": "Check-in registrado com sucesso"
    }
  },
  "users": {
    "errors": {
      "user_not_found": "Usuário não encontrado",
      "invalid_user_data": "Dados do usuário inválidos",
      "profile_update_failed": "Falha ao atualizar perfil"
    },
    "messages": {
      "profile_updated": "Perfil atualizado com sucesso",
      "preferences_updated": "Preferências atualizadas com sucesso"
    }
  },
  "ai": {
    "errors": {
      "analysis_failed": "Falha ao analisar hábito",
      "insufficient_data": "Dados insuficientes para análise"
    },
    "messages": {
      "analysis_completed": "Análise completada com sucesso",
      "insights_generated": "Insights gerados com sucesso"
    }
  },
  "common": {
    "errors": {
      "unauthorized": "Não autorizado",
      "forbidden": "Acesso proibido",
      "internal_error": "Erro interno do servidor",
      "bad_request": "Requisição inválida",
      "not_found": "Recurso não encontrado",
      "rate_limit_exceeded": "Limite de requisições excedido",
      "invalid_token": "Token inválido ou expirado"
    },
    "messages": {
      "success": "Operação realizada com sucesso",
      "created": "Criado com sucesso",
      "updated": "Atualizado com sucesso",
      "deleted": "Deletado com sucesso"
    }
  }
}
```

#### **en-us.json** (English USA)

```json
{
  "auth": {
    "errors": {
      "user_already_exists": "User already exists",
      "invalid_credentials": "Invalid email or password",
      "user_not_found": "User not found",
      "weak_password": "Password is too weak. Minimum 8 characters",
      "invalid_email": "Invalid email address",
      "email_required": "Email is required",
      "password_required": "Password is required"
    },
    "messages": {
      "registered_successfully": "Registered successfully",
      "logged_in_successfully": "Logged in successfully",
      "check_email": "Check your email to continue"
    }
  },
  "habits": {
    "errors": {
      "habit_not_found": "Habit not found",
      "invalid_habit_data": "Invalid habit data",
      "habit_already_exists": "This habit already exists",
      "habit_name_required": "Habit name is required",
      "invalid_frequency": "Invalid frequency"
    },
    "messages": {
      "habit_created": "Habit created successfully",
      "habit_updated": "Habit updated successfully",
      "habit_deleted": "Habit deleted successfully",
      "checkin_created": "Check-in recorded successfully"
    }
  },
  "users": {
    "errors": {
      "user_not_found": "User not found",
      "invalid_user_data": "Invalid user data",
      "profile_update_failed": "Failed to update profile"
    },
    "messages": {
      "profile_updated": "Profile updated successfully",
      "preferences_updated": "Preferences updated successfully"
    }
  },
  "ai": {
    "errors": {
      "analysis_failed": "Failed to analyze habit",
      "insufficient_data": "Insufficient data for analysis"
    },
    "messages": {
      "analysis_completed": "Analysis completed successfully",
      "insights_generated": "Insights generated successfully"
    }
  },
  "common": {
    "errors": {
      "unauthorized": "Unauthorized",
      "forbidden": "Forbidden",
      "internal_error": "Internal server error",
      "bad_request": "Bad request",
      "not_found": "Resource not found",
      "rate_limit_exceeded": "Rate limit exceeded",
      "invalid_token": "Token invalid or expired"
    },
    "messages": {
      "success": "Operation completed successfully",
      "created": "Created successfully",
      "updated": "Updated successfully",
      "deleted": "Deleted successfully"
    }
  }
}
```

#### **es-es.json** (Spanish)

```json
{
  "auth": {
    "errors": {
      "user_already_exists": "El usuario ya existe",
      "invalid_credentials": "Email o contraseña inválido",
      "user_not_found": "Usuario no encontrado",
      "weak_password": "La contraseña es muy débil. Mínimo 8 caracteres",
      "invalid_email": "Email inválido",
      "email_required": "El email es obligatorio",
      "password_required": "La contraseña es obligatoria"
    },
    "messages": {
      "registered_successfully": "Registrado exitosamente",
      "logged_in_successfully": "Conectado exitosamente",
      "check_email": "Revise su email para continuar"
    }
  },
  "habits": {
    "errors": {
      "habit_not_found": "Hábito no encontrado",
      "invalid_habit_data": "Datos del hábito inválidos",
      "habit_already_exists": "Este hábito ya existe",
      "habit_name_required": "El nombre del hábito es obligatorio",
      "invalid_frequency": "Frecuencia inválida"
    },
    "messages": {
      "habit_created": "Hábito creado exitosamente",
      "habit_updated": "Hábito actualizado exitosamente",
      "habit_deleted": "Hábito eliminado exitosamente",
      "checkin_created": "Check-in registrado exitosamente"
    }
  },
  "users": {
    "errors": {
      "user_not_found": "Usuario no encontrado",
      "invalid_user_data": "Datos del usuario inválidos",
      "profile_update_failed": "Error al actualizar perfil"
    },
    "messages": {
      "profile_updated": "Perfil actualizado exitosamente",
      "preferences_updated": "Preferencias actualizadas exitosamente"
    }
  },
  "ai": {
    "errors": {
      "analysis_failed": "Error al analizar hábito",
      "insufficient_data": "Datos insuficientes para análisis"
    },
    "messages": {
      "analysis_completed": "Análisis completado exitosamente",
      "insights_generated": "Insights generados exitosamente"
    }
  },
  "common": {
    "errors": {
      "unauthorized": "No autorizado",
      "forbidden": "Acceso prohibido",
      "internal_error": "Error interno del servidor",
      "bad_request": "Solicitud inválida",
      "not_found": "Recurso no encontrado",
      "rate_limit_exceeded": "Límite de solicitudes excedido",
      "invalid_token": "Token inválido o expirado"
    },
    "messages": {
      "success": "Operación completada exitosamente",
      "created": "Creado exitosamente",
      "updated": "Actualizado exitosamente",
      "deleted": "Eliminado exitosamente"
    }
  }
}
```

---

## 📋 Fase 2: Integração com Services (4-5 horas)

### ✅ Passo 6: Atualizar app.module.ts

**Local:** `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nCustomModule } from './i18n/i18n.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    I18nCustomModule,  // ← Adicionar aqui (antes dos outros módulos)
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    HabitsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### ✅ Passo 7: Atualizar AuthService

- [ ] Injetar `I18nService`
- [ ] Substituir mensagens de erro hardcoded
- [ ] Testar com diferentes idiomas

**Mudanças em `src/auth/auth.service.ts`:**

1. Adicionar import:
```typescript
import { I18nService } from '../i18n/i18n.service';
```

2. Injetar no constructor:
```typescript
constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
  private i18n: I18nService,
) {}
```

3. Substituir erros:
```typescript
// Antes:
throw new Error('User already exists');

// Depois:
throw new BadRequestException(
  this.i18n.t('auth.errors.user_already_exists')
);
```

---

### ✅ Passo 8: Atualizar HabitsService

- [ ] Injetar `I18nService`
- [ ] Substituir mensagens de erro hardcoded

**Mudanças em `src/habits/habits.service.ts`:**

1. Adicionar import
2. Injetar no constructor
3. Substituir erros (exemplo NotFoundException)

---

### ✅ Passo 9: Atualizar UsersService

- [ ] Injetar `I18nService`
- [ ] Substituir mensagens de erro hardcoded

---

### ✅ Passo 10: Atualizar AI Service

- [ ] Injetar `I18nService`
- [ ] Substituir mensagens de erro hardcoded

---

## 📋 Fase 3: Exception Filters (2 horas)

### ✅ Passo 11: Criar Exception Filter Global

**Arquivo:** `src/common/exceptions/custom-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
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

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = this.i18n.t('common.errors.internal_error');

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
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

### ✅ Passo 12: Registrar Exception Filter Global

**Arquivo:** `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/custom-exception.filter';
import { I18nService } from './i18n/i18n.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registrar Exception Filter Global
  const i18nService = app.get(I18nService);
  app.useGlobalFilters(new AllExceptionsFilter(i18nService));

  await app.listen(3000);
}

bootstrap();
```

---

## 📋 Fase 4: DTOs com Validações i18n (2 horas)

### ✅ Passo 13: Criar Custom Validator com i18n

**Arquivo:** `src/common/decorators/i18n-validation.decorator.ts`

```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: target.constructor,
      propertyName: propertyName,
      options: {
        message: 'auth.errors.weak_password',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return value.length >= 8;
        },
      },
    });
  };
}
```

---

### ✅ Passo 14: Atualizar Auth DTOs

**Arquivo:** `src/auth/dto/auth.dto.ts`

```typescript
import { IsEmail, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'auth.errors.invalid_email' })
  email: string;

  @IsString({ message: 'auth.errors.email_required' })
  name: string;

  @MinLength(8, { message: 'auth.errors.weak_password' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'auth.errors.invalid_email' })
  email: string;

  @IsString({ message: 'auth.errors.password_required' })
  password: string;
}
```

---

## 📋 Fase 5: Testes (2-3 horas)

### ✅ Passo 15: Testes Básicos de i18n

**Arquivo:** `test/i18n.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('i18n (e2e)', () => {
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

  describe('Language Detection', () => {
    it('should return Portuguese error message by default', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid@email.com', password: 'weak' });

      expect(response.body.message).toContain('inválido');
    });

    it('should return English error message with lang=en-us', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login?lang=en-us')
        .send({ email: 'invalid@email.com', password: 'weak' });

      expect(response.body.message).toContain('invalid');
    });

    it('should return Spanish error message with lang=es-es', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login?lang=es-es')
        .send({ email: 'invalid@email.com', password: 'weak' });

      expect(response.body.message).toContain('inválido');
    });
  });
});
```

---

### ✅ Passo 16: Testar Endpoints Manualmente

**Testes com cURL:**

```bash
# Teste 1: Português (padrão)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"weak"}'

# Teste 2: Inglês
curl -X POST http://localhost:3000/api/auth/register?lang=en-us \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"weak"}'

# Teste 3: Espanhol
curl -X POST http://localhost:3000/api/auth/register?lang=es-es \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"weak"}'

# Teste 4: Header Accept-Language
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -d '{"email":"test@test.com","name":"Test","password":"weak"}'

# Teste 5: Cookie
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Cookie: lang=es-es" \
  -d '{"email":"test@test.com","name":"Test","password":"weak"}'
```

---

## 🎯 Resumo Executivo

### Checklist Rápido:

**Fase 1 (Setup):**
- [ ] npm install nestjs-i18n
- [ ] Criar estrutura src/i18n/
- [ ] Implementar i18n.module.ts
- [ ] Implementar i18n.service.ts
- [ ] Criar arquivos de tradução (pt-br, en-us, es-es)

**Fase 2 (Integração):**
- [ ] Adicionar I18nCustomModule a app.module.ts
- [ ] Atualizar AuthService com i18n
- [ ] Atualizar HabitsService com i18n
- [ ] Atualizar UsersService com i18n
- [ ] Atualizar AI Service com i18n

**Fase 3 (Exception Handling):**
- [ ] Criar AllExceptionsFilter
- [ ] Registrar filter global em main.ts

**Fase 4 (Validação):**
- [ ] Atualizar DTOs com mensagens i18n
- [ ] Testar validações

**Fase 5 (Testes):**
- [ ] Criar testes e2e para i18n
- [ ] Testar todos os idiomas
- [ ] Testar fallback para idioma padrão

---

**Tempo Estimado Total:** 20-24 horas
**Dificuldade:** Média
**Impacto:** Alto (suporta expansão internacional)

