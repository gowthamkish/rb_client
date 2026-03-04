import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  upgradePlan: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  upgradePlan: () =>
    set((state) =>
      state.user ? { user: { ...state.user, plan: "premium" } } : {},
    ),
}));
