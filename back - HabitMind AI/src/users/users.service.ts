import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import { UpdateUserDto } from './dto/user.dto';

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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateProfile(userId: string, updateUserDto: UpdateUserDto, lang: string = 'pt-br') {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getCredits(userId: string, lang: string = 'pt-br') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        availableCredits: true,
        totalCredits: true,
        planType: true,
        lastCreditRefillAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('users.errors.user_not_found', lang),
      );
    }

    return user;
  }
}
