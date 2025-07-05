/**
 * Utilitários para sensores e formatação de dados
 */

import { SensorType, SensorReading, SensorDataPoint, AlertLevel } from '../types/sensors';
import { SENSOR_DEFAULTS, ALERT_THRESHOLDS } from '../config/sensors';

/**
 * Formata um valor de sensor com a unidade apropriada
 */
export const formatSensorValue = (value: number, type: SensorType, precision?: number): string => {
  const config = SENSOR_DEFAULTS[type];
  const actualPrecision = precision ?? config.precision;
  const formattedValue = value.toFixed(actualPrecision);
  
  return `${formattedValue} ${config.unit}`;
};

/**
 * Formata timestamp para exibição
 */
export const formatTimestamp = (timestamp: number, format: 'short' | 'long' | 'time' = 'short'): string => {
  const date = new Date(timestamp);
  
  switch (format) {
    case 'short':
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    case 'long':
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    case 'time':
      return date.toLocaleTimeString('pt-BR');
    default:
      return date.toLocaleString('pt-BR');
  }
};

/**
 * Calcula estatísticas de um conjunto de leituras
 */
export const calculateStatistics = (readings: SensorReading[]) => {
  if (readings.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      count: 0,
      latest: 0
    };
  }

  const values = readings.map(r => r.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const latest = readings[readings.length - 1]?.value || 0;

  return {
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    avg: Number(avg.toFixed(2)),
    count: readings.length,
    latest: Number(latest.toFixed(2))
  };
};

/**
 * Determina o nível de alerta baseado no valor e tipo do sensor
 */
export const getAlertLevel = (value: number, type: SensorType): AlertLevel => {
  const thresholds = ALERT_THRESHOLDS[type];
  
  if (!thresholds) return 'info';
  
  if (value < thresholds.critical.min || value > thresholds.critical.max) {
    return 'critical';
  }
  
  if (value < thresholds.warning.min || value > thresholds.warning.max) {
    return 'warning';
  }
  
  return 'info';
};

/**
 * Gera cor baseada no nível de alerta
 */
export const getAlertColor = (level: AlertLevel): string => {
  switch (level) {
    case 'critical':
      return '#f44336'; // Vermelho
    case 'warning':
      return '#ff9800'; // Laranja
    case 'info':
      return '#4caf50'; // Verde
    default:
      return '#2196f3'; // Azul
  }
};

/**
 * Valida se um valor está dentro dos limites do sensor
 */
export const validateSensorValue = (value: number, type: SensorType): boolean => {
  const config = SENSOR_DEFAULTS[type];
  return value >= config.minValue && value <= config.maxValue;
};

/**
 * Gera um ID único para sensores
 */
