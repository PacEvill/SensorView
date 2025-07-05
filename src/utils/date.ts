import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para exibição com formato completo
 * @param dateString String de data ISO
 * @returns Data formatada (ex: "30 de abril de 2023, 14:30")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { 
      locale: ptBR 
    });
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return dateString;
  }
};

/**
 * Formata uma data para exibição com formato curto
 * @param dateString String de data ISO
 * @returns Data formatada (ex: "30/04/2023")
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { 
      locale: ptBR 
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
};

/**
 * Verifica se uma data é no passado
 * @param dateString String de data ISO
 * @returns verdadeiro se a data já passou
 */
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return date < new Date();
  } catch (error) {
    console.error('Erro ao verificar data:', error);
    return false;
  }
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param startDate Data inicial
 * @param endDate Data final (opcional, default: data atual)
 * @returns Número de dias entre as datas
 */
export const daysBetween = (startDate: string, endDate?: string): number => {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Erro ao calcular dias entre datas:', error);
    return 0;
  }
};

/**
 * Formata uma data ou timestamp para exibição da hora
 * @param date Data ou timestamp
 * @returns Hora formatada (ex: "14:30")
 */
export const formatTime = (date: Date | string): string => {
  try {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Erro ao formatar hora:', error);
    return '';
  }
};