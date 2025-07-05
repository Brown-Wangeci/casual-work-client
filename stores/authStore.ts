import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './zustandStorage';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/constants/Types';
import { extractErrorMessage, logError, validateToken } from '@/lib/utils';
import { useRouter } from 'expo-router';
import axios from 'axios';

const router = useRouter();


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  token: string | null;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  updateUser: (partialUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  clearState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: async (user, token) => {
        try {
          await SecureStore.setItemAsync('auth-token', token);
          set({ user, isAuthenticated: true, token });
          router.replace('/');
        } catch (error) {
          console.error('Error storing auth token:', error);
        }
      },

      logout: async () => {
        const token = get().token;

        // Optimistically update UI immediately
        await SecureStore.deleteItemAsync('auth-token');
        set({ user: null, isAuthenticated: false, token: null, });

        // Send logout API in background
        if (token) {
          try {
            await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {}, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.info('Logout API call successful.');
          } catch (error: any) {
            logError(error, 'logout');
            const message = extractErrorMessage(error);
            console.warn('Logout error (after optimistic UI):', message);
          }
        } else {
          console.info('No token found; skipping logout API call.');
        }
      },



      loadToken: async () => {
        try {
          const storedToken = await SecureStore.getItemAsync('auth-token');
          if (storedToken) {
            const isValid = await validateToken(storedToken);
            if (!isValid) {
              console.warn('Stored token is invalid, logging out.');
              await get().logout();
              return;
            }
            set({ token: storedToken, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false, token: null });
          }
        } catch (error) {
          console.error('Error loading auth token:', error);
          set({ user: null, isAuthenticated: false, token: null });
        }
      },

      updateUser: (partialUser) => {
        const currentUser = get().user;
        if (!currentUser) {
          console.warn('No user to update. Ensure user is logged in before updating.');
          return;
        }
        set({ user: { ...currentUser, ...partialUser } });
      },

      refreshUser: async () => {
        const token = get().token;
        if (!token) {
          console.warn('No token available to refresh user.');
          return;
        }

        try {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ user: response.data.user });
          console.info('User refreshed successfully:', response.data.message || 'User data updated');
        } catch (error) {
          logError(error, 'refreshUser');
          const message = extractErrorMessage(error);
          console.warn('Failed to refresh user:', message);
        }
      },

      clearState: () => {
        set({ user: null, isAuthenticated: false, token: null, isHydrated: false });
      }
    }),
    {
      name: 'auth-storage',
      storage: zustandStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
      onRehydrateStorage: () => (state, error) => {
        (async () => {
          try {
            if (state?.loadToken) {
              await state.loadToken();
            }
          } catch (err) {
            console.error('Failed to load token during rehydration:', err);
          } finally {
            useAuthStore.setState({ isHydrated: true });
          }
        })();
      },

    }
  )
);
