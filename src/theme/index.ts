import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha, Shadows } from '@mui/material/styles';

// Breakpoints customizados para melhor responsividade
const customBreakpoints = {
  values: {
    xs: 0,      // Mobile portrait
    sm: 600,    // Mobile landscape / Tablet portrait
    md: 900,    // Tablet landscape / Small desktop
    lg: 1200,   // Desktop
    xl: 1536,   // Large desktop
    xxl: 1920   // 4K / Ultrawide (custom)
  }
};

// Paleta de cores Apple-inspired com melhor contraste para acessibilidade
const palette = {
  primary: {
    50: '#E8F4FF',
    100: '#D1E9FF',
    200: '#A3D3FF',
    300: '#75BDFF',
    400: '#47A7FF',
    500: '#0A84FF', // Apple Blue
    600: '#0869CC',
    700: '#064F99',
    800: '#043566',
    900: '#021A33',
    main: '#0A84FF',
    light: '#47A7FF',
    dark: '#064F99',
    contrastText: '#FFFFFF'
  },
  secondary: {
    50: '#F5F5F7',
    100: '#E8E8ED',
    200: '#D2D2D8',
    300: '#BCBCC4',
    400: '#A5A5AF',
    500: '#8E8E98', // Apple Gray
    600: '#6E6E76',
    700: '#4F4F57',
    800: '#2F2F38',
    900: '#1C1C1E',
    main: '#8E8E98',
    light: '#A5A5AF',
    dark: '#4F4F57',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#34C759', // Apple Green
    light: '#4CD964',
    dark: '#248A3D',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#FF3B30', // Apple Red
    light: '#FF6B60',
    dark: '#D70015',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#FF9500', // Apple Orange
    light: '#FFAD33',
    dark: '#CC7700',
    contrastText: '#000000' // Melhor contraste para texto escuro
  },
  info: {
    main: '#5AC8FA', // Apple Light Blue
    light: '#7DD3FC',
    dark: '#0891B2',
    contrastText: '#000000' // Melhor contraste para texto escuro
  },
  background: {
    default: '#F5F5F7', // Apple Light Gray
    paper: '#FFFFFF'
  },
  text: {
    primary: '#000000',
    secondary: '#6E6E76',
    disabled: '#8E8E98'
  },
  // Cores de status padronizadas para fácil identificação
  status: {
    connected: '#34C759',
    disconnected: '#FF3B30',
    connecting: '#FF9500',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    success: '#34C759'
  }
};

// Paleta para modo escuro com melhor contraste
const darkPalette = {
  ...palette,
  primary: {
    ...palette.primary,
    main: '#1890FF',
    light: '#47A7FF',
    dark: '#0869CC'
  },
  background: {
    default: '#1C1C1E', // Apple Dark
    paper: '#2C2C2E'   // Apple Dark Gray
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#98989D',
    disabled: '#6E6E76'
  },
  // Cores de status ajustadas para modo escuro
  status: {
    connected: '#4CD964',
    disconnected: '#FF6B60',
    connecting: '#FFAD33',
    error: '#FF6B60',
    warning: '#FFAD33',
    info: '#7DD3FC',
    success: '#4CD964'
  }
};

// Tipografia responsiva melhorada com melhor hierarquia
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"SF Pro Text"',
    '"SF Pro Icons"',
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: 'inherit'
  },
  h2: {
    fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: 'inherit'
  },
  h3: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 600,
    lineHeight: 1.4,
    color: 'inherit'
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
    fontWeight: 500,
    lineHeight: 1.4,
    color: 'inherit'
  },
  h5: {
    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
    fontWeight: 500,
    lineHeight: 1.5,
    color: 'inherit'
  },
  h6: {
    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
    fontWeight: 500,
    lineHeight: 1.5,
    color: 'inherit'
  },
  body1: {
    fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
    lineHeight: 1.6,
    color: 'inherit'
  },
  body2: {
    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
    lineHeight: 1.5,
    color: 'inherit'
  },
  button: {
    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
    fontWeight: 500,
    textTransform: 'none' as const,
    letterSpacing: '0.02em'
  },
  caption: {
    fontSize: 'clamp(0.625rem, 0.8vw, 0.75rem)',
    lineHeight: 1.4,
    color: 'inherit'
  },
  // Variantes adicionais para status e informações
  status: {
    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
    fontWeight: 500,
    lineHeight: 1.4
  },
  sensorValue: {
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.02em'
  },
  sensorLabel: {
    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
    fontWeight: 400,
    lineHeight: 1.4,
    color: 'text.secondary'
  }
};

