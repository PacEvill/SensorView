import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
// Removendo o Provider do react-redux
// import { Provider } from 'react-redux';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Head from 'next/head';
import createEmotionCache from '../utils/createEmotionCache';
import { UnifiedThemeProvider, useThemeMode } from '../theme/ThemeProvider';

import { useRouter } from 'next/router';
// Importando useStore do nosso novo store baseado em Zustand
import { useStore } from '../store';
// Removendo a importação do store do Redux
// import { store } from '../store';
// Removendo a importação não utilizada
// import { initializeAuth } from '../store/slices/auth';
import '@/styles/globals.css';
// import '@/styles/accessibility.css';
// import '@/styles/landing.css';
// import '@/styles/auth.css';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Client-side cache, shared for the whole session of the user
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const PUBLIC_PATHS = ['/login', '/auth/forgot-password', '/auth/reset-password', '/auth/register']; // Adicione outras rotas públicas conforme necessário

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // No authentication required for sensor dashboard
  return <>{children}</>;
};

const NoAuthGuard = ({ children }: { children: React.ReactNode }) => {
  // No authentication required for sensor dashboard
  return <>{children}</>;
};

// Componente para sincronizar o tema entre Zustand e UnifiedThemeProvider
function ThemeSynchronizer() {
  const { mode } = useThemeMode();
  const darkMode = useStore(state => state.ui.darkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);

  // Sincronizar o tema do Zustand com o UnifiedThemeProvider
  useEffect(() => {
    // Verificar se há diferença entre os estados
    const isDark = mode === 'dark';
    if (isDark !== darkMode) {
      // Atualizar o estado do Zustand para corresponder ao UnifiedThemeProvider
      toggleDarkMode();
    }
  }, [mode, darkMode, toggleDarkMode]);

  return null;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const setLastView = useStore(state => state.setLastView);
  // Removed authentication logic for sensor dashboard

  // Acompanhar última página visitada
  useEffect(() => {
    const view = router.pathname;
    setLastView(view);
  }, [router.pathname, setLastView]);

  // Remover os estilos do servidor
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Detectar navegação por teclado para acessibilidade
  useEffect(() => {
    function handleFirstTab(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }

    window.addEventListener('keydown', handleFirstTab);
    
    return () => {
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);

  // Adicionar atributos de acessibilidade ao documento
  useEffect(() => {
    // Definir língua e direção do documento
    document.documentElement.lang = 'pt-BR';
    document.documentElement.dir = 'ltr';
    
    // Adicionar título descritivo
    if (!document.title) {
      document.title = 'SensorApp - Plataforma de Monitoramento de Sensores';
    }
    
    // Adicionar id para skip-to-content
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }, []);

  const isPublicRoute = PUBLIC_PATHS.includes(router.pathname);

  return (
    // Removendo o Provider do react-redux
    // <Provider store={store}>
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="SensorApp - Plataforma completa para monitoramento e gestão de sensores em tempo real." />
        <meta name="keywords" content="CRM, tarefas, voip, sip, gestão, negócios, comunicação, kanban, pipeline" />
        <meta property="og:title" content="SensorApp | Monitoramento Inteligente de Sensores" />
        <meta property="og:description" content="Plataforma completa para gestão integrada com comunicação em tempo real." />
        {/* Adicione outros meta tags relevantes aqui */}
      </Head>
      <UnifiedThemeProvider>
        <ThemeSynchronizer />
            <Toaster position="top-right" reverseOrder={false} />
            <ErrorBoundary>
              {isPublicRoute ? (
                <Component {...pageProps} />
              ) : (
                <AuthGuard>
                  <Component {...pageProps} />
                </AuthGuard>
              )}
            </ErrorBoundary>
      </UnifiedThemeProvider>
    </CacheProvider>
    // </Provider>
  );
}