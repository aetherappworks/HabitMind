import { IsString, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({ example: 'Morning Exercise' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Do 30 minutes of exercise', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'daily', enum: ['daily', 'weekly', 'custom'] })
  @IsEnum(['daily', 'weekly', 'custom'])
  frequency: string;

  @ApiProperty({ example: '07:00', required: false })
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  preferredTime?: string;
}

export class UpdateHabitDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'custom'])
  frequency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  preferredTime?: string;
}

export class HabitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  preferredTime?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
