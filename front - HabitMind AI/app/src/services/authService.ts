import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    planType: 'free' | 'premium';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  planType: 'free' | 'premium';
  createdAt: string;
}

export interface UserCredits {
  availableCredits: number;
  totalCredits: number;
  planType: 'free' | 'premium';
  lastCreditRefillAt: string | null;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/register', credentials);
  }

  async getProfile(): Promise<User> {
    return apiClient.get('/users/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put('/users/me', data);
  }

  async getCredits(): Promise<UserCredits> {
    return apiClient.get('/users/credits');
  }

  async deductCredits(amount: number, reason: string): Promise<UserCredits> {
    return apiClient.post('/users/deduct-credits', {
      amount,
      reason,
    });
  }
}

export const authService = new AuthService();
