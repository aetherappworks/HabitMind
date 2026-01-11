import { Platform, ViewStyle } from 'react-native';

/**
 * Estilos de sombra que funcionam em iOS, Android e Web
 * Na web usa boxShadow, em mobile usa shadowColor
 */
export const shadows = {
  small: Platform.select({
    web: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } as any,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
  }) as ViewStyle,

  medium: Platform.select({
    web: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    } as any,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  }) as ViewStyle,

  large: Platform.select({
    web: {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    } as any,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  }) as ViewStyle,

  // Sombra suave específica para cards
  card: Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    } as any,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
  }) as ViewStyle,
};
