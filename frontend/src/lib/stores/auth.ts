import type { User } from '../../../../backend/src/entities/User';
import { trpc } from '../trpc';
import { writable } from 'svelte/store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  return {
    subscribe,
    login: async (email: string, password: string) => {
      try {
        const result = await trpc.auth.login.mutate({ email, password });
        const { user, token } = result;
        
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
      }
    },
    register: async (email: string, password: string, name?: string) => {
      try {
        const result = await trpc.auth.register.mutate({ email, password, name });
        const { user, token } = result;
        
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    },
    initialize: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      try {
        const { user } = await trpc.auth.me.query();
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  };
}

export const auth = createAuthStore();