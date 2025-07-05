/**
 * Hook para controle do modo de cor
 * Fornece funcionalidades para gerenciar o modo de cor da aplicação
 */

import { useThemeMode } from '../theme/ThemeProvider';

/**
 * Hook personalizado que fornece funcionalidades para controlar o modo de cor
 * @returns Objeto com o estado atual do modo e função para alterná-lo
 */
export const useColorMode = () => {
  // Utiliza o contexto de tema existente
  const { mode, toggleTheme } = useThemeMode();
  
  return {
    colorMode: mode,
    toggleColorMode: toggleTheme,
  };
};

export default useColorMode;