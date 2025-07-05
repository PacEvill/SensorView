/**
 * Utilitários para otimizações avançadas de performance
 * Este arquivo fornece funções para melhorar o desempenho geral da aplicação
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';

/**
 * Hook para implementar code splitting baseado em rotas
 * Carrega apenas os recursos necessários para a rota atual
 * 
 * @param routePattern Padrão de rota para carregar recursos específicos
 * @param loadFunc Função a ser executada quando a rota corresponder
 */
export const useRouteBasedCodeSplitting = (
  routePattern: string | RegExp,
  loadFunc: () => void
) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    const isMatch = typeof routePattern === 'string'
      ? currentPath === routePattern
      : routePattern.test(currentPath);
    
    if (isMatch) {
      loadFunc();
    }
  }, [routePattern, loadFunc]);
};

/**
 * Hook para otimizar re-renderizações com Zustand
 * Implementa técnicas avançadas para evitar renderizações desnecessárias
 * 
 * @param selector Função seletora que extrai dados do estado
 * @param equalityFn Função opcional para comparação personalizada
 * @returns Dados selecionados do estado
 */
export function useOptimizedStore<T>(selector: (state: any) => T, equalityFn?: (a: T, b: T) => boolean): T {
  // Usar useCallback para evitar recriação da função seletora
  const optimizedSelector = useCallback(selector, []);
  
  // Usar useRef para manter referência ao último valor selecionado
  const lastValueRef = useRef<T>();
  
  // Selecionar dados do estado com a função otimizada
  const value = useStore(optimizedSelector, equalityFn);
  
  // Verificar se o valor mudou usando a função de igualdade personalizada ou comparação simples
  const hasChanged = equalityFn
    ? !equalityFn(lastValueRef.current as T, value)
    : lastValueRef.current !== value;
  
  // Atualizar a referência se o valor mudou
  if (hasChanged) {
    lastValueRef.current = value;
  }
  
  return value;
}

/**
 * Hook para implementar debounce em operações custosas
 * Útil para otimizar operações frequentes como pesquisa em tempo real
 * 
 * @param value Valor a ser debounced
 * @param delay Tempo de espera em milissegundos
 * @returns Valor após o debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Função para otimizar o carregamento de imagens
 * Implementa técnicas como lazy loading e blur placeholder
 * 
 * @param src URL da imagem
 * @param options Opções adicionais como tamanho e qualidade
 * @returns Objeto com URLs otimizadas e props para componente de imagem
 */
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: 'blur' | 'empty';
} = {}) => {
  const { width, height, quality = 75, placeholder = 'empty' } = options;
  
  // Construir URL otimizada
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  
  // Gerar URL para imagem otimizada
  const optimizedSrc = `${src}?${params.toString()}`;
  
  // Gerar URL para placeholder de baixa qualidade
  const placeholderSrc = placeholder === 'blur'
    ? `${src}?w=10&q=10`
    : '';
  
  return {
    src: optimizedSrc,
    placeholderSrc,
    imageProps: {
      src: optimizedSrc,
      width,
      height,
      loading: 'lazy',
      ...(placeholder === 'blur' ? { placeholder: 'blur', blurDataURL: placeholderSrc } : {}),
    },
  };
};

/**
 * Função para implementar memoização avançada
 * Útil para otimizar cálculos custosos
 * 
 * @param func Função a ser memoizada
 * @param keyFunc Função para gerar chave de cache
 * @returns Função memoizada
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyFunc: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFunc(...args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}