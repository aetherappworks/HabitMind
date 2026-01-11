import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from '../i18n/i18n.service';
import { AnalyzeHabitDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  private readonly CREDIT_COST_ANALYSIS = 3; // 3 créditos por análise profunda

  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async analyzeHabit(userId: string, analyzeHabitDto: AnalyzeHabitDto, lang: string = 'pt-br') {
    const { habitId, type } = analyzeHabitDto;

    // Verify habit belongs to user
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException(
        this.i18n.t('habits.errors.habit_not_found', lang),
      );
    }

    // Check if user has enough credits
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { availableCredits: true },
    });

    if (!user || user.availableCredits < this.CREDIT_COST_ANALYSIS) {
      throw new BadRequestException(
        this.i18n.t('ai.errors.insufficient_credits', lang),
      );
    }

    // Get habit logs for context
    const recentLogs = await this.prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    // Generate AI insight (placeholder - will integrate with OpenAI)
    const insight = await this.generateInsight(habit, recentLogs, type, lang);

    // Deduct credits and save insight in a transaction
    const savedInsight = await this.prisma.aIInsight.create({
      data: {
        userId,
        habitId,
        type,
        content: insight.content,
        impact: insight.impact,
        recommendations: insight.recommendations,
        insights: insight.insights,
        confidenceScore: insight.confidenceScore,
      },
    });

    // Update user's available credits (deduct)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          decrement: this.CREDIT_COST_ANALYSIS,
        },
      },
    });

    return savedInsight;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getInsights(userId: string, habitId?: string, lang: string = 'pt-br') {
    // Get all user's habits
    const userHabits = await this.prisma.habit.findMany({
      where: { userId },
      include: {
        habitLogs: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!userHabits || userHabits.length === 0) {
      return {
        suggestedHabits: [],
        message: this.i18n.t('ai.no_habits_yet', lang),
        recommendations: [],
      };
    }

    // Generate habit recommendations based on current habits
    const suggestedHabits = this.generateHabitRecommendations(userHabits, lang);

    return {
      suggestedHabits,
      totalCurrentHabits: userHabits.length,
      message: this.i18n.t('ai.habit_suggestions_generated', lang),
    };
  }

  // Gerar uma única sugestão e debitar créditos
  async getSingleSuggestion(userId: string, lang: string = 'pt-br') {
    // Get all user's habits
    const userHabits = await this.prisma.habit.findMany({
      where: { userId },
      include: {
        habitLogs: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    // If no habits, return generic suggestions instead of error
    if (!userHabits || userHabits.length === 0) {
      const genericSuggestions = this.getGenericHabitSuggestions(lang);
      const randomSuggestion = genericSuggestions[Math.floor(Math.random() * genericSuggestions.length)];
      
      // Deduct credits even for generic suggestions
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          availableCredits: {
            decrement: 2,
          },
        },
      });

      return {
        suggestedHabits: [randomSuggestion],
        totalCurrentHabits: 0,
        message: this.i18n.t('ai.habit_suggestion_generated', lang),
      };
    }

    // Generate one habit recommendation based on current habits
    const allSuggestions = this.generateHabitRecommendations(userHabits, lang);
    
    if (!allSuggestions || allSuggestions.length === 0) {
      // If no complementary suggestions, use generic suggestions
      const genericSuggestions = this.getGenericHabitSuggestions(lang);
      const randomSuggestion = genericSuggestions[Math.floor(Math.random() * genericSuggestions.length)];
      
      // Deduct credits
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          availableCredits: {
            decrement: 2,
          },
        },
      });

      return {
        suggestedHabits: [randomSuggestion],
        totalCurrentHabits: userHabits.length,
        message: this.i18n.t('ai.habit_suggestion_generated', lang),
      };
    }

    // Pick a random suggestion from the list
    const randomSuggestion = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];

    // Deduct credits (2 credits for a single suggestion)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          decrement: 2,
        },
      },
    });

    return {
      suggestedHabits: [randomSuggestion],
      totalCurrentHabits: userHabits.length,
      message: this.i18n.t('ai.habit_suggestion_generated', lang),
    };
  }

  private generateHabitRecommendations(habits: any[], lang: string = 'pt-br') {
    const habitsData = habits.map((habit) => {
      const completedCount = habit.habitLogs.filter((log: any) => log.status === 'completed').length;
      const completionRate = habit.habitLogs.length > 0 ? (completedCount / habit.habitLogs.length) * 100 : 0;
      
      return {
        title: habit.title,
        category: habit.category || 'other',
        frequency: habit.frequency,
        description: habit.description,
        completionRate,
        completed: completedCount,
        total: habit.habitLogs.length,
      };
    });

    const recommendations: any[] = [];
    
    for (const habit of habitsData) {
      const suggestions = this.suggestComplementaryHabits(habit, habitsData, lang);
      recommendations.push(...suggestions);
    }

    // Remove duplicates and limit to top 5
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map((item) => [item.title, item])).values(),
    ).slice(0, 5);

    return uniqueRecommendations;
  }

  private suggestComplementaryHabits(
    habit: any,
    allHabits: any[],
    lang: string,
  ): any[] {
    const suggestions: any[] = [];
    const existingTitles = new Set(allHabits.map((h) => h.title.toLowerCase()));

    // Complementary habit suggestions based on category and success rate
    const complementaryMap: { [key: string]: string[] } = {
      'exercise': [
        'Alongamento matinal',
        'Meditação pós-treino',
        'Hidratação adequada',
        'Nutritração balanceada',
      ],
      'meditation': [
        'Journaling reflexivo',
        'Leitura inspiradora',
        'Respiração consciente',
        'Yoga matinal',
      ],
      'study': [
        'Revisão de anotações',
        'Prática de exercícios',
        'Leitura complementar',
        'Resumo de conceitos',
      ],
      'health': [
        'Consumo de água',
        'Caminhada diária',
        'Alongamento',
        'Sono regular',
      ],
      'productivity': [
        'Planejamento diário',
        'Pausas estruturadas',
        'Organização de espaço',
        'Revisão de objetivos',
      ],
      'reading': [
        'Resumo do lido',
        'Discussão de livros',
        'Análise crítica',
        'Anotações de aprendizados',
      ],
      'other': [
        'Planejamento semanal',
        'Reflexão pessoal',
        'Avaliação de progresso',
      ],
    };

    const category = habit.category || 'other';
    const complementaryHabits = complementaryMap[category] || complementaryMap['other'];

    for (const complementary of complementaryHabits) {
      if (!existingTitles.has(complementary.toLowerCase())) {
        const confidence = this.calculateConfidence(habit.completionRate);
        suggestions.push({
          title: complementary,
          reason: this.getReasonForHabit(habit.title, complementary, category, lang),
          category: category,
          priority: this.calculatePriority(habit.completionRate, complementary),
          relatedHabit: habit.title,
          completionRate: habit.completionRate,
          confidence: confidence,
          benefits: this.getBenefitsForHabit(complementary, lang),
          difficulty: 'medium',
        });
      }
    }

    return suggestions;
  }

  private calculateConfidence(completionRate: number): number {
    // Higher completion rate = higher confidence in recommendation
    return Math.min(0.95, 0.6 + (completionRate / 100) * 0.35);
  }

  private calculatePriority(completionRate: number, habitTitle: string): number {
    // Habits with higher completion rates get priority for new suggestions
    let basePriority = completionRate / 100;
    
    // Adjust based on habit type
    if (habitTitle.toLowerCase().includes('exercise') || habitTitle.toLowerCase().includes('treino')) {
      basePriority += 0.1;
    }
    
    return Math.min(1, basePriority);
  }

  private getReasonForHabit(
    currentHabit: string,
    suggestedHabit: string,
    category: string,
    lang: string,
  ): string {
    const reasons: { [key: string]: string } = {
      'Alongamento matinal': `Complementa perfeitamente seu hábito de exercício, melhorando flexibilidade e reduzindo lesões.`,
      'Meditação pós-treino': `Ajuda na recuperação mental após o treino e reduz estresse acumulado.`,
      'Hidratação adequada': `Essencial para potencializar os resultados do exercício regular.`,
      'Nutritração balanceada': `Garante que seu corpo receba os nutrientes necessários para os treinos.`,
      'Journaling reflexivo': `Aprofunda os benefícios da meditação através da auto-reflexão.`,
      'Leitura inspiradora': `Complementa sua prática de meditação com conteúdo inspirador.`,
      'Respiração consciente': `Técnica fundamental que potencializa ainda mais sua prática meditativa.`,
      'Yoga matinal': `Combina exercício suave com consciência meditativa.`,
      'Revisão de anotações': `Reforça o aprendizado e melhora a retenção do conhecimento.`,
      'Prática de exercícios': `Aplica na prática o que você estuda, consolidando o conhecimento.`,
      'Leitura complementar': `Expande seus conhecimentos além do que você já estuda.`,
      'Resumo de conceitos': `Organiza e solidifica o conteúdo estudado para melhor compreensão.`,
      'Consumo de água': `Melhora a saúde geral e energia disponível para suas atividades.`,
      'Caminhada diária': `Complementa sua rotina de saúde com atividade leve e consistente.`,
      'Alongamento': `Melhora a mobilidade e completa rotinas de saúde e bem-estar.`,
      'Sono regular': `Garante recuperação adequada e melhora todos os outros hábitos.`,
      'Planejamento diário': `Maximiza a produtividade ao organizar suas prioridades.`,
      'Pausas estruturadas': `Melhora a produtividade evitando burnout e mantendo foco.`,
      'Organização de espaço': `Um espaço organizado aumenta significativamente a produtividade.`,
      'Revisão de objetivos': `Mantém o alinhamento com suas metas e maximiza produtividade.`,
      'Resumo do lido': `Consolida o aprendizado e facilita a retenção de informação.`,
      'Discussão de livros': `Aprofunda a compreensão através de perspectivas diferentes.`,
      'Análise crítica': `Desenvolve pensamento crítico e absorção mais profunda.`,
      'Anotações de aprendizados': `Registra insights importantes para futuras referências.`,
      'Planejamento semanal': `Organiza suas semanas e melhora a consistência em todos os hábitos.`,
      'Reflexão pessoal': `Autoconhecimento melhora a qualidade de todos os seus hábitos.`,
      'Avaliação de progresso': `Motiva mantendo visibilidade dos seus avanços.`,
    };

    return reasons[suggestedHabit] || `Este hábito complementa bem seu atual hábito de ${currentHabit}.`;
  }

  private getBenefitsForHabit(habitTitle: string, lang: string): string[] {
    const benefits: { [key: string]: string[] } = {
      'Alongamento matinal': [
        'Aumenta flexibilidade',
        'Melhora circulação',
        'Reduz dores musculares',
        'Prepara o corpo para o dia',
      ],
      'Meditação pós-treino': [
        'Acelera recuperação mental',
        'Reduz cortisol',
        'Melhora sono',
        'Aumenta foco',
      ],
      'Hidratação adequada': [
        'Melhora energia',
        'Favorece recuperação',
        'Melhora cognição',
        'Aumenta resistência',
      ],
      'Nutritração balanceada': [
        'Potencializa treinos',
        'Melhora saúde geral',
        'Estabiliza energia',
        'Previne doenças',
      ],
      'Journaling reflexivo': [
        'Melhora autoconhecimento',
        'Reduz ansiedade',
        'Consolida aprendizados',
        'Aumenta criatividade',
      ],
      'Leitura inspiradora': [
        'Expande perspectivas',
        'Motiva ações',
        'Reduz estresse',
        'Desenvolve vocabulário',
      ],
      'Respiração consciente': [
        'Reduz ansiedade',
        'Melhora foco',
        'Estabiliza emoções',
        'Melhora saúde cardiovascular',
      ],
      'Yoga matinal': [
        'Fortalece corpo',
        'Melhora flexibilidade',
        'Prepara mente',
        'Estabelece ritmo positivo',
      ],
      'Planejamento diário': [
        'Aumenta produtividade',
        'Reduz estresse',
        'Melhora foco',
        'Garante progresso',
      ],
      'Pausas estruturadas': [
        'Mantém foco',
        'Evita burnout',
        'Melhora criatividade',
        'Aumenta qualidade de trabalho',
      ],
      'Sono regular': [
        'Melhora recuperação',
        'Aumenta imunidade',
        'Melhora cognição',
        'Estabiliza emoções',
      ],
    };

    return benefits[habitTitle] || [
      'Melhora bem-estar geral',
      'Complementa outros hábitos',
      'Potencializa resultados',
    ];
  }

  private async generateInsight(
    habit: any,
    logs: any[],
    type: string,
    lang: string = 'pt-br',
  ) {
    const completedCount = logs.filter((log) => log.status === 'completed').length;
    const completionRate = logs.length > 0 ? (completedCount / logs.length) * 100 : 0;
    const skippedCount = logs.filter((log) => log.status === 'skipped').length;
    const pendingCount = logs.filter((log) => log.status === 'pending').length;

    // Calculate streak
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (const log of logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())) {
      if (log.status === 'completed') {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        if (currentStreak === 0) currentStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Analyze completion patterns
    const lastWeekLogs = logs.slice(0, 7);
    const lastWeekCompleted = lastWeekLogs.filter((log) => log.status === 'completed').length;
    const trendingUp = lastWeekCompleted > completedCount / (logs.length / 7);

    let content = '';
    let impact = '';
    let recommendations: string[] = [];
    let insights: string[] = [];
    let confidenceScore = 0.85;

    switch (type) {
      case 'pattern_analysis':
        content = `**Análise Profunda do Hábito "${habit.title}"**

Seu desempenho em 30 dias:
• Taxa de conclusão: ${completionRate.toFixed(1)}%
• Vezes completado: ${completedCount} de ${logs.length}
• Sequência máxima: ${maxStreak} dias
• Sequência atual: ${currentStreak} dias
• Vezes pulado: ${skippedCount}
• Pendentes: ${pendingCount}

${trendingUp 
  ? '✅ Tendência positiva: você está melhorando!' 
  : '⚠️ Tendência negativa: considere revisitar sua abordagem'}

Padrão detectado: Você tem maior consistência ${currentStreak > maxStreak * 0.7 ? 'recentemente' : 'em períodos anteriores'}. Isso mostra que ${currentStreak > maxStreak * 0.7 ? 'você está em uma fase produtiva' : 'você pode estar passando por um desafio momentâneo'}.`;

        impact = `Este hábito "${habit.title}" pode impactar significativamente sua vida:

📈 **Impacto Físico**: Hábitos consistentes criam adaptações neurológicas e físicas duradouras. Com ${completionRate.toFixed(0)}% de consistência, você já está criando mudanças reais.

🧠 **Impacto Psicológico**: A construção de sequências cria autoconfiança. Cada conclusão reforça sua identidade como alguém que cumpre compromissos.

⚡ **Impacto Prático**: ${completionRate > 70 
  ? 'Você está no caminho certo! Essa taxa indica que o hábito está se tornando automático.' 
  : 'Com mais consistência, este hábito pode se tornar uma parte natural da sua rotina.'}

🎯 **Impacto de Longo Prazo**: Se você manter esse ritmo por ${Math.ceil(90 * (100 / Math.max(completionRate, 1)))} dias, este hábito será praticamente automático.`;

        recommendations = [
          completionRate < 50
            ? `Comece pequeno: reduza a dificuldade inicial de "${habit.title}" para torná-lo mais fácil de cumprir`
            : `Aumente gradualmente a intensidade ou duração de "${habit.title}" para desafiar-se mais`,
          
          currentStreak < 7
            ? `Defina um lembrete diário para "${habit.title}" na sua hora preferida (${habit.preferredTime || 'manhã'})`
            : `Celebre suas sequências! Você já construiu ${currentStreak} dias - mantenha a motivação`,
          
          skippedCount > completedCount * 0.5
            ? `Identifique quando você está pulando: é falta de tempo, motivação ou dificuldade? Ajuste conforme necessário`
            : `Você está muito bom em não pular! Continue assim`,
          
          completionRate > 80
            ? `Parabéns! Seu hábito está bem consolidado. Considere adicionar um novo hábito complementar`
            : `Defina mini-metas semanais: tente completar ${Math.ceil(logs.length / 4)} vezes na próxima semana`,
        ];

        insights = [
          `Seu melhor período foi uma sequência de ${maxStreak} dias - use isso como prova de que você consegue!`,
          `${completionRate > 70 ? 'Você está acima da média na consistência!' : 'Muitas pessoas começam com essa taxa - consistência é mais importante que perfeição'}`,
          `Se você manter ${completionRate.toFixed(0)}% por 90 dias, este hábito será praticamente no "piloto automático"`,
          `O padrão de seus pulos pode revelar obstáculos: ${pendingCount > completedCount ? 'você deixa pendências acumularem' : 'você é decisivo sobre conclusões'}`,
        ];

        confidenceScore = Math.min(0.95, 0.75 + (logs.length / 100) * 0.2);
        break;

      case 'time_suggestion':
        content = `**Sugestão de Melhor Horário**

Com base em seus padrões, você poderia ter melhor sucesso com "${habit.title}" ${
  habit.preferredTime 
    ? `em torno de ${habit.preferredTime}` 
    : 'pela manhã (entre 6h-9h) ou inicio da noite (entre 18h-20h)'
}.

Razão: Hábitos definidos em horários consistentes criam associações psicológicas fortes, tornando-os automáticos.`;

        impact = `Escolher o horário ideal pode aumentar sua consistência em até 40%. Isso significa mais dias bem-sucedidos e maior impacto dos benefícios.`;

        recommendations = [
          `Tente realizar "${habit.title}" sempre no mesmo horário por 7 dias e veja se a consistência melhora`,
          `Use um lembrete de notificação 10 minutos antes do seu horário ideal`,
          `Combine com outro hábito que você já tem: "Após [hábito existente], faço [seu hábito]"`,
        ];

        insights = [
          `Pessoas que estabelecem horários fixos têm 2x mais chance de sucesso`,
          `O melhor horário é aquele que você pode cumprir consistentemente`,
        ];

        confidenceScore = 0.7;
        break;

      case 'encouragement':
        content = `**Você está sendo incrível! 🎉**

Apenas o fato de estar rastreando "${habit.title}" já mostra compromisso. ${completionRate > 50 ? 'Você está mantendo uma taxa sólida de sucesso!' : 'Cada tentativa conta - persista!'}

Este hábito está transformando você dia a dia.`;

        impact = `A persistência é o verdadeiro super poder. Cada dia que você se esforça, está reescrevendo sua história pessoal.`;

        recommendations = [
          `Reflita sobre como você se sente quando completa "${habit.title}"`,
          `Compartilhe seu progresso com alguém que se importa`,
          `Recompense-se quando atingir milestones (7 dias, 30 dias, 100 dias)`,
        ];

        insights = [
          `Você já completou este hábito ${completedCount} vezes - essa é uma grande conquista!`,
          `A jornada de 1000 km começa com um single step. Você já deu ${completedCount}!`,
        ];

        confidenceScore = 0.9;
        break;

      case 'adjustment':
        content = `**Ajustes para Melhorar Seu Sucesso**

Vejo que você está em ${completionRate < 30 ? 'um desafio significativo' : completionRate < 60 ? 'uma fase de ajuste' : 'um bom ritmo, mas pode melhorar'}.

Sugestões:
${completionRate < 30 
  ? `• Reduza a complexidade de "${habit.title}" pela metade
• Comece com apenas ${Math.max(1, Math.floor(habit.title.length / 5))} minutos por dia
• Identifique e remova obstáculos específicos` 
  : `• Mantenha o que está funcionando
• Adicione um elemento novo para renovar seu interesse
• Desafie-se a aumentar a dificuldade em 10%`}`;

        impact = `Os ajustes corretos podem transformar um hábito falho em um sucesso. Pequenas mudanças levam a grandes resultados.`;

        recommendations = [
          completionRate < 30 ? `Simplifique drasticamente "${habit.title}"` : `Intensifique gradualmente "${habit.title}"`,
          `Experimente com diferentes horários`,
          `Adicione um elemento de responsabilidade (amigo, app, journal)`,
        ];

        insights = [
          `Mudanças funciona melhor quando são graduais, não radicais`,
          `O ajuste correto pode aumentar sua taxa de sucesso em até 50%`,
        ];

        confidenceScore = 0.8;
        break;

      default:
        content = `Continuar rastreando seus hábitos para ganhar insights mais profundos e personalizados.`;
        recommendations = ['Mantenha o rastreamento consistente'];
        insights = ['Dados são a base de análises precisas'];
        confidenceScore = 0.6;
    }

    return {
      content,
      impact,
      recommendations,
      insights,
      confidenceScore,
    };
  }

  private getGenericHabitSuggestions(lang: string = 'pt-br'): any[] {
    const genericSuggestions = [
      {
        title: 'Meditação Matinal',
        reason: 'Uma excelente forma de começar o dia com clareza e foco.',
        category: 'meditation',
        priority: 0.9,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.85,
        benefits: ['Reduz estresse', 'Melhora foco', 'Estabiliza emoções', 'Aumenta criatividade'],
        difficulty: 'easy',
      },
      {
        title: 'Exercício Físico',
        reason: 'Atividade essencial para saúde, energia e bem-estar geral.',
        category: 'exercise',
        priority: 0.95,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.9,
        benefits: ['Melhora saúde cardiovascular', 'Aumenta energia', 'Reduz estresse', 'Melhora sono'],
        difficulty: 'medium',
      },
      {
        title: 'Leitura Diária',
        reason: 'Expande conhecimento e oferece momento de relaxamento.',
        category: 'reading',
        priority: 0.8,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.8,
        benefits: ['Aumenta conhecimento', 'Reduz estresse', 'Melhora vocabulário', 'Estimula criatividade'],
        difficulty: 'easy',
      },
      {
        title: 'Planejamento Diário',
        reason: 'Organizando seu dia, você aumenta produtividade e reduz ansiedade.',
        category: 'productivity',
        priority: 0.85,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.85,
        benefits: ['Aumenta produtividade', 'Reduz estresse', 'Melhora foco', 'Garante progresso'],
        difficulty: 'easy',
      },
      {
        title: 'Hidratação Adequada',
        reason: 'Essencial para manter energia, cognição e saúde geral.',
        category: 'health',
        priority: 0.9,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.88,
        benefits: ['Melhora energia', 'Melhora cognição', 'Melhora saúde', 'Aumenta resistência'],
        difficulty: 'easy',
      },
      {
        title: 'Journaling Reflexivo',
        reason: 'Auto-reflexão que melhora autoconhecimento e clareza pessoal.',
        category: 'meditation',
        priority: 0.75,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.8,
        benefits: ['Melhora autoconhecimento', 'Reduz ansiedade', 'Consolida aprendizados', 'Aumenta criatividade'],
        difficulty: 'easy',
      },
      {
        title: 'Caminhada Diária',
        reason: 'Atividade leve que melhora saúde física e mental.',
        category: 'health',
        priority: 0.85,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.82,
        benefits: ['Melhora cardiovascular', 'Aumenta energia', 'Reduz estresse', 'Melhora sono'],
        difficulty: 'easy',
      },
      {
        title: 'Sono Regular',
        reason: 'Base fundamental para recuperação, saúde e bem-estar geral.',
        category: 'health',
        priority: 0.95,
        relatedHabit: null,
        completionRate: 0,
        confidence: 0.9,
        benefits: ['Melhora recuperação', 'Aumenta imunidade', 'Melhora cognição', 'Estabiliza emoções'],
        difficulty: 'medium',
      },
    ];

    return genericSuggestions;
  }
}
