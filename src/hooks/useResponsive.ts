/**
 * Hook avançado para gerenciar responsividade
 * Sistema completo de detecção de dispositivos e adaptação de interface
 * Suporta todos os tipos de tela: mobile, tablet, desktop, TV, etc.
 */

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from 'react';

// Tipos para melhor tipagem
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop' | 'tv';
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveInfo {
  // Breakpoints básicos
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isTV: boolean;
  
  // Breakpoints detalhados
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  
  // Informações do dispositivo
  deviceType: DeviceType;
  orientation: Orientation;
  screenWidth: number;
  screenHeight: number;
  
  // Características especiais
  isTouchDevice: boolean;
  isRetina: boolean;
  prefersReducedMotion: boolean;
  isHighContrast: boolean;
  
  // Funções utilitárias
  down: (breakpoint: BreakpointKey) => boolean;
  up: (breakpoint: BreakpointKey) => boolean;
  between: (start: BreakpointKey, end: BreakpointKey) => boolean;
  only: (breakpoint: BreakpointKey) => boolean;
  
  // Configurações de layout
  getGridColumns: (context?: string) => number;
  getSpacing: () => number;
  getSidebarWidth: (collapsed?: boolean) => number;
  getCardSize: () => 'small' | 'medium' | 'large';
}

/**
 * Hook personalizado que fornece informações completas sobre responsividade
 * @returns Objeto com todas as informações de responsividade
 */
const useResponsive = (): ResponsiveInfo => {
  const theme = useTheme();
  
  // Estados para dimensões da tela
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  
  // Breakpoints detalhados (seguindo padrões modernos)
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // 1200px - 1536px
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // > 1536px
  const isXxl = useMediaQuery('(min-width: 1920px)'); // > 1920px (4K e ultrawide)
  
  // Breakpoints simplificados para compatibilidade
  const isMobile = isXs;
  const isTablet = isSm;
  const isDesktop = isMd || isLg;
  const isLargeDesktop = isXl;
  const isTV = isXxl;
  
  // Orientação
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const orientation: Orientation = isLandscape ? 'landscape' : 'portrait';
  
  // Características do dispositivo
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const isRetina = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isHighContrast = useMediaQuery('(prefers-contrast: high)');
  
  // Determinar tipo de dispositivo
  const getDeviceType = (): DeviceType => {
    if (isTV) return 'tv';
    if (isLargeDesktop) return 'largeDesktop';
    if (isDesktop) return 'desktop';
    if (isTablet) return 'tablet';
    return 'mobile';
  };
  
  const deviceType = getDeviceType();
  
  // Atualizar dimensões da tela
  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Funções utilitárias melhoradas
  const down = (breakpoint: BreakpointKey): boolean => {
    switch (breakpoint) {
      case 'xs': return false; // xs é o menor
      case 'sm': return isXs;
      case 'md': return isXs || isSm;
      case 'lg': return isXs || isSm || isMd;
      case 'xl': return !isXl;
      case 'xxl': return !isXxl;
      default: return false;
    }
  };

  const up = (breakpoint: BreakpointKey): boolean => {
    switch (breakpoint) {
      case 'xs': return true; // todos são >= xs
      case 'sm': return !isXs;
      case 'md': return isMd || isLg || isXl || isXxl;
      case 'lg': return isLg || isXl || isXxl;
      case 'xl': return isXl || isXxl;
      case 'xxl': return isXxl;
      default: return false;
    }
  };
  
  const between = (start: BreakpointKey, end: BreakpointKey): boolean => {
    return up(start) && down(end);
  };
  
  const only = (breakpoint: BreakpointKey): boolean => {
    switch (breakpoint) {
      case 'xs': return isXs;
      case 'sm': return isSm;
      case 'md': return isMd;
      case 'lg': return isLg;
      case 'xl': return isXl && !isXxl;
      case 'xxl': return isXxl;
      default: return false;
    }
  };
  
  // Configurações de layout adaptáveis
  const getGridColumns = (context?: string): number => {
    if (context === 'stats') {
      if (isMobile) return 12;
      if (isTablet) return 6;
      return 3; // Desktop e acima
    }
    
    if (context === 'sensors') {
      if (isMobile) return 12;
      if (isTablet) return 6;
      if (isDesktop) return 4;
      return 3; // Large desktop e acima
    }
    
    if (context === 'charts') {
      if (isMobile) return 12;
      return 6; // Tablet e acima
    }
    
    // Default
    if (isMobile) return 12;
    if (isTablet) return 6;
    if (isDesktop) return 4;
    if (isLargeDesktop) return 3;
    return 2; // TV/ultrawide
  };
  
  const getSpacing = (): number => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    return 4; // Large desktop/TV
  };
  
  const getSidebarWidth = (collapsed?: boolean): number => {
    if (collapsed) {
      if (isMobile) return 0;
      return 72; // Sidebar colapsada (corrigido para 72px)
    }
    if (isMobile) return 0; // Sidebar oculta em mobile
    if (isTablet) return 240; // Sidebar normal
    if (isDesktop) return 240; // Sidebar normal
    if (isLargeDesktop) return 280; // Sidebar expandida
    return 320; // TV/ultrawide
  };
  
  const getCardSize = (): 'small' | 'medium' | 'large' => {
    if (isMobile) return 'small';
    if (isTablet || isDesktop) return 'medium';
    return 'large'; // Large desktop/TV
  };

  return {
    // Breakpoints básicos
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTV,
    
    // Breakpoints detalhados
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    
    // Informações do dispositivo
    deviceType,
    orientation,
    screenWidth,
    screenHeight,
    
    // Características especiais
     isTouchDevice,
     isRetina,
     prefersReducedMotion,
     isHighContrast,
     
     // Funções utilitárias
     down,
     up,
     between,
     only,
     
     // Configurações de layout
     getGridColumns,
     getSpacing,
     getSidebarWidth,
     getCardSize
   };
 };
 
 export default useResponsive;