/**
 * Serviço para gerenciamento de sensores e coleta de dados em tempo real
 */

import { 
  SensorDevice, 
  SensorReading, 
  SensorConfiguration, 
  SensorAlert, 
  ConnectionType,
  SensorType,
  SensorStatus,
  BluetoothScanResult,
  WiFiScanResult,
  USBDevice
} from '../types/sensors';

class SensorService {
  private connectedSensors: Map<string, SensorDevice> = new Map();
  private sensorReadings: Map<string, SensorReading[]> = new Map();
  private readingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private isScanning = false;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Inicializar WebRTC para comunicação com sensores
    this.setupWebRTCConnection();
    
    // Configurar listeners para eventos do sistema
    this.setupSystemEventListeners();
  }

  private setupWebRTCConnection() {
    // Implementação para WebRTC se necessário para sensores WiFi
    console.log('WebRTC connection setup for WiFi sensors');
  }

  private setupSystemEventListeners() {
    // Listeners para eventos de conexão/desconexão USB
    if (typeof navigator !== 'undefined' && 'usb' in navigator) {
      navigator.usb.addEventListener('connect', this.handleUSBConnect.bind(this));
      navigator.usb.addEventListener('disconnect', this.handleUSBDisconnect.bind(this));
    }
  }

  private handleUSBConnect(event: any) {
    console.log('USB device connected:', event.device);
    this.emit('usb-device-connected', event.device);
  }

  private handleUSBDisconnect(event: any) {
    console.log('USB device disconnected:', event.device);
    this.emit('usb-device-disconnected', event.device);
  }

  // Método para escanear dispositivos Bluetooth
  async scanBluetoothDevices(): Promise<BluetoothScanResult> {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth não suportado neste navegador');
    }

    this.isScanning = true;
    this.emit('scan-started', { type: 'bluetooth' });

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      const devices = [{
        id: device.id,
        name: device.name || 'Dispositivo Desconhecido',
        rssi: -50, // Valor simulado
        services: ['sensor_data']
      }];

      this.isScanning = false;
      this.emit('scan-completed', { type: 'bluetooth', devices });
      
      return { devices };
    } catch (error) {
      this.isScanning = false;
      this.emit('scan-error', { type: 'bluetooth', error });
      throw error;
    }
  }

  // Método para escanear dispositivos WiFi
  async scanWiFiDevices(): Promise<WiFiScanResult> {
    this.isScanning = true;
    this.emit('scan-started', { type: 'wifi' });

    // Simulação de escaneamento WiFi (em produção, seria uma chamada para API)
    return new Promise((resolve) => {
      setTimeout(() => {
        const devices = [
          {
            ip: '192.168.1.100',
            hostname: 'sensor-temp-01',
            mac: '00:11:22:33:44:55',
            manufacturer: 'SensorTech',
            services: [
              { port: 8080, protocol: 'HTTP', service: 'sensor-api' },
              { port: 1883, protocol: 'MQTT', service: 'mqtt-broker' }
            ]
          },
          {
            ip: '192.168.1.101',
            hostname: 'sensor-humidity-01',
            mac: '00:11:22:33:44:56',
            manufacturer: 'SensorTech',
            services: [
              { port: 8080, protocol: 'HTTP', service: 'sensor-api' }
            ]
          }
        ];

        this.isScanning = false;
        this.emit('scan-completed', { type: 'wifi', devices });
        resolve({ devices });
      }, 2000);
    });
  }

  // Método para listar dispositivos USB
  async getUSBDevices(): Promise<USBDevice[]> {
    if (!navigator.usb) {
      throw new Error('USB não suportado neste navegador');
    }

    try {
      const devices = await navigator.usb.getDevices();
      return devices.map(device => ({
        vendorId: device.vendorId.toString(16),
        productId: device.productId.toString(16),
        manufacturer: device.manufacturerName,
        product: device.productName,
        serialNumber: device.serialNumber,
        devicePath: `usb-${device.vendorId}-${device.productId}`
      }));
    } catch (error) {
      console.error('Erro ao listar dispositivos USB:', error);
      return [];
    }
  }

  // Método genérico para escanear dispositivos
  async scanDevices(connectionType: ConnectionType): Promise<SensorDevice[]> {
    switch (connectionType) {
      case 'bluetooth':
        try {
          const result = await this.scanBluetoothDevices();
          return result.devices.map(device => ({
            id: device.id,
            name: device.name,
            type: 'temperature' as SensorType, // Tipo padrão
            connectionType: 'bluetooth',
            status: 'available' as SensorStatus,
            lastSeen: new Date()
          }));
        } catch (error) {
          console.error('Erro ao escanear Bluetooth:', error);
          return [];
        }
      
      case 'wifi':
        try {
          const result = await this.scanWiFiDevices();
          return result.devices.map(device => ({
            id: device.ip,
            name: device.hostname,
            type: 'temperature' as SensorType, // Tipo padrão
            connectionType: 'wifi',
            status: 'available' as SensorStatus,
            lastSeen: new Date()
          }));
        } catch (error) {
          console.error('Erro ao escanear WiFi:', error);
          return [];
        }
      
      case 'usb':
        try {
          const devices = await this.getUSBDevices();
          return devices.map(device => ({
            id: device.devicePath,
            name: device.product || 'Dispositivo USB',
            type: 'temperature' as SensorType, // Tipo padrão
            connectionType: 'usb',
            status: 'available' as SensorStatus,
            lastSeen: new Date()
          }));
        } catch (error) {
          console.error('Erro ao listar USB:', error);
          return [];
        }
      
      default:
        return [];
    }
  }

  // Conectar a um sensor
  async connectSensor(device: Partial<SensorDevice>): Promise<SensorDevice> {
    const sensor: SensorDevice = {
      id: device.id || this.generateSensorId(),
      name: device.name || 'Sensor Desconhecido',
      type: device.type || 'temperature',
      connectionType: device.connectionType || 'wifi',
      status: 'connecting',
      lastSeen: new Date(),
      ...device
    };

    this.emit('sensor-connecting', sensor);

    try {
      // Simular processo de conexão
      await this.simulateConnection(sensor);
      
      sensor.status = 'connected';
      this.connectedSensors.set(sensor.id, sensor);
      this.sensorReadings.set(sensor.id, []);
      
      // Iniciar coleta de dados
      this.startDataCollection(sensor.id);
      
      this.emit('sensor-connected', sensor);
      return sensor;
    } catch (error) {
      sensor.status = 'error';
      this.emit('sensor-connection-failed', { sensor, error });
      throw error;
    }
  }

  // Desconectar sensor
  async disconnectSensor(sensorId: string): Promise<void> {
    const sensor = this.connectedSensors.get(sensorId);
    if (!sensor) {
      throw new Error('Sensor não encontrado');
    }

    // Parar coleta de dados
    this.stopDataCollection(sensorId);
    
    sensor.status = 'disconnected';
    this.connectedSensors.delete(sensorId);
    
    this.emit('sensor-disconnected', sensor);
  }

  // Iniciar coleta de dados de um sensor
  private startDataCollection(sensorId: string) {
    const sensor = this.connectedSensors.get(sensorId);
    if (!sensor) return;

    const interval = setInterval(() => {
      const reading = this.generateSensorReading(sensor);
      this.addReading(sensorId, reading);
      this.emit('sensor-reading', reading);
    }, 1000); // Leitura a cada segundo

    this.readingIntervals.set(sensorId, interval);
  }

  // Parar coleta de dados
  private stopDataCollection(sensorId: string) {
    const interval = this.readingIntervals.get(sensorId);
    if (interval) {
      clearInterval(interval);
      this.readingIntervals.delete(sensorId);
    }
  }

  // Gerar leitura simulada do sensor
  private generateSensorReading(sensor: SensorDevice): SensorReading {
    const baseValues = {
      temperature: { base: 25, range: 10, unit: '°C' },
      humidity: { base: 50, range: 20, unit: '%' },
      pressure: { base: 1013, range: 50, unit: 'hPa' },
      motion: { base: 0, range: 1, unit: 'detected' },
      light: { base: 500, range: 300, unit: 'lux' },
      sound: { base: 40, range: 30, unit: 'dB' },
      air_quality: { base: 150, range: 100, unit: 'AQI' },
      proximity: { base: 100, range: 200, unit: 'cm' }
    };

    const config = baseValues[sensor.type];
    const value = config.base + (Math.random() - 0.5) * config.range;

    return {
      id: this.generateReadingId(),
      sensorId: sensor.id,
      timestamp: new Date(),
      value: Math.round(value * 100) / 100,
      unit: config.unit,
      quality: this.getReadingQuality()
    };
  }

  private getReadingQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    const rand = Math.random();
    if (rand > 0.8) return 'excellent';
    if (rand > 0.6) return 'good';
    if (rand > 0.3) return 'fair';
    return 'poor';
  }

  // Adicionar leitura ao histórico
  private addReading(sensorId: string, reading: SensorReading) {
    const readings = this.sensorReadings.get(sensorId) || [];
    readings.push(reading);
    
    // Manter apenas as últimas 1000 leituras
    if (readings.length > 1000) {
      readings.shift();
    }
    
    this.sensorReadings.set(sensorId, readings);
  }

  // Obter sensores conectados
  getConnectedSensors(): SensorDevice[] {
    return Array.from(this.connectedSensors.values());
  }

  // Obter leituras de um sensor
  getSensorReadings(sensorId: string, limit?: number): SensorReading[] {
    const readings = this.sensorReadings.get(sensorId) || [];
    return limit ? readings.slice(-limit) : readings;
  }

  // Obter última leitura de um sensor
  getLatestReading(sensorId: string): SensorReading | null {
    const readings = this.sensorReadings.get(sensorId) || [];
    return readings.length > 0 ? readings[readings.length - 1] : null;
  }

  // Sistema de eventos
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // Métodos auxiliares
  private generateSensorId(): string {
    return `sensor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReadingId(): string {
    return `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateConnection(sensor: SensorDevice): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular falha de conexão ocasional
        if (Math.random() < 0.1) {
          reject(new Error('Falha na conexão com o sensor'));
        } else {
          resolve();
        }
      }, 1000 + Math.random() * 2000);
    });
  }

  // Limpar recursos
  dispose() {
    // Parar todas as coletas de dados
    this.readingIntervals.forEach(interval => clearInterval(interval));
    this.readingIntervals.clear();
    
    // Limpar listeners
    this.eventListeners.clear();
    
    // Desconectar todos os sensores
    this.connectedSensors.clear();
    this.sensorReadings.clear();
  }
}

// Singleton instance
export const sensorService = new SensorService();
export default SensorService;