// Espaçamento responsivo
const spacing = (factor: number) => {
  const base = 8; // 8px base
  return `${base * factor}px`;
};


const shadows: Shadows = [
   'none',
   '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
   '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
   '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
   '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
   '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
   '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
   '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
   '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
   '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
   '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
   '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
   '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
   '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
   '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
   '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
   '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
   '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
   '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
   '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
   '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
   '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
   '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
   '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
   '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
];

// Configuração de forma (border radius)
const shape = {
  borderRadius: 12 // Mais arredondado no estilo Apple
};

// Transições suaves
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  }
};

// Componentes customizados
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0,0,0,0.2) transparent',
        '&::-webkit-scrollbar': {
           width: '8px',
           height: '8px'
         },
         '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '8px'
        }
      }
    }
  },
  MuiButton: {
     styleOverrides: {
       root: {
         borderRadius: 12,
         fontWeight: 500,
         padding: '8px 16px',
         transition: 'all 0.2s ease-in-out',
         '&:hover': {
           transform: 'translateY(-1px)',
           boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
         },
         '&:active': {
           transform: 'translateY(0)'
         }
       },
       sizeSmall: {
         padding: '6px 12px',
         fontSize: '0.75rem'
       },
       sizeLarge: {
         padding: '12px 24px',
         fontSize: '1rem'
       }
     },
     variants: [],
   },
   MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.main
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2
          }
        }
      }
    }
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500
      }
    }
  },
  MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
          backgroundColor: alpha('#FFFFFF', 0.8)
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
          borderRight: 'none',
          boxShadow: '4px 0 16px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          // Espaçamento responsivo para containers Grid
          '@media (max-width: 600px)': {
            padding: '8px'
          },
          '@media (min-width: 600px) and (max-width: 900px)': {
            padding: '16px'
          },
          '@media (min-width: 900px)': {
            padding: '24px'
          }
        }
      }
    },

};

// Tema base
const baseTheme: ThemeOptions = {
  breakpoints: customBreakpoints,
  palette,
  typography,
  spacing,
  shadows,
  shape,
  transitions,
  components
};

// Tema para modo escuro
const darkTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    mode: 'dark',
    ...darkPalette
  },
  components: {
    ...components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          ...components.MuiCssBaseline.styleOverrides.body,
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          backgroundColor: alpha('#1C1C1E', 0.8)
        }
      }
    }
  }
};

// Criar temas
export const lightTheme = createTheme(baseTheme);
export const appDarkTheme = createTheme(darkTheme);

// Tema padrão (claro)
export const theme = lightTheme;

export default theme;

// Utilitários para responsividade
export const responsiveUtils = {
  // Função para obter valores responsivos
  responsive: (values: {
    xs?: any;
    sm?: any;
    md?: any;
    lg?: any;
    xl?: any;
    xxl?: any;
  }) => {
    return {
      xs: values.xs,
      sm: values.sm || values.xs,
      md: values.md || values.sm || values.xs,
      lg: values.lg || values.md || values.sm || values.xs,
      xl: values.xl || values.lg || values.md || values.sm || values.xs,
      xxl: values.xxl || values.xl || values.lg || values.md || values.sm || values.xs
    };
  },
  
  // Função para criar media queries
  mediaQuery: (breakpoint: keyof typeof customBreakpoints.values) => {
    return `@media (min-width: ${customBreakpoints.values[breakpoint]}px)`;
  },
  
  // Função para criar media queries "down"
  mediaQueryDown: (breakpoint: keyof typeof customBreakpoints.values) => {
    const breakpoints = Object.keys(customBreakpoints.values) as Array<keyof typeof customBreakpoints.values>;
    const index = breakpoints.indexOf(breakpoint);
    if (index === 0) return '@media (max-width: 0px)';
    const prevBreakpoint = breakpoints[index - 1];
    return `@media (max-width: ${customBreakpoints.values[prevBreakpoint] - 1}px)`;
  }
};