import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin } from '../types';
import api from '../lib/api';

interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, admin } = res.data.data;
          localStorage.setItem('kelebri_token', token);
          set({ token, admin, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('kelebri_token');
        set({ token: null, admin: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ admin: res.data.data, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'kelebri-auth',
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
        isAuthenticated: !!state.token,
      }),
    }
  )
);
