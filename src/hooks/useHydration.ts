/**
 * Hook para gerenciar a hidratação do store Zustand
 * Previne problemas de hidratação entre servidor e cliente
 */

import { useEffect } from 'react';
import { useStore } from '../store';

export const useHydration = () => {
  const setHasHydrated = useStore((state) => state.setHasHydrated);
  const hasHydrated = useStore((state) => state._hasHydrated);

  useEffect(() => {
    // Marca como hidratado após o primeiro render no cliente
    setHasHydrated(true);
  }, [setHasHydrated]);

  return hasHydrated;
};

export default useHydration;