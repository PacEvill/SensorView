/**
 * Configurações para sensores e simulação de dados
 */

import { SensorType, ConnectionType } from '../types/sensors';

// Configurações padrão para cada tipo de sensor
export const SENSOR_DEFAULTS = {
  temperature: {
    unit: '°C',
    minValue: -40,
    maxValue: 85,
    precision: 1,
    readingInterval: 1000,
    simulationRange: { min: 18, max: 35 }
  },
  humidity: {
    unit: '%',
    minValue: 0,
    maxValue: 100,
    precision: 1,
    readingInterval: 1000,
    simulationRange: { min: 30, max: 80 }
  },
  pressure: {
    unit: 'hPa',
    minValue: 300,
    maxValue: 1100,
    precision: 2,
    readingInterval: 1000,
    simulationRange: { min: 980, max: 1030 }
  },
  motion: {
    unit: 'detected',
    minValue: 0,
    maxValue: 1,
    precision: 0,
    readingInterval: 500,
    simulationRange: { min: 0, max: 1 }
  },
  light: {
    unit: 'lux',
    minValue: 0,
    maxValue: 100000,
    precision: 0,
    readingInterval: 1000,
    simulationRange: { min: 100, max: 2000 }
  },
  sound: {
    unit: 'dB',
    minValue: 0,
    maxValue: 140,
    precision: 1,
    readingInterval: 500,
    simulationRange: { min: 30, max: 80 }
  },
  air_quality: {
    unit: 'AQI',
    minValue: 0,
    maxValue: 500,
    precision: 0,
    readingInterval: 2000,
    simulationRange: { min: 20, max: 150 }
  },
  proximity: {
    unit: 'cm',
    minValue: 0,
    maxValue: 400,
    precision: 1,
    readingInterval: 500,
    simulationRange: { min: 5, max: 200 }
  }
};

// Configurações de conexão
export const CONNECTION_CONFIG = {
  bluetooth: {
    scanTimeout: 10000, // 10 segundos
    connectionTimeout: 5000, // 5 segundos
    maxDevices: 10
  },
  wifi: {
    scanTimeout: 15000, // 15 segundos
    connectionTimeout: 8000, // 8 segundos
    maxDevices: 50,
    defaultPorts: [80, 8080, 3000, 5000]
  },
  usb: {
    scanTimeout: 5000, // 5 segundos
    connectionTimeout: 3000, // 3 segundos
    maxDevices: 20
  }
};

// Dispositivos simulados para demonstração
export const SIMULATED_DEVICES = {
  bluetooth: [
    {
      id: 'bt-temp-001',
      name: 'Sensor Temperatura BT-001',
      address: '00:11:22:33:44:55',
      rssi: -45,
      type: 'temperature' as SensorType,
      manufacturer: 'SensorTech'
    },
    {
      id: 'bt-humid-002',
      name: 'Sensor Umidade BT-002',
      address: '00:11:22:33:44:56',
      rssi: -52,
      type: 'humidity' as SensorType,
      manufacturer: 'HumidityPro'
    },
    {
      id: 'bt-motion-003',
      name: 'Detector Movimento BT-003',
      address: '00:11:22:33:44:57',
      rssi: -38,
      type: 'motion' as SensorType,
      manufacturer: 'MotionSense'
    }
  ],
  wifi: [
    {
      id: 'wifi-temp-001',
      name: 'Estação Meteorológica WiFi',
      hostname: 'weather-station.local',
      ip: '192.168.1.100',
      mac: 'AA:BB:CC:DD:EE:FF',
      port: 80,
      type: 'temperature' as SensorType
    },
    {
      id: 'wifi-air-002',
      name: 'Monitor Qualidade do Ar',
      hostname: 'air-quality.local',
      ip: '192.168.1.101',
      mac: 'AA:BB:CC:DD:EE:F0',
      port: 8080,
      type: 'air_quality' as SensorType
    },
    {
      id: 'wifi-sound-003',
      name: 'Monitor de Ruído WiFi',
      hostname: 'noise-monitor.local',
      ip: '192.168.1.102',
      mac: 'AA:BB:CC:DD:EE:F1',
      port: 3000,
      type: 'sound' as SensorType
    },
    {
      id: 'wifi-light-004',
      name: 'Sensor de Luminosidade',
      hostname: 'light-sensor.local',
      ip: '192.168.1.103',
      mac: 'AA:BB:CC:DD:EE:F2',
      port: 5000,
      type: 'light' as SensorType
    }
  ],
  usb: [
    {
      id: 'usb-pressure-001',
      name: 'Barômetro USB-001',
      vendorId: '0x1234',
      productId: '0x5678',
      serialNumber: 'BAR001234',
      manufacturer: 'PressureTech',
      product: 'Digital Barometer',
      type: 'pressure' as SensorType
    },
    {
      id: 'usb-proximity-002',
      name: 'Sensor Proximidade USB-002',
      vendorId: '0x1234',
      productId: '0x5679',
      serialNumber: 'PROX001235',
      manufacturer: 'ProximitySense',
      product: 'Ultrasonic Distance Sensor',
      type: 'proximity' as SensorType
    }
  ]
};

