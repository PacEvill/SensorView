// Design Tokens - Sistema de Design Centralizado
// Este arquivo contém todas as constantes de design para manter consistência

export const DESIGN_TOKENS = {
  // 🎨 Cores Principais (Apple-inspired)
  colors: {
    primary: {
      main: '#0A84FF',
      light: '#5AC8FA',
      dark: '#0051D5',
      contrast: '#FFFFFF'
    },
    secondary: {
      main: '#8E8E98',
      light: '#C7C7CC',
      dark: '#636366',
      contrast: '#FFFFFF'
    },
    success: {
      main: '#34C759',
      light: '#30D158',
      dark: '#248A3D',
      contrast: '#FFFFFF'
    },
    error: {
      main: '#FF3B30',
      light: '#FF453A',
      dark: '#D70015',
      contrast: '#FFFFFF'
    },
    warning: {
      main: '#FF9500',
      light: '#FF9F0A',
      dark: '#C93400',
      contrast: '#000000'
    },
    info: {
      main: '#5AC8FA',
      light: '#64D2FF',
      dark: '#007AFF',
      contrast: '#000000'
    },
    grey: {
      50: '#F2F2F7',
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#2C2C2E',
      950: '#1C1C1E'
    }
  },

  // 📱 Breakpoints Responsivos
  breakpoints: {
    xs: 0,      // Mobile portrait
    sm: 600,    // Mobile landscape / Tablet portrait
    md: 900,    // Tablet landscape / Small desktop
    lg: 1200,   // Desktop
    xl: 1536,   // Large desktop
    xxl: 1920   // 4K / Ultrawide
  },

  // 📐 Espaçamentos
  spacing: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48   // 48px
  },

  // 📝 Tipografia Responsiva
  typography: {
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    h5: {
      fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    h6: {
      fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    },
    // Variantes específicas
    statsValue: {
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    statsLabel: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    sensorName: {
      fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.01em'
    },
    sensorType: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    statusLabel: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    }
  },

  // 🎭 Animações
  animations: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
      slower: '0.8s'
    },
    easing: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    keyframes: {
      fadeInUp: {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      },
      fadeInDown: {
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      },
      slideInLeft: {
        from: { opacity: 0, transform: 'translateX(-20px)' },
        to: { opacity: 1, transform: 'translateX(0)' }
      },
      slideInRight: {
        from: { opacity: 0, transform: 'translateX(20px)' },
        to: { opacity: 1, transform: 'translateX(0)' }
      },
      pulse: {
        '0%': { opacity: 1 },
        '50%': { opacity: 0.5 },
        '100%': { opacity: 1 }
      },
      scale: {
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(1.05)' }
      }
    }
  },

  // 🧩 Componentes
  components: {
    card: {
      borderRadius: 12,
      padding: {
        mobile: 16,
        tablet: 20,
        desktop: 24
      },
      shadow: {
        default: '0 2px 8px rgba(0, 0, 0, 0.1)',
        hover: '0 8px 32px rgba(0, 0, 0, 0.15)',
        active: '0 4px 16px rgba(0, 0, 0, 0.12)'
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    button: {
      borderRadius: 8,
      padding: {
        small: '8px 16px',
        medium: '12px 24px',
        large: '16px 32px'
      },
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      hover: {
        transform: 'translateY(-2px)',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
      },
      active: {
        transform: 'scale(0.98)'
      }
    },
    statusIndicator: {
      size: {
        small: 8,
        medium: 12,
        large: 16
      },
      animation: {
        pulse: 'pulse 2s infinite'
      }
    }
  },

  // 📱 Grid System
  grid: {
    columns: {
      sensors: {
        mobile: 12,    // 1 coluna
        tablet: 6,     // 2 colunas
        desktop: 4,    // 3 colunas
        large: 3       // 4 colunas
      },
      stats: {
        mobile: 12,    // 1 coluna
        tablet: 6,     // 2 colunas
        desktop: 3     // 4 colunas
      },
      charts: {
        mobile: 12,    // 1 coluna
        tablet: 6,     // 2 colunas
        desktop: 6     // 2 colunas
      }
    },
    spacing: {
      mobile: 16,
      tablet: 20,
      desktop: 24
    }
  },

  // ♿ Acessibilidade
  accessibility: {
    focus: {
      outline: '2px solid',
      outlineOffset: 0,
      borderRadius: 4
    },
    contrast: {
      minimum: 4.5,  // WCAG AA
      enhanced: 7.0  // WCAG AAA
    },
    touchTarget: {
      minimum: 44,   // 44px minimum touch target
      recommended: 48 // 48px recommended touch target
    }
  },

  // 🎨 Modo Escuro
  darkMode: {
    background: {
      primary: '#1C1C1E',
      secondary: '#2C2C2E',
      tertiary: '#3A3A3C'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#98989D',
      tertiary: '#8E8E93'
    },
    surface: {
      primary: '#2C2C2E',
      secondary: '#3A3A3C',
      elevated: '#48484A'
    }
  }
};

// 🛠️ Funções Utilitárias
export const getResponsiveValue = (
  mobile: any,
  tablet: any,
  desktop: any,
  large?: any
) => ({
  xs: mobile,
  sm: tablet,
  md: desktop,
  lg: large || desktop,
  xl: large || desktop
});

export const getStatusColor = (status: StatusType, theme: any) => {
  const statusColors: Record<StatusType, string> = {
    connected: theme.palette.status?.connected || DESIGN_TOKENS.colors.success.main,
    disconnected: theme.palette.status?.disconnected || DESIGN_TOKENS.colors.error.main,
    connecting: theme.palette.status?.connecting || DESIGN_TOKENS.colors.warning.main,
    error: theme.palette.status?.error || DESIGN_TOKENS.colors.error.main,
    warning: theme.palette.status?.warning || DESIGN_TOKENS.colors.warning.main,
    info: theme.palette.status?.info || DESIGN_TOKENS.colors.info.main,
    success: theme.palette.status?.success || DESIGN_TOKENS.colors.success.main
  };
  return statusColors[status] || DESIGN_TOKENS.colors.grey[500];
};

export const getAnimation = (
  name: AnimationName,
  duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal',
  easing: keyof typeof DESIGN_TOKENS.animations.easing = 'easeOut'
) => {
  const keyframe = DESIGN_TOKENS.animations.keyframes[name];
  return {
    animation: `${name} ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing[easing]}`,
    '@keyframes': {
      [name]: keyframe
    }
  };
};

export const getTransition = (
  properties = 'all',
  duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal',
  easing: keyof typeof DESIGN_TOKENS.animations.easing = 'easeOut'
) => {
  return `${properties} ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing[easing]}`;
};

// 📋 Exportação de tipos
export type DesignTokens = typeof DESIGN_TOKENS;
export type ColorToken = keyof typeof DESIGN_TOKENS.colors;
export type StatusType = 'connected' | 'disconnected' | 'connecting' | 'error' | 'warning' | 'info' | 'success';
export type AnimationName = keyof typeof DESIGN_TOKENS.animations.keyframes;
export type GridContext = keyof typeof DESIGN_TOKENS.grid.columns; 