/**
 * Formata um valor numérico para moeda brasileira
 * @param value Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export const formatCurrency = (
  value: number,
  options: { 
    currency?: string; 
    minimumFractionDigits?: number 
  } = {}
): string => {
  const { 
    currency = 'BRL', 
    minimumFractionDigits = 2 
  } = options;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(value);
};

/**
 * Formata um número com separadores para melhor legibilidade
 * @param value Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada (ex: "1.234,56")
 */
export const formatNumber = (
  value: number,
  options: { 
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const { 
    minimumFractionDigits = 0, 
    maximumFractionDigits = 2 
  } = options;
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

/**
 * Formata um nome para exibição com iniciais maiúsculas
 * @param name Nome a ser formatado
 * @returns Nome formatado (ex: "João Da Silva" -> "João da Silva")
 */
export const formatName = (name: string): string => {
  if (!name) return '';
  
  const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e'];
  
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index !== 0 && prepositions.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * Formata um telefone para exibição padronizada
 * @param phone Número de telefone
 * @returns Telefone formatado (ex: "(11) 98765-4321")
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // Celular com DDD
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    // Telefone fixo com DDD
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length === 9) {
    // Celular sem DDD
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  } else if (numbers.length === 8) {
    // Telefone fixo sem DDD
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  }
  
  // Formato desconhecido, retorna como está
  return phone;
}; 