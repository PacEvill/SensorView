/**
 * Utilitário para otimização do gerenciamento de estado com Zustand
 * Este arquivo fornece funções para melhorar a performance do estado global
 */

import { useCallback, useRef, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '@/store';

/**
 * Hook personalizado para selecionar partes específicas do estado global
 * com comparação shallow para evitar re-renderizações desnecessárias
 * 
 * @param selector Função seletora que extrai dados do estado
 * @returns Dados selecionados do estado
 */
export function useShallowStore<T>(selector: (state: any) => T): T {
  return useStore(selector, shallow);
}

/**
 * Hook para selecionar uma única propriedade do estado
 * Evita re-renderizações quando outras partes do estado mudam
 * 
 * @param path Caminho para a propriedade (ex: 'user.profile.name')
 * @returns Valor da propriedade
 */
export function useStoreProperty<T>(path: string): T {
  return useStore(useCallback(
    (state) => {
      return path.split('.').reduce((obj, key) => obj?.[key], state) as T;
    },
    [path]
  ), shallow);
}

/**
 * Hook para selecionar múltiplas propriedades do estado
 * Retorna um objeto com as propriedades selecionadas
 * 
 * @param paths Array de caminhos para as propriedades
 * @returns Objeto com as propriedades selecionadas
 */
export function useStoreProperties<T extends Record<string, any>>(
  paths: Record<keyof T, string>
): T {
  return useStore(useCallback(
    (state) => {
      const result: Record<string, any> = {};
      
      Object.entries(paths).forEach(([key, path]) => {
        result[key] = path.split('.').reduce((obj, segment) => obj?.[segment], state);
      });
      
      return result as T;
    },
    [JSON.stringify(paths)]
  ), shallow);
}

/**
 * Hook para monitorar mudanças em uma parte específica do estado
 * Executa o callback apenas quando a parte selecionada muda
 * 
 * @param selector Função seletora que extrai dados do estado
 * @param callback Função a ser executada quando os dados mudam
 * @param deps Dependências adicionais para o efeito
 */
export function useStoreEffect<T>(
  selector: (state: any) => T,
  callback: (data: T, prevData: T | undefined) => void,
  deps: React.DependencyList = []
): void {
  const data = useStore(selector, shallow);
  const prevDataRef = useRef<T>();
  
  useEffect(() => {
    // Executar callback apenas se os dados mudaram
    if (prevDataRef.current !== data) {
      callback(data, prevDataRef.current);
      prevDataRef.current = data;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ...deps]);
}

/**
 * Hook para memoizar ações do store
 * Evita recriação de funções de ação a cada renderização
 * 
 * @param actionSelector Função que seleciona ações do estado
 * @returns Ações memorizadas
 */
export function useMemoizedStoreActions<T extends Record<string, Function>>(
  actionSelector: (state: any) => T
): T {
  return useStore(useCallback(
    actionSelector,
    []
  ));
}

/**
 * Função para criar seletores otimizados para slices específicos do estado
 * Útil para definir seletores reutilizáveis
 * 
 * @param baseSelector Função base que seleciona uma parte do estado
 * @returns Objeto com métodos para criar seletores derivados
 */
export function createSelectors<T, S>(baseSelector: (state: S) => T) {
  const useSlice = <U>(selector: (state: T) => U) => {
    return useStore((state) => selector(baseSelector(state as S)), shallow);
  };
  
  return { useSlice };
}

/**
 * Como usar:
 * 
 * 1. Seleção otimizada de estado:
 * 
 * import { useShallowStore } from '../utils/storeOptimization';
 * 
 * const MyComponent = () => {
 *   // Apenas re-renderiza quando tasks muda
 *   const tasks = useShallowStore(state => state.tasks);
 *   
 *   return <TaskList tasks={tasks} />;
 * };
 * 
 * 2. Seleção de propriedades específicas:
 * 
 * import { useStoreProperties } from '../utils/storeOptimization';
 * 
 * const ProfileHeader = () => {
 *   // Apenas re-renderiza quando estas propriedades específicas mudam
 *   const { name, avatar } = useStoreProperties({
 *     name: 'user.name',
 *     avatar: 'user.avatar'
 *   });
 *   
 *   return (
 *     <header>
 *       <img src={avatar} alt={name} />
 *       <h1>{name}</h1>
 *     </header>
 *   );
 * };
 * 
 * 3. Ações memorizadas:
 * 
 * import { useMemoizedStoreActions } from '../utils/storeOptimization';
 * 
 * const TaskActions = () => {
 *   // Ações não são recriadas a cada renderização
 *   const { addTask, removeTask } = useMemoizedStoreActions(state => ({
 *     addTask: state.addTask,
 *     removeTask: state.removeTask
 *   }));
 *   
 *   return (
 *     <div>
 *       <button onClick={() => addTask({ title: 'Nova tarefa' })}>Adicionar</button>
 *     </div>
 *   );
 * };
 */