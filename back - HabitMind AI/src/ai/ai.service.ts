import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import { AnalyzeHabitDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  private readonly CREDIT_COST_ANALYSIS = 3; // 3 créditos por análise profunda

  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async analyzeHabit(userId: string, analyzeHabitDto: AnalyzeHabitDto, lang: string = 'pt-br') {
    const { habitId, type } = analyzeHabitDto;

    // Verify habit belongs to user
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException(
        this.i18n.t('habits.errors.habit_not_found', lang),
      );
    }

    // Check if user has enough credits
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { availableCredits: true },
    });

    if (!user || user.availableCredits < this.CREDIT_COST_ANALYSIS) {
      throw new BadRequestException(
        this.i18n.t('ai.errors.insufficient_credits', lang),
      );
    }

    // Get habit logs for context
    const recentLogs = await this.prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    // Generate AI insight (placeholder - will integrate with OpenAI)
    const insight = await this.generateInsight(habit, recentLogs, type, lang);

    // Deduct credits and save insight in a transaction
    const savedInsight = await this.prisma.aIInsight.create({
      data: {
        userId,
        habitId,
        type,
        content: insight.content,
        confidenceScore: insight.confidenceScore,
      },
    });

    // Update user's available credits (deduct)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          decrement: this.CREDIT_COST_ANALYSIS,
        },
      },
    });

    return savedInsight;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getInsights(userId: string, habitId?: string, lang: string = 'pt-br') {
    const where: any = { userId };

    if (habitId) {
      where.habitId = habitId;
    }

    return await this.prisma.aIInsight.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async generateInsight(
    habit: any,
    logs: any[],
    type: string,
    lang: string = 'pt-br',
  ) {
    // Placeholder implementation
    // This will be replaced with actual OpenAI integration

    const completedCount = logs.filter((log) => log.status === 'completed').length;
    const completionRate = logs.length > 0 ? (completedCount / logs.length) * 100 : 0;

    let content = '';
    let confidenceScore = 0.8;

    switch (type) {
      case 'pattern_analysis':
        content = `Your habit "${habit.title}" has a ${completionRate.toFixed(
          1,
        )}% completion rate over the last 30 days. ${
          completionRate > 70
            ? 'Keep up the great work!'
            : 'Consider adjusting your approach to improve consistency.'
        }`;
        break;

      case 'time_suggestion':
        content = `Based on your completion patterns, you might have better success if you try this habit ${habit.preferredTime || 'at a consistent time each day'}.`;
        confidenceScore = 0.7;
        break;

      case 'encouragement':
        content = `You're doing great with "${habit.title}"! Consistency is key to building lasting habits.`;
        break;

      case 'adjustment':
        content = `Consider breaking "${habit.title}" into smaller, more manageable steps to increase your completion rate.`;
        confidenceScore = 0.75;
        break;

      default:
        content = 'Keep tracking your habits for personalized insights.';
    }

    return {
      content,
      confidenceScore,
    };
  }
}
