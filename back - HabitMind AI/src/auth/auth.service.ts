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
        this.i18n.t('auth.errors.user_already_exists', lang),
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
        this.i18n.t('auth.errors.invalid_credentials', lang),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException(
        this.i18n.t('auth.errors.invalid_credentials', lang),
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

  async validateUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
