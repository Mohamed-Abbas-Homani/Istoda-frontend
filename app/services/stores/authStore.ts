import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, SignupData, LoginData } from "../api";

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup(data);
          set({
            user: response.user,
            token: response.token || response.access_token || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Signup failed",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          set({
            user: response.user,
            token: response.access_token || response.token || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "istoda-storage", // Using same name as old store for backward compatibility
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
