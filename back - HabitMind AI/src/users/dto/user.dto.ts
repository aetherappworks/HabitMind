import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  email?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  planType: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreditsResponseDto {
  @ApiProperty({ example: 10 })
  availableCredits: number;

  @ApiProperty({ example: 10 })
  totalCredits: number;

  @ApiProperty({ example: 'free' })
  planType: string;

  @ApiProperty({ example: '2026-01-10T18:53:37.000Z', required: false })
  lastCreditRefillAt?: Date;
}
