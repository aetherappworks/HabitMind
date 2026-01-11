import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { Language, AVAILABLE_LANGUAGES } from '../i18n/i18n';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  loadLanguage: () => Promise<void>;
  getAvailableLanguages: () => Language[];
}

const LANGUAGE_STORAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: Language = 'pt-br';

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: DEFAULT_LANGUAGE,

  setLanguage: async (language: Language) => {
    try {
      // Validate language
      if (!AVAILABLE_LANGUAGES.includes(language)) {
        console.warn(`Invalid language: ${language}. Using default.`);
        language = DEFAULT_LANGUAGE;
      }

      // Persist to secure storage
      await secureStorage.setItem(LANGUAGE_STORAGE_KEY, language);

      // Update state
      set({ language });

      // Also send to API for user preferences
      // This will be called when needed in components
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },

  loadLanguage: async () => {
    try {
      const savedLanguage = await secureStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage as Language)) {
        set({ language: savedLanguage as Language });
      } else {
        set({ language: DEFAULT_LANGUAGE });
      }
    } catch (error) {
      console.error('Error loading language:', error);
      set({ language: DEFAULT_LANGUAGE });
    }
  },

  getAvailableLanguages: () => AVAILABLE_LANGUAGES,
}));
