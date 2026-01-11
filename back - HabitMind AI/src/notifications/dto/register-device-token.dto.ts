import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceTokenDto {
  @ApiProperty({ example: 'ExponentPushToken[abc123...]' })
  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
