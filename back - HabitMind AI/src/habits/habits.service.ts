import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import { CreateCheckinDto } from './dto/checkin.dto';

@Injectable()
export class HabitsService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  // ============ Habits ============

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createHabit(userId: string, createHabitDto: CreateHabitDto, lang: string = 'pt-br') {
    return await this.prisma.habit.create({
      data: {
        userId,
        ...createHabitDto,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getHabits(userId: string, lang: string = 'pt-br') {
    return await this.prisma.habit.findMany({
      where: { userId, isActive: true },
      include: { habitLogs: true },
    });
  }

  async getHabit(habitId: string, userId: string, lang: string = 'pt-br') {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { habitLogs: true },
    });

    if (!habit || habit.userId !== userId) {
      throw new NotFoundException(
        this.i18n.t('habits.errors.habit_not_found', lang),
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

    return await this.prisma.habit.update({
      where: { id: habitId },
      data: updateHabitDto,
    });
  }

  async deleteHabit(habitId: string, userId: string, lang: string = 'pt-br') {
    await this.getHabit(habitId, userId, lang);

    // Soft delete
    return await this.prisma.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });
  }

  // ============ Check-ins ============

  async createCheckin(
    habitId: string,
    userId: string,
    createCheckinDto: CreateCheckinDto,
    lang: string = 'pt-br',
  ) {
    // Verify habit belongs to user
    await this.getHabit(habitId, userId, lang);

    const date = new Date(createCheckinDto.date);

    return await this.prisma.habitLog.create({
      data: {
        habitId,
        date,
        status: createCheckinDto.status,
        notes: createCheckinDto.notes,
      },
    });
  }

  async getCheckins(habitId: string, userId: string, lang: string = 'pt-br') {
    // Verify habit belongs to user
    await this.getHabit(habitId, userId, lang);

    return await this.prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });
  }

  async getCheckinsByDateRange(
    habitId: string,
    userId: string,
    startDate: string,
    endDate: string,
    lang: string = 'pt-br',
  ) {
    // Verify habit belongs to user
    await this.getHabit(habitId, userId, lang);

    return await this.prisma.habitLog.findMany({
      where: {
        habitId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'desc' },
    });
  }
}
