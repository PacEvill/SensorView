import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    console.log(`[Zustand ${name || 'store'}]: applying`, ...args);
    set(...args);
    console.log(`[Zustand ${name || 'store'}]: new state`, get());
  };
  
  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

// Middleware para persistência do estado no localStorage
type PersistOptions<T> = {
  name: string;
  partialize?: (state: T) => Partial<T>;
};

type Persist = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => StateCreator<T, Mps, Mcs>;

type PersistImpl = <T>(
  f: StateCreator<T, [], []>,
  options: PersistOptions<T>
) => StateCreator<T, [], []>;

const persistImpl: PersistImpl = (f, options) => (set, get, store) => {
  const { name, partialize = state => state as Partial<T> } = options;
  
  // Função para tentar recuperar o estado do localStorage
  const restoreState = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(name);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn(`Erro ao restaurar o estado do ${name}:`, e);
    }
    return {};
  };
  
  // Função para salvar o estado no localStorage
  const persistState = (state: T) => {
    try {
      if (typeof window !== 'undefined') {
        const partializedState = partialize(state);
        localStorage.setItem(name, JSON.stringify(partializedState));
      }
    } catch (e) {
      console.warn(`Erro ao persistir o estado do ${name}:`, e);
    }
  };
  
  // Criar o estado e aplicar o estado salvo
  const initialState = f(
    (args) => {
      set(args);
      persistState(get());
    },
    get,
    store
  );
  
  // Mesclar o estado persistido com o estado inicial
  const restoredState = restoreState();
  const mergedState = { ...initialState, ...restoredState };
  
  // Inicializar o estado com os dados persistidos
  if (Object.keys(restoredState).length > 0) {
    set(mergedState);
  }
  
  return mergedState;
};

export const persist = persistImpl as unknown as Persist; 