import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
}

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface Store {
  user: User | null;
  token: string | null;
  notifications: Notification[];
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      notifications: [],
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ user: null, token: null }),

      addNotification: (message, type) => {
        const id = Date.now().toString();
        set((state) => ({
          notifications: [...state.notifications, { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, 2000);
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "istoda-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }), // don't persist notifications
    },
  ),
);
