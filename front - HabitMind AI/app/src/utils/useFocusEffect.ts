import { useEffect, useCallback, DependencyList } from 'react';
import { Platform } from 'react-native';

/**
 * Hook que funciona em web, iOS e Android
 * - Web: usa useEffect normal
 * - Mobile: usa useFocusEffect do React Navigation
 */

let useFocusEffect: any = null;

if (Platform.OS !== 'web') {
  try {
    const navModule = require('@react-navigation/native');
    useFocusEffect = navModule.useFocusEffect;
  } catch (e) {
    console.warn('useFocusEffect não disponível, usando useEffect');
  }
}

/**
 * Hook cross-platform para executar ação ao focar tela
 * @param effect Função a executar
 * @param deps Dependências
 */
export function useFocusEffect_CrossPlatform(
  effect: () => void | (() => void),
  deps?: DependencyList
) {
  if (Platform.OS === 'web' || !useFocusEffect) {
    // Web: usar useEffect normal
    useEffect(effect, deps);
  } else {
    // Mobile: usar useFocusEffect
    const navUseFocusEffect = require('@react-navigation/native').useFocusEffect;
    navUseFocusEffect(useCallback(effect, deps || []));
  }
}

export { useFocusEffect_CrossPlatform as useFocusEffect };
