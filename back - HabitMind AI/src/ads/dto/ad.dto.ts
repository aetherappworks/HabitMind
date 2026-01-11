import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AdType {
  BANNER = 'banner',
  INTERSTITIAL = 'interstitial',
  REWARDED = 'rewarded',
}

export class CreateAdViewDto {
  @ApiProperty({ example: 'ad_123456', description: 'Ad ID from AdMob' })
  @IsString()
  adId: string;

  @ApiProperty({ enum: AdType, example: 'rewarded', description: 'Type of advertisement' })
  @IsEnum(AdType)
  adType: AdType;

  @ApiProperty({ example: 'google_reward_token_xyz', required: false })
  @IsOptional()
  @IsString()
  validationToken?: string;
}

export class AdViewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  adType: string;

  @ApiProperty()
  adId: string;

  @ApiProperty()
  viewedAt: Date;

  @ApiProperty()
  rewardClaimed: boolean;

  @ApiProperty()
  rewardAmount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdConfigDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  adType: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty({ example: 10, description: 'Credits awarded for watching' })
  rewardAmount: number;

  @ApiProperty({ example: 20, description: 'Maximum ads per day' })
  dailyLimit: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RewardCompletionDto {
  @ApiProperty({ example: 'habit_123', description: 'Habit ID' })
  @IsString()
  habitId: string;

  @ApiProperty({ example: 'google_reward_token', description: 'Token from Google AdMob' })
  @IsString()
  validationToken: string;

  @ApiProperty({ enum: AdType, example: 'rewarded' })
  @IsEnum(AdType)
  adType: AdType;
}

export class AdValidationDto {
  @ApiProperty({ example: 'ad_123456' })
  @IsString()
  adId: string;

  @ApiProperty({ example: 'google_token_xyz' })
  @IsString()
  validationToken: string;

  @ApiProperty({ enum: AdType })
  @IsEnum(AdType)
  adType: AdType;
}

export class AdStatsResponseDto {
  @ApiProperty({ example: 150, description: 'Total credits earned from ads' })
  totalCreditsEarned: number;

  @ApiProperty({ example: 20, description: 'Ads watched today' })
  adsWatchedToday: number;

  @ApiProperty({ example: 20, description: 'Maximum ads allowed today' })
  dailyLimit: number;

  @ApiProperty({ example: 0, description: 'Remaining ads for today' })
  remainingToday: number;

  @ApiProperty({ example: '2026-01-10T00:00:00Z', description: 'When daily limit resets' })
  resetTime: string;
}
