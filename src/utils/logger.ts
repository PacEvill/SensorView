/**
 * Sistema de Logs para SensorApp
 * 
 * Este módulo fornece funcionalidades de logging para facilitar a depuração
 * e manutenção do aplicativo SensorApp.
 */

// Níveis de log disponíveis
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Configuração do logger
interface LoggerConfig {
  minLevel: LogLevel;      // Nível mínimo para exibir logs
  enableConsole: boolean;  // Habilitar logs no console
  enableStorage: boolean;  // Habilitar armazenamento de logs
  maxStoredLogs: number;   // Número máximo de logs armazenados
  prefix?: string;         // Prefixo opcional para os logs
}

// Estrutura de uma entrada de log
interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  module?: string;
}

// Chave para armazenamento dos logs
const LOGS_STORAGE_KEY = 'sensorapp_logs';

// Configuração padrão
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableStorage: true,
  maxStoredLogs: 1000,
  prefix: 'SensorApp'
};

/**
 * Classe Logger para gerenciamento de logs
 */
class Logger {
  private config: LoggerConfig;
  private cachedLogs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadLogsFromStorage();
  }

  /**
   * Carrega logs armazenados anteriormente
   */
  private loadLogsFromStorage(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') return;
    
    try {
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        this.cachedLogs = JSON.parse(storedLogs);
      }
    } catch (err) {
      console.error('Erro ao carregar logs armazenados:', err);
      this.cachedLogs = [];
    }
  }

  /**
   * Salva logs no armazenamento local
   */
  private saveLogsToStorage(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') return;
    
    try {
      // Limita o número de logs armazenados
      if (this.cachedLogs.length > this.config.maxStoredLogs) {
        this.cachedLogs = this.cachedLogs.slice(-this.config.maxStoredLogs);
      }
      
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.cachedLogs));
    } catch (err) {
      console.error('Erro ao salvar logs:', err);
    }
  }

  /**
   * Registra uma entrada de log
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, module?: string): void {
    // Verifica se o nível de log está habilitado
    if (level < this.config.minLevel) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      module
    };

    // Adiciona ao cache de logs
    if (this.config.enableStorage) {
      this.cachedLogs.push(entry);
      this.saveLogsToStorage();
    }

    // Exibe no console se habilitado
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
  }

  /**
   * Exibe log no console com formatação adequada
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const module = entry.module ? `[${entry.module}]` : '';
    const baseMessage = `${timestamp} ${prefix}${module} ${this.getLevelLabel(entry.level)}: ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(baseMessage, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(baseMessage, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(baseMessage, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(baseMessage, entry.context || '');
        break;
    }
  }

  /**
   * Obtém o rótulo textual para um nível de log
   */
  private getLevelLabel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return 'DEBUG';
      case LogLevel.INFO: return 'INFO';
      case LogLevel.WARN: return 'AVISO';
      case LogLevel.ERROR: return 'ERRO';
      default: return 'DESCONHECIDO';
    }
  }

  /**
   * Registra um log de nível DEBUG
   */
  public debug(message: string, context?: Record<string, any>, module?: string): void {
    this.log(LogLevel.DEBUG, message, context, module);
  }

  /**
   * Registra um log de nível INFO
   */
  public info(message: string, context?: Record<string, any>, module?: string): void {
    this.log(LogLevel.INFO, message, context, module);
  }

  /**
   * Registra um log de nível WARN
   */
  public warn(message: string, context?: Record<string, any>, module?: string): void {
    this.log(LogLevel.WARN, message, context, module);
  }

  /**
   * Registra um log de nível ERROR
   */
  public error(message: string, context?: Record<string, any>, module?: string): void {
    this.log(LogLevel.ERROR, message, context, module);
  }

  /**
   * Registra um erro com stack trace
   */
  public logError(error: Error, message?: string, module?: string): void {
    this.error(
      message || error.message,
      {
        name: error.name,
        stack: error.stack,
        ...(error as any)
      },
      module
    );
  }

  /**
   * Registra o tempo de execução de uma função
   */
  public time<T>(label: string, fn: () => T, module?: string): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.debug(`${label}: ${duration.toFixed(2)}ms`, { duration }, module);
    }
  }

  /**
   * Versão assíncrona de time para funções que retornam Promise
   */
  public async timeAsync<T>(label: string, fn: () => Promise<T>, module?: string): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.debug(`${label}: ${duration.toFixed(2)}ms`, { duration }, module);
    }
  }

  /**
   * Obtém todos os logs armazenados
   */
  public getLogs(): LogEntry[] {
    return [...this.cachedLogs];
  }

  /**
   * Limpa todos os logs armazenados
   */
  public clearLogs(): void {
    this.cachedLogs = [];
    if (this.config.enableStorage && typeof window !== 'undefined') {
      localStorage.removeItem(LOGS_STORAGE_KEY);
    }
  }

  /**
   * Exporta logs para um arquivo JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.cachedLogs, null, 2);
  }

  /**
   * Atualiza a configuração do logger
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Instância global do logger
const logger = new Logger();

export default logger;

// Hook para uso do logger em componentes React
export function useLogger(module?: string) {
  return {
    debug: (message: string, context?: Record<string, any>) => logger.debug(message, context, module),
    info: (message: string, context?: Record<string, any>) => logger.info(message, context, module),
    warn: (message: string, context?: Record<string, any>) => logger.warn(message, context, module),
    error: (message: string, context?: Record<string, any>) => logger.error(message, context, module),
    logError: (error: Error, message?: string) => logger.logError(error, message, module),
    time: <T>(label: string, fn: () => T) => logger.time(label, fn, module),
    timeAsync: <T>(label: string, fn: () => Promise<T>) => logger.timeAsync(label, fn, module)
  };
}