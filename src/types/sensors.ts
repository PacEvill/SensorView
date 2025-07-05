/**
 * Tipos relacionados aos sensores e visualização de dados em tempo real
 */

export type SensorType = 
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'motion'
  | 'light'
  | 'sound'
  | 'air_quality'
  | 'proximity';

export type ConnectionType = 
  | 'bluetooth'
  | 'wifi'
  | 'usb';

export type SensorStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'reading';

export interface SensorDevice {
  id: string;
  name: string;
  type: SensorType;
  connectionType: ConnectionType;
  status: SensorStatus;
  macAddress?: string;
  ipAddress?: string;
  port?: string;
  lastSeen?: Date;
  batteryLevel?: number;
  firmwareVersion?: string;
  manufacturer?: string;
  model?: string;
  unit?: string;
  lastReading?: SensorReading;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
  rawData?: any;
}

export interface SensorConfiguration {
  id: string;
  sensorId: string;
  readingInterval: number; // em milissegundos
  minValue?: number;
  maxValue?: number;
  alertThresholds?: {
    min?: number;
    max?: number;
  };
  calibration?: {
    offset: number;
    scale: number;
  };
  enabled: boolean;
}

export interface SensorAlert {
  id: string;
  sensorId: string;
  type: 'threshold_exceeded' | 'connection_lost' | 'low_battery' | 'custom';
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'low' | 'medium' | 'high';
  level?: 'info' | 'warning' | 'error';
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface ChartConfiguration {
  id: string;
  title: string;
  type: 'line' | 'area' | 'bar' | 'gauge' | 'scatter';
  sensorIds: string[];
  timeRange: number; // em minutos
  refreshRate: number; // em milissegundos
  showGrid: boolean;
  showLegend: boolean;
  colors: string[];
  yAxisMin?: number;
  yAxisMax?: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets?: any[];
  charts: Array<{ id: string; gridPosition: any }>;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorDataPoint {
  timestamp: number;
  value: number;
  sensorId: string;
  sensorName: string;
  unit: string;
}

export interface RealTimeData {
  [sensorId: string]: {
    current: SensorReading;
    history: SensorReading[];
    statistics: {
      min: number;
      max: number;
      average: number;
      trend: 'rising' | 'falling' | 'stable';
    };
  };
}

export interface SensorGroup {
  id: string;
  name: string;
  description?: string;
  sensorIds: string[];
  color: string;
  icon?: string;
}

// Interfaces para integração com APIs de sensores
export interface BluetoothScanResult {
  devices: {
    id: string;
    name: string;
    rssi: number;
    services: string[];
  }[];
}

export interface WiFiScanResult {
  devices: {
    ip: string;
    hostname: string;
    mac: string;
    manufacturer?: string;
    services: {
      port: number;
      protocol: string;
      service: string;
    }[];
  }[];
}

export interface USBDevice {
  vendorId: string;
  productId: string;
  manufacturer?: string;
  product?: string;
  serialNumber?: string;
  devicePath: string;
}

// Tipos para exportação de dados
export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange: {
    start: Date;
    end: Date;
  };
  sensorIds: string[];
  includeMetadata: boolean;
  compression?: boolean;
}

export interface ImportOptions {
  format: 'csv' | 'json';
  mapping: {
    timestamp: string;
    value: string;
    sensorId?: string;
    unit?: string;
  };
  skipRows?: number;
  delimiter?: string;
}