/**
 * Utilitários para operações seguras no lado do cliente
 */

/**
 * Verifica se o código está sendo executado no navegador
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Retorna o objeto window apenas se estiver no navegador
 * Útil para evitar erros durante SSR
 */
export const getWindow = () => (isBrowser ? window : undefined);

/**
 * Verifica se a tela atual é mobile baseado em largura
 * @param breakpoint Ponto de quebra para considerar mobile (padrão: 600px)
 */
export const isMobileScreen = (breakpoint: number = 600): boolean => {
  if (!isBrowser) return false;
  return window.innerWidth < breakpoint;
};

/**
 * Executa um callback apenas no lado do cliente
 * @param callback Função a ser executada no cliente
 */
export const runOnClient = (callback: () => void): void => {
  if (isBrowser) {
    callback();
  }
};

/**
 * Armazena um valor no localStorage de forma segura
 */
export const setLocalStorage = (key: string, value: any): void => {
  runOnClient(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  });
};

/**
 * Recupera um valor do localStorage de forma segura
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erro ao recuperar do localStorage:', error);
    return defaultValue;
  }
};

/**
 * Hook customizado para medir dimensões da janela
 * Retorna um objeto com a largura e altura atuais
 * Usa lazy initializing para evitar erros no SSR
 */
export const getWindowDimensions = () => {
  if (!isBrowser) {
    return { width: 0, height: 0, isMobile: false };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 600
  };
}; 