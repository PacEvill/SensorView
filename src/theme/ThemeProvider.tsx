'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
});

interface UnifiedThemeProviderProps {
  children: ReactNode;
}

export const UnifiedThemeProvider = ({ children }: UnifiedThemeProviderProps) => {
  // Verifica se há preferência salva no localStorage ou usa preferência do sistema
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      if (savedMode) return savedMode;
      
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDarkMode ? 'dark' : 'light';
    }
    return 'light';
  });

  // Adicionando controle de hidratação para evitar flash de tema errado
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Atualiza o localStorage quando o modo muda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
      
      // Atualiza o atributo data-theme no elemento html para estilização global
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  // Alterna entre os modos claro e escuro
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Cria o tema com base no modo atual
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#1890FF' : '#0069c0', // Azul mais escuro no modo claro para melhor contraste
          contrastText: '#ffffff',
        },
        secondary: {
          main: mode === 'dark' ? '#13C2C2' : '#008f8f', // Verde-azulado mais escuro no modo claro
          contrastText: '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#000000',
          secondary: mode === 'dark' ? '#e0e0e0' : '#424242', // Cinza mais escuro no modo claro
        },
        background: {
          default: mode === 'dark' ? '#1C1C1E' : '#ffffff',
          paper: mode === 'dark' ? '#2C2C2E' : '#ffffff',
        },
        error: {
          main: mode === 'dark' ? '#f44336' : '#c62828', // Vermelho mais escuro no modo claro
        },
        warning: {
          main: mode === 'dark' ? '#ff9800' : '#e65100', // Laranja mais escuro no modo claro
        },
        info: {
          main: mode === 'dark' ? '#2196f3' : '#0069c0', // Azul mais escuro no modo claro
        },
        success: {
          main: mode === 'dark' ? '#4caf50' : '#2e7d32', // Verde mais escuro no modo claro
        },
      },
    });
  }, [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
    }),
    [mode]
  );

  // Só renderiza o tema após hidratar no cliente
  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acessar o contexto do tema
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode deve ser usado dentro de um UnifiedThemeProvider');
  }
  return context;
};

export default UnifiedThemeProvider;