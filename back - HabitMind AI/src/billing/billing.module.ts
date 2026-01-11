import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { I18nCustomModule } from '../i18n/i18n.module';
import { CreditReloadService } from './credit-reload.service';
import { CreditsController } from './credits.controller';

@Module({
  imports: [PrismaModule, I18nCustomModule],
  providers: [CreditReloadService],
  controllers: [CreditsController],
  exports: [CreditReloadService],
})
export class BillingModule {}
