import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSensorsSlice, SensorsState } from './slices/sensors';
import localforage from 'localforage';

export interface UIState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  lastView: string;
  notifications: Array<{
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
  }>;
}

export interface AppState {
  ui: UIState;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  toggleDarkMode: () => void;
  setLastView: (view: string) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'read' | 'timestamp'>) => void;
  markNotificationRead: (id: number) => void;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

// Configuração de storage que funciona tanto no servidor quanto no cliente
const getStorage = () => {
  if (typeof window === 'undefined') {
    // No servidor, retorna um storage mock
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  // No cliente, usa localforage
  return localforage;
};

// Criar store com Zustand
export const useStore = create<AppState & SensorsState>()(

  persist(
    (set, get, api) => ({
      ...createSensorsSlice(set, get, api),
      
      // Hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // UI State
      ui: {
        darkMode: false,
        sidebarCollapsed: false,
        lastView: 'dashboard',
        notifications: []
      },

      // UI Actions
      toggleDarkMode: () => set(state => ({
        ui: {
          ...state.ui,
          darkMode: !state.ui.darkMode
        }
      })),
      
      setLastView: (view) => set(state => ({
        ui: {
          ...state.ui,
          lastView: view
        }
      })),
      
      addNotification: (notification) => set(state => ({
        ui: {
          ...state.ui,
          notifications: [
            {
              id: Date.now(),
              ...notification,
              read: false,
              timestamp: new Date().toISOString()
            },
            ...state.ui.notifications
          ]
        }
      })),
      
      markNotificationRead: (id) => set(state => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }
      }))
    }),
    {
      name: 'sensorview-storage',
      storage: createJSONStorage(() => getStorage()),
      skipHydration: true, // Evita problemas de hidratação
    }
  )
);