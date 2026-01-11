import React, { FC } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLanguageStore } from '../store/languageStore';
import { LANGUAGE_NAMES, AVAILABLE_LANGUAGES, Language } from '../i18n/i18n';
import { useI18n } from '../i18n/useI18n';

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
}

/**
 * Language selector component for switching between available languages
 */
export const LanguageSelector: FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useI18n();

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('ui.labels.language')}</Text>
      <View style={styles.buttonsContainer}>
        {AVAILABLE_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.button,
              language === lang && styles.buttonActive,
            ]}
            onPress={() => handleLanguageChange(lang)}
          >
            <Text
              style={[
                styles.buttonText,
                language === lang && styles.buttonTextActive,
              ]}
            >
              {LANGUAGE_NAMES[lang]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  buttonTextActive: {
    color: '#fff',
  },
});
