import { Controller, Post, Get, Body, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { CreditCostDecorator } from '../common/decorators/credit-cost.decorator';
import { CreditCost } from '../common/services/rate-limit.service';
import { AiService } from './ai.service';
import { AnalyzeHabitDto, AIInsightResponseDto } from './dto/ai.dto';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RateLimitGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('analyze')
  @CreditCostDecorator(CreditCost.ANALYZE_HABIT)
  @ApiOperation({
    summary: 'Analyze habit and generate AI insights',
    description: 'Análise profunda de hábitos com IA. Custa 3 créditos no plano free.',
  })
  @ApiResponse({
    status: 201,
    description: 'AI insight generated successfully',
    type: AIInsightResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient credits (free plan: 20 credits/day)',
  })
  @ApiHeader({
    name: 'X-RateLimit-Limit',
    description: 'Maximum credits allowed',
  })
  @ApiHeader({
    name: 'X-RateLimit-Remaining',
    description: 'Credits remaining',
  })
  @ApiHeader({
    name: 'X-Credit-Cost',
    description: 'Credits debited for this request',
  })
  @ApiHeader({
    name: 'X-RateLimit-Type',
    description: 'Reset type (DAILY_RESET for free, HOURLY_RESET for premium)',
  })
  async analyzeHabit(
    @Request() req,
    @Body() analyzeHabitDto: AnalyzeHabitDto,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.aiService.analyzeHabit(req.user.id, analyzeHabitDto, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('insights')
  @CreditCostDecorator(CreditCost.GET_INSIGHTS)
  @ApiOperation({
    summary: 'Get AI insights for user',
    description: 'Obter insights rápidos. Custa 1 crédito no plano free.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of AI insights',
    type: [AIInsightResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient credits (free plan: 20 credits/day)',
  })
  @ApiHeader({
    name: 'X-RateLimit-Remaining',
    description: 'Credits remaining',
  })
  @ApiHeader({
    name: 'X-Credit-Cost',
    description: 'Credits debited for this request',
  })
  async getInsights(
    @Request() req,
    @Query('habitId') habitId?: string,
    @Query('lang') lang: string = 'pt-br',
  ) {
    try {
      return await this.aiService.getInsights(req.user.id, habitId, lang);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
