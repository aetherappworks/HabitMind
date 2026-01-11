import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from '../utils/secureStorage';
import { Platform } from 'react-native';

// No Android Emulator, localhost não funciona
// Use 10.0.2.2 para acessar o host (seu PC)
const getApiBaseUrl = (): string => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  // Se estiver no Android e usando localhost, converter para 10.0.2.2
  if (Platform.OS === 'android' && baseUrl.includes('localhost')) {
    return baseUrl.replace('localhost', '10.0.2.2');
  }
  
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await secureStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error retrieving token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          try {
            await secureStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('user');
            // Trigger logout event or navigation change
            // This should be handled by auth store
          } catch (storageError) {
            console.error('Error clearing storage:', storageError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T = any>(
    method: string,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client({
        method,
        url,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An error occurred';
        throw new Error(message);
      }
      throw error;
    }
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('GET', url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('POST', url, { data, ...config });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('PUT', url, { data, ...config });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('PATCH', url, { data, ...config });
  }
}

export const apiClient = new ApiClient();
