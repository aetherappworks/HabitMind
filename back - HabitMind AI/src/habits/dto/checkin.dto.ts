import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckinDto {
  @ApiProperty({ example: '2025-01-06' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'completed', enum: ['completed', 'pending', 'skipped'] })
  @IsEnum(['completed', 'pending', 'skipped'])
  status: string;

  @ApiProperty({ example: 'Did well today', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class HabitLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  habitId: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
