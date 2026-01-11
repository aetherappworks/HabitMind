import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeHabitDto {
  @ApiProperty()
  @Matches(/^[a-z0-9]{24,}$/, {
    message: 'habitId must be a valid CUID format',
  })
  habitId: string;

  @ApiProperty({
    example: 'pattern_analysis',
    enum: ['pattern_analysis', 'time_suggestion', 'encouragement', 'adjustment'],
  })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  context?: string;
}

export class AIInsightResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  habitId?: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  confidenceScore: number;

  @ApiProperty()
  createdAt: Date;
}
