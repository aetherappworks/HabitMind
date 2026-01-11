import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import { CreateAdViewDto, AdType, AdStatsResponseDto, AdConfigDto } from './dto/ad.dto';

@Injectable()
export class AdService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {
    this.initializeAdConfigs();
  }

  // Initialize default ad configurations
  private async initializeAdConfigs() {
    const existingConfigs = await this.prisma.adConfig.count();
    if (existingConfigs === 0) {
      await this.prisma.adConfig.createMany({
        data: [
          {
            adType: AdType.REWARDED,
            isEnabled: true,
            rewardAmount: 10,
            dailyLimit: 20,
          },
          {
            adType: AdType.BANNER,
            isEnabled: true,
            rewardAmount: 1,
            dailyLimit: 50,
          },
          {
            adType: AdType.INTERSTITIAL,
            isEnabled: true,
            rewardAmount: 5,
            dailyLimit: 10,
          },
        ],
      });
    }
  }

  /**
   * Record an ad view and grant credits if reward claimed
   */
  async recordAdView(
    userId: string,
    createAdViewDto: CreateAdViewDto,
    lang: string = 'pt-br',
  ) {
    // Verify ad configuration exists and is enabled
    const adConfig = await this.prisma.adConfig.findUnique({
      where: { adType: createAdViewDto.adType },
    });

    if (!adConfig || !adConfig.isEnabled) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.ad_type_not_enabled', lang),
      );
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayViews = await this.prisma.adView.count({
      where: {
        userId,
        adType: createAdViewDto.adType,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (todayViews >= adConfig.dailyLimit) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.daily_limit_reached', lang),
      );
    }

    // Create ad view record
    const adView = await this.prisma.adView.create({
      data: {
        userId,
        adType: createAdViewDto.adType,
        adId: createAdViewDto.adId,
        validationToken: createAdViewDto.validationToken,
        rewardAmount: adConfig.rewardAmount,
      },
    });

    return adView;
  }

  /**
   * Validate ad view and claim reward (grant credits)
   */
  async validateAndRewardAd(
    userId: string,
    adViewId: string,
    validationToken: string,
    lang: string = 'pt-br',
  ) {
    // Find the ad view
    const adView = await this.prisma.adView.findUnique({
      where: { id: adViewId },
    });

    if (!adView) {
      throw new NotFoundException(
        this.i18n.t('ads.errors.ad_view_not_found', lang),
      );
    }

    if (adView.userId !== userId) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.unauthorized_ad_claim', lang),
      );
    }

    if (adView.rewardClaimed) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.reward_already_claimed', lang),
      );
    }

    // Verify the token matches (in real implementation, validate with Google AdMob API)
    if (!this.validateToken(validationToken)) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.invalid_token', lang),
      );
    }

    // Get ad configuration to confirm reward amount
    const adConfig = await this.prisma.adConfig.findUnique({
      where: { adType: adView.adType },
    });

    if (!adConfig) {
      throw new NotFoundException(
        this.i18n.t('ads.errors.ad_config_not_found', lang),
      );
    }

    // Update ad view to mark reward as claimed
    const updatedAdView = await this.prisma.adView.update({
      where: { id: adViewId },
      data: {
        rewardClaimed: true,
        rewardAmount: adConfig.rewardAmount,
      },
    });

    // Update user's available credits
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          increment: adConfig.rewardAmount,
        },
        totalCredits: {
          increment: adConfig.rewardAmount,
        },
      },
    });

    return {
      success: true,
      adView: updatedAdView,
      creditsGranted: adConfig.rewardAmount,
    };
  }

  /**
   * Get all ad configurations
   */
  async getAdConfigs(lang: string = 'pt-br'): Promise<AdConfigDto[]> {
    const configs = await this.prisma.adConfig.findMany({
      where: { isEnabled: true },
    });

    return configs;
  }

  /**
   * Get ad statistics for a user
   */
  async getAdStats(userId: string, lang: string = 'pt-br'): Promise<AdStatsResponseDto> {
    // Get total credits earned from ads
    const totalCreditsEarned = await this.prisma.adView.aggregate({
      where: {
        userId,
        rewardClaimed: true,
      },
      _sum: {
        rewardAmount: true,
      },
    });

    // Get today's ad count by type
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const rewardedConfig = await this.prisma.adConfig.findUnique({
      where: { adType: AdType.REWARDED },
    });

    const adsWatchedToday = await this.prisma.adView.count({
      where: {
        userId,
        adType: AdType.REWARDED,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const dailyLimit = rewardedConfig?.dailyLimit || 20;
    const remainingToday = Math.max(0, dailyLimit - adsWatchedToday);

    return {
      totalCreditsEarned: totalCreditsEarned._sum.rewardAmount || 0,
      adsWatchedToday,
      dailyLimit,
      remainingToday,
      resetTime: tomorrow.toISOString(),
    };
  }

  /**
   * Get user's ad viewing history
   */
  async getAdHistory(userId: string, limit: number = 20, offset: number = 0) {
    const adViews = await this.prisma.adView.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.adView.count({
      where: { userId },
    });

    return {
      data: adViews,
      total,
      limit,
      offset,
    };
  }

  /**
   * Validate token - in production, this would call Google AdMob API
   * For now, we do basic validation
   */
  private validateToken(token: string): boolean {
    // TODO: Implement Google AdMob token validation
    // For now, just check if token is not empty
    return token && token.length > 0;
  }

  /**
   * Get reward completion endpoint - used after habit check-in
   */
  async handleRewardCompletion(
    userId: string,
    habitId: string,
    validationToken: string,
    adType: AdType,
    lang: string = 'pt-br',
  ) {
    // Verify habit exists and belongs to user
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== userId) {
      throw new NotFoundException(
        this.i18n.t('habits.errors.habit_not_found', lang),
      );
    }

    // Get ad configuration
    const adConfig = await this.prisma.adConfig.findUnique({
      where: { adType },
    });

    if (!adConfig || !adConfig.isEnabled) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.ad_type_not_enabled', lang),
      );
    }

    // Validate token
    if (!this.validateToken(validationToken)) {
      throw new BadRequestException(
        this.i18n.t('ads.errors.invalid_token', lang),
      );
    }

    // Create ad view record with reward claimed
    const adView = await this.prisma.adView.create({
      data: {
        userId,
        adType,
        adId: `habit_completion_${habitId}`,
        validationToken,
        rewardClaimed: true,
        rewardAmount: adConfig.rewardAmount,
      },
    });

    // Update user's available credits
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          increment: adConfig.rewardAmount,
        },
        totalCredits: {
          increment: adConfig.rewardAmount,
        },
      },
    });

    return {
      success: true,
      creditsGranted: adConfig.rewardAmount,
      adView,
    };
  }
}
