import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdService } from './ads.service';
import { PrismaModule } from '../prisma/prisma.module';
import { I18nCustomModule } from '../i18n/i18n.module';

@Module({
  imports: [PrismaModule, I18nCustomModule],
  controllers: [AdsController],
  providers: [AdService],
  exports: [AdService],
})
export class AdsModule {}
