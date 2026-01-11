import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from '../utils/secureStorage';
import { authService, User, UserCredits } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  credits: UserCredits | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  loadCredits: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  credits: null,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      await secureStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      set({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, name: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ email, name, password });
      await secureStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      set({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await secureStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      set({
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuthStatus: async () => {
    try {
      const token = await secureStorage.getItem('accessToken');
      const userJson = await AsyncStorage.getItem('user');

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  loadCredits: async () => {
    try {
      const data = await authService.getCredits();
      set({ credits: data });
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  },
}));
