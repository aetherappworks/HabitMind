import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdService } from './ads.service';
import {
  CreateAdViewDto,
  AdViewResponseDto,
  RewardCompletionDto,
  AdValidationDto,
  AdConfigDto,
  AdStatsResponseDto,
} from './dto/ad.dto';

@ApiTags('Ads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ads')
export class AdsController {
  constructor(private adsService: AdService) {}

  /**
   * Record an ad view
   * POST /ads/view
   */
  @Post('view')
  @ApiOperation({ summary: 'Record an ad view' })
  @ApiResponse({
    status: 201,
    description: 'Ad view recorded',
    type: AdViewResponseDto,
  })
  async recordAdView(
    @Request() req,
    @Body() createAdViewDto: CreateAdViewDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.adsService.recordAdView(req.user.id, createAdViewDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Reward completion - Grant credits after habit completion with ad view
   * POST /ads/reward-completion
   */
  @Post('reward-completion')
  @ApiOperation({
    summary: 'Grant reward after habit completion with ad view',
    description: 'Validates ad token and grants credits for completing a habit after watching an ad',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward granted',
    schema: {
      properties: {
        success: { type: 'boolean' },
        creditsGranted: { type: 'number', example: 10 },
      },
    },
  })
  async rewardCompletion(
    @Request() req,
    @Body() rewardCompletionDto: RewardCompletionDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.adsService.handleRewardCompletion(
        req.user.id,
        rewardCompletionDto.habitId,
        rewardCompletionDto.validationToken,
        rewardCompletionDto.adType,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Validate ad view and claim reward
   * POST /ads/validation/:adId
   */
  @Post('validation/:adId')
  @ApiOperation({
    summary: 'Validate ad and claim reward',
    description: 'Validates the ad view token and marks reward as claimed',
  })
  @ApiResponse({
    status: 200,
    description: 'Ad validated and reward claimed',
    schema: {
      properties: {
        success: { type: 'boolean' },
        creditsGranted: { type: 'number', example: 10 },
      },
    },
  })
  async validateAdView(
    @Request() req,
    @Param('adId') adId: string,
    @Body() validationDto: AdValidationDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.adsService.validateAndRewardAd(
        req.user.id,
        adId,
        validationDto.validationToken,
        lang,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get ad configurations
   * GET /ads/config
   */
  @Get('config')
  @ApiOperation({
    summary: 'Get ad configurations',
    description: 'Returns available ad types and their reward configurations',
  })
  @ApiResponse({
    status: 200,
    description: 'Ad configurations',
    type: [AdConfigDto],
  })
  async getAdConfigs(@Query('lang') lang: string = 'pt-br') {
    try {
      return await this.adsService.getAdConfigs(lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get user ad statistics
   * GET /ads/stats
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get user ad statistics',
    description: 'Returns user\'s ad watching stats and remaining daily limit',
  })
  @ApiResponse({
    status: 200,
    description: 'Ad statistics',
    type: AdStatsResponseDto,
  })
  async getAdStats(
    @Request() req,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.adsService.getAdStats(req.user.id, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get user's ad viewing history
   * GET /ads/history
   */
  @Get('history')
  @ApiOperation({
    summary: 'Get user ad viewing history',
    description: 'Returns paginated list of ads watched by the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Ad history',
    schema: {
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  })
  async getAdHistory(
    @Request() req,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    try {
      return await this.adsService.getAdHistory(req.user.id, limit, offset);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
