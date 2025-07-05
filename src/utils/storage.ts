import localforage from 'localforage';

// Configuração do localforage
localforage.config({
  name: 'sensorapp',
  storeName: 'sensorapp_data',
  description: 'Dados persistentes do SensorApp',
  version: 1.0
});

/**
 * Salva um item no armazenamento local
 * @param key Chave para identificar o item
 * @param value Valor a ser armazenado
 * @returns Promise que resolve quando o valor é armazenado
 */
export const saveItem = async <T>(key: string, value: T): Promise<T> => {
  try {
    await localforage.setItem(key, value);
    return value;
  } catch (error) {
    console.error(`Erro ao salvar item ${key}:`, error);
    throw error;
  }
};

/**
 * Obtém um item do armazenamento local
 * @param key Chave do item a ser recuperado
 * @param defaultValue Valor padrão se o item não existir
 * @returns Promise com o valor armazenado ou o valor padrão
 */
export const getItem = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const value = await localforage.getItem<T>(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Erro ao obter item ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove um item do armazenamento local
 * @param key Chave do item a ser removido
 * @returns Promise que resolve quando o item é removido
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await localforage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover item ${key}:`, error);
    throw error;
  }
};

/**
 * Limpa todos os dados do armazenamento local
 * @returns Promise que resolve quando o armazenamento é limpo
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Erro ao limpar armazenamento:', error);
    throw error;
  }
};

/**
 * Verifica se um item existe no armazenamento local
 * @param key Chave do item a ser verificado
 * @returns Promise que resolve com true se o item existir
 */
export const hasItem = async (key: string): Promise<boolean> => {
  try {
    const value = await localforage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Erro ao verificar item ${key}:`, error);
    return false;
  }
}; 