import { Controller, Post, Get, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('register-device')
  @ApiOperation({
    summary: 'Register device token for push notifications',
    description: 'Registra o token de notificação do dispositivo (Expo Push Token)',
  })
  @ApiResponse({
    status: 200,
    description: 'Device token registered successfully',
  })
  async registerDeviceToken(
    @Request() req,
    @Body() registerDeviceTokenDto: RegisterDeviceTokenDto,
  ) {
    return await this.notificationsService.registerDeviceToken(
      req.user.id,
      registerDeviceTokenDto.deviceToken,
    );
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get notification history',
    description: 'Busca histórico de notificações do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification history retrieved',
  })
  async getNotificationHistory(
    @Request() req,
    @Query('limit') limit: number = 50,
  ) {
    return await this.notificationsService.getNotificationHistory(
      req.user.id,
      Math.min(limit, 100), // Max 100
    );
  }

  @Post('mark-viewed/:id')
  @ApiOperation({
    summary: 'Mark notification as viewed',
    description: 'Marca uma notificação como visualizada',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as viewed',
  })
  async markAsViewed(@Param('id') notificationId: string) {
    return await this.notificationsService.markAsViewed(notificationId);
  }
}
