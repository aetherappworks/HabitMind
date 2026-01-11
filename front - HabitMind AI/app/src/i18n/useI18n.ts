import { useCallback } from 'react';
import { useLanguageStore } from '../store/languageStore';
import {
  getTranslation,
  getTranslationWithParams,
  Language,
} from './i18n';

/**
 * Hook for using translations in components
 * @returns Object with translation functions
 */
export const useI18n = () => {
  const { language } = useLanguageStore();

  const t = useCallback(
    (key: string): string => {
      return getTranslation(key, language as Language);
    },
    [language]
  );

  const tParams = useCallback(
    (key: string, params: Record<string, string | number>): string => {
      return getTranslationWithParams(key, params, language as Language);
    },
    [language]
  );

  return { t, tParams, language };
};
