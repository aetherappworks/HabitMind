/**
 * Exemplo de integração i18n em App.tsx
 * 
 * Este arquivo mostra como integrar o sistema de internacionalização
 * na inicialização da aplicação.
 */

import React, { useEffect } from 'react';
import { useLanguageStore } from './src/store/languageStore';
import { useAuthStore } from './src/store/authStore';

/**
 * Componente wrapper para inicializar i18n e autenticação
 * 
 * Este componente deve envolver a árvore de navegação da sua app
 */
export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Carregar idioma salvo
        console.log('Carregando idioma...');
        await useLanguageStore.getState().loadLanguage();

        // 2. Carregar autenticação (token, usuário)
        console.log('Carregando autenticação...');
        await useAuthStore.getState().loadAuth();

        console.log('App inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      }
    };

    initializeApp();
  }, []);

  return <>{children}</>;
};

/**
 * Exemplo completo de App.tsx com i18n
 */
export const AppExampleWithI18n = () => {
  return (
    <AppInitializer>
      {/* Sua árvore de navegação aqui */}
      {/* <RootNavigator /> */}
    </AppInitializer>
  );
};

/**
 * Exemplo de uso em um componente de tela
 */
export const ScreenExampleWithI18n = () => {
  const { t, language } = require('./src/i18n/useI18n').useI18n();

  return (
    <>
      <Text>{t('auth.messages.logged_in_successfully')}</Text>
      <Text>Idioma: {language}</Text>
    </>
  );
};

/**
 * Exemplo de mudança de idioma em Settings
 */
export const SettingsScreenExampleWithI18n = () => {
  const { t } = require('./src/i18n/useI18n').useI18n();
  const { setLanguage, language } = useLanguageStore();

  const handleLanguageChange = async (newLanguage) => {
    await setLanguage(newLanguage);
    console.log(`Idioma alterado para: ${newLanguage}`);
  };

  return (
    <View>
      {/* Usar o componente LanguageSelector */}
      {/* <LanguageSelector onLanguageChange={handleLanguageChange} /> */}
    </View>
  );
};
