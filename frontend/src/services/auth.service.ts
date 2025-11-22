import api from '@/lib/api';
import { User, AuthTokens } from '@/types';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER';
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<{ user: User } & AuthTokens> {
    const response = await api.post('/api/auth/register', data);
    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { user, accessToken, refreshToken };
  },

  async login(data: LoginData): Promise<{ user: User } & AuthTokens> {
    const response = await api.post('/api/auth/login', data);
    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { user, accessToken, refreshToken };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Ignore errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/api/auth/reset-password', { token, password });
  },
};
