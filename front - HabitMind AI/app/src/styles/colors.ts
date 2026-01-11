/**
 * Paleta de Cores Pastel - HabitMind AI
 * Design system com tons suaves e agradáveis ao olho
 * Inspirado em apps de mindfulness e rastreamento de hábitos
 */

export const colors = {
  // Primária - Roxo Pastel (Confiança, Foco)
  primary: {
    50: '#F8F5FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#CAB5FE',
    400: '#B294FD',
    500: '#A78BFA', // Principal
    600: '#9370DB',
    700: '#7C56D8',
  },

  // Secundária - Rosa Pastel (Energia suave, Bem-estar)
  secondary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F8B4D8',
    400: '#F591C9',
    500: '#F472B6', // Principal
    600: '#EC4899',
    700: '#D4367D',
  },

  // Terciária - Azul Pastel (Serenidade, Calma)
  tertiary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#86EFAC', // Azul-verde pastel
    600: '#06B6D4',
    700: '#0891B2',
  },

  // Sucesso - Verde Pastel (Vitória, Conclusão)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBFBBB',
    300: '#86EFAC', // Principal
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
  },

  // Aviso - Amarelo Pastel (Atenção suave, Motivação)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D', // Principal
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Erro - Vermelho Pastel (Falha, Alerta)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5', // Principal
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },

  // Informação - Ciano Pastel (Info, Dicas)
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC', // Principal
    400: '#38BDF8',
    500: '#0EA5E9',
  },

  // Neutros - Tons de Cinza Suave
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    150: '#F0F0ED',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Background
  background: {
    default: '#FAFAF9',   // Branco com toque de bege
    card: '#FFFFFF',
    secondary: '#F5F5F4',
    overlay: 'rgba(0, 0, 0, 0.4)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  // Text
  text: {
    primary: '#292524',       // Preto suave
    secondary: '#78716C',     // Cinza médio
    tertiary: '#A8A29E',      // Cinza claro
    disabled: '#D6D3D1',      // Cinza bem claro
    inverse: '#FFFFFF',       // Branco
  },

  // Border
  border: {
    light: '#F5F5F4',
    default: '#E7E5E4',
    dark: '#D6D3D1',
  },

  // Feedback Colors (específicos para elementos)
  feedback: {
    checkedSuccess: '#86EFAC',    // Verde pastel - habitó concluído
    incompleteWarning: '#FCD34D', // Amarelo pastel - pendente
    skippedError: '#FCA5A5',      // Vermelho pastel - pulado
  },

  // Gradientes para backgrounds especiais
  gradients: {
    primary: ['#A78BFA', '#CAB5FE'], // Roxo
    secondary: ['#F472B6', '#FBCFE8'], // Rosa
    tertiary: ['#86EFAC', '#D4F3FF'], // Azul-verde
    success: ['#86EFAC', '#DCFCE7'], // Verde
  },
};

/**
 * Tema primário para o app
 * Use como referência para manter consistência
 */
export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export default theme;