// Configurações de alertas padrão
export const ALERT_THRESHOLDS = {
  temperature: {
    critical: { min: -10, max: 50 },
    warning: { min: 0, max: 40 },
    info: { min: 10, max: 30 }
  },
  humidity: {
    critical: { min: 10, max: 90 },
    warning: { min: 20, max: 80 },
    info: { min: 30, max: 70 }
  },
  pressure: {
    critical: { min: 950, max: 1050 },
    warning: { min: 970, max: 1030 },
    info: { min: 990, max: 1020 }
  },
  motion: {
    critical: { min: 0, max: 1 },
    warning: { min: 0, max: 1 },
    info: { min: 0, max: 1 }
  },
  light: {
    critical: { min: 0, max: 10000 },
    warning: { min: 50, max: 5000 },
    info: { min: 100, max: 2000 }
  },
  sound: {
    critical: { min: 0, max: 100 },
    warning: { min: 20, max: 85 },
    info: { min: 30, max: 70 }
  },
  air_quality: {
    critical: { min: 0, max: 300 },
    warning: { min: 0, max: 150 },
    info: { min: 0, max: 100 }
  },
  proximity: {
    critical: { min: 0, max: 400 },
    warning: { min: 5, max: 300 },
    info: { min: 10, max: 200 }
  }
};

// Configurações de gráficos padrão
export const CHART_DEFAULTS = {
  colors: {
    temperature: '#ff6b6b',
    humidity: '#4ecdc4',
    pressure: '#45b7d1',
    motion: '#96ceb4',
    light: '#feca57',
    sound: '#ff9ff3',
    air_quality: '#54a0ff',
    proximity: '#5f27cd'
  },
  timeRanges: [
    { label: '5 Minutos', value: 5 * 60 * 1000 },
    { label: '15 Minutos', value: 15 * 60 * 1000 },
    { label: '30 Minutos', value: 30 * 60 * 1000 },
    { label: '1 Hora', value: 60 * 60 * 1000 },
    { label: '6 Horas', value: 6 * 60 * 60 * 1000 },
    { label: '24 Horas', value: 24 * 60 * 60 * 1000 },
    { label: '7 Dias', value: 7 * 24 * 60 * 60 * 1000 }
  ],
  refreshIntervals: [
    { label: 'Tempo Real', value: 1000 },
    { label: '5 Segundos', value: 5000 },
    { label: '10 Segundos', value: 10000 },
    { label: '30 Segundos', value: 30000 },
    { label: '1 Minuto', value: 60000 }
  ]
};

// Configurações de exportação
export const EXPORT_CONFIG = {
  formats: ['csv', 'json', 'xlsx'],
  maxRecords: 10000,
  dateFormats: [
    'DD/MM/YYYY HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss',
    'MM/DD/YYYY HH:mm:ss'
  ]
};

// Configurações de performance
export const PERFORMANCE_CONFIG = {
  maxDataPoints: 1000, // Máximo de pontos no gráfico
  dataRetentionDays: 30, // Dias para manter dados
  batchSize: 100, // Tamanho do lote para processamento
  updateThrottle: 100, // Throttle para atualizações em ms
  maxConcurrentConnections: 10 // Máximo de conexões simultâneas
};

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  sound: {
    enabled: true,
    volume: 0.5,
    alertSounds: {
      critical: '/sounds/critical.mp3',
      warning: '/sounds/warning.mp3',
      info: '/sounds/info.mp3'
    }
  },
  desktop: {
    enabled: true,
    duration: 5000 // 5 segundos
  },
  email: {
    enabled: false,
    smtp: {
      host: '',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: ''
      }
    }
  }
};

// Configurações de tema para sensores
export const SENSOR_THEME = {
  icons: {
    temperature: '🌡️',
    humidity: '💧',
    pressure: '🔘',
    motion: '🏃',
    light: '💡',
    sound: '🔊',
    air_quality: '🌬️',
    proximity: '📏'
  },
  gradients: {
    temperature: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    humidity: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    pressure: 'linear-gradient(135deg, #45b7d1 0%, #2980b9 100%)',
    motion: 'linear-gradient(135deg, #96ceb4 0%, #27ae60 100%)',
    light: 'linear-gradient(135deg, #feca57 0%, #f39c12 100%)',
    sound: 'linear-gradient(135deg, #ff9ff3 0%, #e74c3c 100%)',
    air_quality: 'linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)',
    proximity: 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)'
  }
};

export default {
  SENSOR_DEFAULTS,
  CONNECTION_CONFIG,
  SIMULATED_DEVICES,
  ALERT_THRESHOLDS,
  CHART_DEFAULTS,
  EXPORT_CONFIG,
  PERFORMANCE_CONFIG,
  NOTIFICATION_CONFIG,
  SENSOR_THEME
};