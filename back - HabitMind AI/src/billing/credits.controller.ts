import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreditReloadService } from './credit-reload.service';
import {
  ManualReloadDto,
  AdRewardDto,
  PromoBonusDto,
  ReloadResponseDto,
  ReloadInfoResponseDto,
  CreditConfigDto,
} from './dto/credit-reload.dto';

/**
 * Controller para gerenciar recargas de créditos
 */
@Controller('credits')
export class CreditsController {
  constructor(
    private creditReloadService: CreditReloadService,
  ) {}

  /**
   * GET /credits/info
   * Obter informações atuais de créditos e próximo reset
   */
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getCreditsInfo(
    @Request() req: any,
  ): Promise<ReloadInfoResponseDto> {
    const lang = req.headers['accept-language'] || 'pt-br';
    return this.creditReloadService.getReloadInfo(req.user.id, lang);
  }

  /**
   * POST /credits/reload/manual
   * Recarregar créditos manualmente (compra)
   * Exemplo: { amount: 100 }
   */
  @Post('reload/manual')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reloadManual(
    @Request() req: any,
    @Body() reloadDto: ManualReloadDto,
  ): Promise<ReloadResponseDto> {
    const lang = req.headers['accept-language'] || 'pt-br';
    return this.creditReloadService.reloadCreditsManual(req.user.id, reloadDto.amount, lang);
  }

  /**
   * POST /credits/reload/force
   * Forçar recarga de créditos (respeitando limite de tempo)
   * Útil para usuários que querem recarregar antecipadamente
   */
  @Post('reload/force')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async forceReload(
    @Request() req: any,
  ): Promise<ReloadResponseDto> {
    const lang = req.headers['accept-language'] || 'pt-br';
    return this.creditReloadService.forceReload(req.user.id, lang);
  }

  /**
   * POST /credits/reward/ad
   * Adicionar créditos por visualização de anúncio
   * Exemplo: { amount: 10, adType: 'rewarded' }
   */
  @Post('reward/ad')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addAdReward(
    @Request() req: any,
    @Body() adRewardDto: AdRewardDto,
  ): Promise<ReloadResponseDto> {
    const lang = req.headers['accept-language'] || 'pt-br';
    return this.creditReloadService.addAdReward(
      req.user.id,
      adRewardDto.amount,
      adRewardDto.adType,
      lang,
    );
  }

  /**
   * POST /credits/bonus/promo
   * Adicionar bônus promocional (ADMIN ONLY)
   * Exemplo: { amount: 50, reason: "Novo usuário" }
   */
  @Post('bonus/promo')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addPromoBonus(
    @Request() req: any,
    @Body() promoBonusDto: PromoBonusDto,
  ): Promise<ReloadResponseDto> {
    // Verificar se é admin (implementar sua lógica de admin aqui)
    // if (req.user.role !== 'admin') {
    //   throw new ForbiddenException('Apenas admins podem adicionar bônus');
    // }

    const lang = req.headers['accept-language'] || 'pt-br';
    return this.creditReloadService.addPromoBonus(
      req.user.id,
      promoBonusDto.amount,
      promoBonusDto.reason,
      lang,
    );
  }

  /**
   * GET /credits/config/:planType
   * Obter configuração de créditos de um plano (admin)
   */
  @Get('config/:planType')
  @UseGuards(JwtAuthGuard)
  async getCreditConfig(
    @Param('planType') planType: 'free' | 'premium',
  ) {
    if (!['free', 'premium'].includes(planType)) {
      throw new BadRequestException('Tipo de plano inválido');
    }
    return this.creditReloadService.getCreditConfig(planType);
  }

  /**
   * POST /credits/config
   * Atualizar configuração de créditos (admin)
   * Exemplo: { planType: 'free', dailyLimit: 50 }
   */
  @Post('config')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateCreditConfig(
    @Body() configDto: CreditConfigDto,
  ) {
    // Verificar se é admin
    // if (req.user.role !== 'admin') {
    //   throw new ForbiddenException('Apenas admins podem atualizar configurações');
    // }

    this.creditReloadService.updateCreditConfig(configDto.planType, configDto);
    return {
      success: true,
      message: 'Configuração atualizada com sucesso',
      config: this.creditReloadService.getCreditConfig(configDto.planType),
    };
  }

  /**
   * POST /credits/user/:userId/bonus
   * Adicionar bônus a um usuário específico (admin)
   */
  @Post('user/:userId/bonus')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addBonusToUser(
    @Param('userId') userId: string,
    @Body() promoBonusDto: PromoBonusDto,
  ): Promise<ReloadResponseDto> {
    // Verificar se é admin
    // if (req.user.role !== 'admin') {
    //   throw new ForbiddenException('Apenas admins podem adicionar bônus');
    // }

    return this.creditReloadService.addPromoBonus(
      userId,
      promoBonusDto.amount,
      promoBonusDto.reason,
    );
  }
}
