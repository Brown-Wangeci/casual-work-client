import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './zustandStorage';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/constants/Types';
import { validateToken } from '@/lib/utils';
import { useRouter } from 'expo-router';

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
          router.replace('/'); // Redirect to home after login
        } catch (error) {
          console.error('Error storing auth token:', error);
          // Optionally: show toast or fallback behavior
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('auth-token');
          set({ user: null, isAuthenticated: false, token: null });
          router.replace('/login'); // Redirect to login after logout
        } catch (error) {
          console.error('Error clearing auth token:', error);
          // Optionally: show toast or fallback behavior
          set({ user: null, isAuthenticated: false, token: null });
          router.replace('/login'); // Redirect to login after logout
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
