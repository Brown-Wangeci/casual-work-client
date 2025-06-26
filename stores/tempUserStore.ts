import { create } from 'zustand';
import { User } from '@/constants/Types';

interface TempUserStore {
  userProfile: User | null;
  setUserProfile: (user: User | null) => void;
  clearUserProfile: () => void;
}

export const useTempUserStore = create<TempUserStore>((set) => ({
  userProfile: null,
  setUserProfile: (user) => set({ userProfile: user }),
  clearUserProfile: () => set({ userProfile: null }),
}));