export const generateSensorId = (type: SensorType, connectionType: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${type}_${connectionType}_${timestamp}_${random}`;
};

/**
 * Converte dados de sensor para formato de exportação CSV
 */
export const convertToCSV = (dataPoints: SensorDataPoint[]): string => {
  if (dataPoints.length === 0) return '';
  
  const headers = ['Timestamp', 'Sensor ID', 'Tipo', 'Valor', 'Unidade', 'Status'];
  const csvContent = [headers.join(',')];
  
  dataPoints.forEach(point => {
    const row = [
      formatTimestamp(point.timestamp, 'long'),
      point.sensorId,
      point.sensorType,
      point.value.toString(),
      SENSOR_DEFAULTS[point.sensorType].unit,
      point.status || 'connected'
    ];
    csvContent.push(row.join(','));
  });
  
  return csvContent.join('\n');
};

/**
 * Converte dados de sensor para formato JSON
 */
export const convertToJSON = (dataPoints: SensorDataPoint[]): string => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalRecords: dataPoints.length,
    data: dataPoints.map(point => ({
      timestamp: point.timestamp,
      timestampFormatted: formatTimestamp(point.timestamp, 'long'),
      sensorId: point.sensorId,
      sensorType: point.sensorType,
      value: point.value,
      unit: SENSOR_DEFAULTS[point.sensorType].unit,
      status: point.status || 'connected'
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Filtra dados por intervalo de tempo
 */
export const filterDataByTimeRange = (
  dataPoints: SensorDataPoint[], 
  timeRange: number
): SensorDataPoint[] => {
  const now = Date.now();
  const startTime = now - timeRange;
  
  return dataPoints.filter(point => point.timestamp >= startTime);
};

/**
 * Reduz dados para melhorar performance (downsampling)
 */
export const downsampleData = (
  dataPoints: SensorDataPoint[], 
  maxPoints: number
): SensorDataPoint[] => {
  if (dataPoints.length <= maxPoints) {
    return dataPoints;
  }
  
  const step = Math.ceil(dataPoints.length / maxPoints);
  const downsampled: SensorDataPoint[] = [];
  
  for (let i = 0; i < dataPoints.length; i += step) {
    downsampled.push(dataPoints[i]);
  }
  
  return downsampled;
};

/**
 * Calcula a taxa de mudança entre duas leituras
 */
export const calculateChangeRate = (
  current: SensorReading, 
  previous: SensorReading
): number => {
  if (!previous || previous.value === 0) return 0;
  
  const timeDiff = (current.timestamp - previous.timestamp) / 1000; // em segundos
  const valueDiff = current.value - previous.value;
  
  return timeDiff > 0 ? valueDiff / timeDiff : 0;
};

/**
 * Aplica suavização aos dados (média móvel simples)
 */
export const applySmoothingFilter = (
  readings: SensorReading[], 
  windowSize: number = 5
): SensorReading[] => {
  if (readings.length < windowSize) {
    return readings;
  }
  
  const smoothed: SensorReading[] = [];
  
  for (let i = windowSize - 1; i < readings.length; i++) {
    const window = readings.slice(i - windowSize + 1, i + 1);
    const avgValue = window.reduce((sum, reading) => sum + reading.value, 0) / windowSize;
    
    smoothed.push({
      ...readings[i],
      value: Number(avgValue.toFixed(2))
    });
  }
  
  return smoothed;
};

/**
 * Detecta anomalias nos dados usando desvio padrão
 */
export const detectAnomalies = (
  readings: SensorReading[], 
  threshold: number = 2
): SensorReading[] => {
  if (readings.length < 3) return [];
  
  const values = readings.map(r => r.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return readings.filter(reading => {
    const zScore = Math.abs(reading.value - mean) / stdDev;
    return zScore > threshold;
  });
};

/**
 * Formata duração em formato legível
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Calcula o status da bateria baseado na voltagem (simulado)
 */
export const calculateBatteryLevel = (voltage: number = 3.7): number => {
  // Simulação baseada em bateria Li-ion típica (3.0V - 4.2V)
  const minVoltage = 3.0;
  const maxVoltage = 4.2;
  
  const level = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  return Math.max(0, Math.min(100, Math.round(level)));
};

/**
 * Gera dados simulados para um tipo de sensor
 */
export const generateSimulatedReading = (
  type: SensorType, 
  previousValue?: number
): SensorReading => {
  const config = SENSOR_DEFAULTS[type];
  const { min, max } = config.simulationRange;
  
  let value: number;
  
  if (previousValue !== undefined) {
    // Gera valor próximo ao anterior para simular continuidade
    const variation = (max - min) * 0.1; // 10% de variação
    const change = (Math.random() - 0.5) * variation;
    value = Math.max(min, Math.min(max, previousValue + change));
  } else {
    // Gera valor aleatório dentro do range
    value = min + Math.random() * (max - min);
  }
  
  // Aplica precisão
  value = Number(value.toFixed(config.precision));
  
  return {
    value,
    timestamp: Date.now(),
    unit: config.unit
  };
};

/**
 * Valida configuração de sensor
 */
export const validateSensorConfig = (config: any): boolean => {
  const requiredFields = ['name', 'type', 'connectionType'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      return false;
    }
  }
  
  if (config.readingInterval && config.readingInterval < 100) {
    return false; // Intervalo muito baixo
  }
  
  return true;
};

/**
 * Converte bytes para formato legível
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounce function para otimizar performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function para limitar frequência de execução
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  formatSensorValue,
  formatTimestamp,
  calculateStatistics,
  getAlertLevel,
  getAlertColor,
  validateSensorValue,
  generateSensorId,
  convertToCSV,
  convertToJSON,
  filterDataByTimeRange,
  downsampleData,
  calculateChangeRate,
  applySmoothingFilter,
  detectAnomalies,
  formatDuration,
  calculateBatteryLevel,
  generateSimulatedReading,
  validateSensorConfig,
  formatBytes,
  debounce,
  throttle
};