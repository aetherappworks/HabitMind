import * as ptBR from './locales/pt-br.json';
import * as enUS from './locales/en-us.json';
import * as esES from './locales/es-es.json';

export type Language = 'pt-br' | 'en-us' | 'es-es';

export const AVAILABLE_LANGUAGES: Language[] = ['pt-br', 'en-us', 'es-es'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  'pt-br': 'Português (Brasil)',
  'en-us': 'English',
  'es-es': 'Español',
};

const translations: Record<Language, any> = {
  'pt-br': ptBR,
  'en-us': enUS,
  'es-es': esES,
};

/**
 * Get translation by key with dot notation
 * @param key Key with dot notation (e.g., 'auth.errors.invalid_credentials')
 * @param language Language code
 * @returns Translated string
 */
export const getTranslation = (key: string, language: Language = 'pt-br'): string => {
  try {
    const translation = translations[language];
    if (!translation) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translation;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
};

/**
 * Get translation with parameter interpolation
 * @param key Translation key
 * @param params Parameters to interpolate
 * @param language Language code
 * @returns Translated string with interpolated parameters
 */
export const getTranslationWithParams = (
  key: string,
  params: Record<string, string | number>,
  language: Language = 'pt-br'
): string => {
  let translation = getTranslation(key, language);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`:${param}`, String(value));
    });
  }

  return translation;
};

/**
 * Get all available languages
 */
export const getAvailableLanguages = (): Language[] => {
  return AVAILABLE_LANGUAGES;
};

/**
 * Get language display name
 */
export const getLanguageName = (language: Language): string => {
  return LANGUAGE_NAMES[language] || language;
};
