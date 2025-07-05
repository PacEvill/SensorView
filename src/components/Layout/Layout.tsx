/**
 * Layout redesenhado para o TaskChat
 * Implementa as melhorias de UX/UI conforme o plano de melhorias
 * Versão otimizada com foco em acessibilidade, responsividade e experiência do usuário
 */

import React, { useState, useEffect } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, CssBaseline, useMediaQuery, Fade, Backdrop, CircularProgress } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Componentes redesenhados
import Header from './Header';
import Sidebar from './Sidebar';


// Hooks personalizados
import { useColorMode } from '../../hooks/useColorMode';
import { useHydration } from '../../hooks/useHydration';
import useResponsive from '../../hooks/useResponsive';

// Componentes estilizados responsivos
const MainContent = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'sidebarCollapsed' && 
    prop !== 'deviceType' && 
    prop !== 'sidebarWidth' &&
    prop !== 'spacing',
})<{
  sidebarCollapsed?: boolean;
  deviceType?: string;
  sidebarWidth?: number;
  spacing?: number;
}>(({ theme, spacing = 2 }) => ({
  flexGrow: 1,
  padding: theme.spacing(spacing),
  transition: theme.transitions.create(['padding', 'border-radius'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  overflowX: 'hidden',
  position: 'relative',
  borderTopLeftRadius: theme.spacing(2),
  boxShadow: `0 0 15px ${alpha(theme.palette.mode === 'dark' ? '#000' : '#888', 0.05)}`,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1400px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    borderTopLeftRadius: 0,
    boxShadow: 'none',
    maxWidth: '100vw',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    padding: theme.spacing(1.5),
    maxWidth: '98vw',
  },
}));

const ContentRow = styled(Box)({
  display: 'flex',
  flex: 1,
  minHeight: '100vh',
});

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}));

const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
}));

// Componente de carregamento
const LoadingOverlay = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 2,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  loading?: boolean;
}

const Layout = ({ 
  children, 
  title = 'TaskChat', 
  description = 'Gerenciamento de tarefas e comunicação integrados', 
  loading = false 
}: LayoutProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const responsive = useResponsive();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useHydration();
  
  // Extrair informações de responsividade
  const {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTV,
    getSpacing,
    getSidebarWidth
  } = responsive;

  // Gerenciar estado inicial da sidebar baseado no dispositivo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsed !== null) {
        setSidebarCollapsed(JSON.parse(savedCollapsed));
      } else {
        // Estado inicial baseado no tipo de dispositivo
        if (isMobile) {
          setSidebarCollapsed(true);
        } else if (isTablet) {
          setSidebarCollapsed(true);
        } else {
          setSidebarCollapsed(false);
        }
      }
    }
  }, [isMobile, isTablet, deviceType]);
  
  // Salvar estado da sidebar no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);
  
  // Auto-colapsar sidebar em dispositivos móveis
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Gerenciar estado de carregamento durante navegação
  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => setPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Função para alternar o estado da sidebar
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Marcar componente como montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Checagem de hidratação deve vir aqui, antes do return do JSX
  if (!hasHydrated) {
    return (
      <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <LayoutRoot>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content={description} />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="color-scheme" content={colorMode} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </Head>
      
      <CssBaseline />
      
      {/* Overlay de carregamento */}
      <LoadingOverlay open={loading || pageLoading}>
        <CircularProgress color="primary" />
      </LoadingOverlay>
      
      <Header sidebarCollapsed={sidebarCollapsed} onSidebarToggle={handleSidebarToggle} />
      
      <ContentRow>
        <Sidebar
          collapsed={sidebarCollapsed}
          onClose={handleSidebarToggle}
        />
        <MainContent
          sidebarCollapsed={sidebarCollapsed}
          deviceType={deviceType}
          sidebarWidth={getSidebarWidth(sidebarCollapsed)}
          spacing={getSpacing()}
          role="main"
          id="main-content"
          aria-label="Conteúdo principal"
        >
          <Box
            sx={{
              pt: { xs: 7, sm: 8, md: 9 },
              px: getSpacing(),
              pb: getSpacing(),
              minHeight: 'calc(100vh - 64px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Fade in={true} timeout={300}>
              <Box>
                {children}
              </Box>
            </Fade>
          </Box>
        </MainContent>
      </ContentRow>
    </LayoutRoot>
  );
};

export default Layout;