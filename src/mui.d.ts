// src/mui.d.ts

import '@mui/material/styles';

// Estende a paleta de cores do TEMA 
declare module '@mui/material/styles' {
  interface Palette {
    custom?: Palette['primary']; 
    status: {
      connected: string;
      disconnected: string;
      connecting: string;
      error: string;
      warning: string;
      info: string;
      success: string;
    };
  }
  interface PaletteOptions {
    custom?: PaletteOptions['primary']; 
    status?: {
      connected?: string;
      disconnected?: string;
      connecting?: string;
      error?: string;
      warning?: string;
      info?: string;
      success?: string;
    };
  }
}

// Estende as propriedades de cor dos COMPONENTES (ex: Button) 
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom?: true; 
  }
}

// Declarações de módulos para resolver problemas de importação
declare module '@mui/material/styles' {
  export * from '@mui/material/styles';
}

declare module '@mui/material/*' {
  export * from '@mui/material/*';
}

declare module '@mui/icons-material/*' {
  export * from '@mui/icons-material/*';
}

declare module '@mui/lab/*' {
  export * from '@mui/lab/*';
}

declare module '@mui/x-date-pickers/*' {
  export * from '@mui/x-date-pickers/*';
}

// Declarações específicas para resolver problemas de tipos
declare module '@mui/material/ListItem' {
  interface ListItemProps {
    button?: boolean;
  }
}