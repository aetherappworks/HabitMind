import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';
import { AiModule } from './ai/ai.module';
import { CommonModule } from './common/common.module';
import { I18nCustomModule } from './i18n/i18n.module';
import { AdsModule } from './ads/ads.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nCustomModule,
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    HabitsModule,
    AiModule,
    AdsModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
