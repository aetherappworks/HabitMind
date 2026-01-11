import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Abstração de storage seguro que funciona em web, iOS e Android
 * - Web: Usa localStorage via AsyncStorage
 * - Mobile: Tenta usar expo-secure-store, fallback para AsyncStorage
 */

let SecureStore: any = null;

// Carregar SecureStore apenas se não for web
if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    console.warn('expo-secure-store não disponível, usando AsyncStorage');
  }
}

interface StorageAPI {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Storage seguro que funciona em todas as plataformas
 */
export const secureStorage: StorageAPI = {
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        // Web ou SecureStore indisponível
        await AsyncStorage.setItem(`secure_${key}`, value);
      } else {
        // Mobile com SecureStore disponível
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Storage error setting ${key}:`, error);
      // Fallback para AsyncStorage
      try {
        await AsyncStorage.setItem(`secure_${key}`, value);
      } catch (fallbackError) {
        console.error(`Fallback storage error:`, fallbackError);
      }
    }
  },

  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        // Web ou SecureStore indisponível
        return await AsyncStorage.getItem(`secure_${key}`);
      } else {
        // Mobile com SecureStore disponível
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Storage error getting ${key}:`, error);
      // Fallback para AsyncStorage
      try {
        return await AsyncStorage.getItem(`secure_${key}`);
      } catch (fallbackError) {
        console.error(`Fallback storage error:`, fallbackError);
        return null;
      }
    }
  },

  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        // Web ou SecureStore indisponível
        await AsyncStorage.removeItem(`secure_${key}`);
      } else {
        // Mobile com SecureStore disponível
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Storage error removing ${key}:`, error);
      // Fallback para AsyncStorage
      try {
        await AsyncStorage.removeItem(`secure_${key}`);
      } catch (fallbackError) {
        console.error(`Fallback storage error:`, fallbackError);
      }
    }
  },
};
