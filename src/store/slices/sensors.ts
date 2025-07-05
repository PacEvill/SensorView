/**
 * Store slice para gerenciamento de sensores e dados em tempo real
 */

import { StateCreator } from 'zustand';
import { 
  SensorDevice, 
  SensorReading, 
  SensorConfiguration, 
  SensorAlert, 
  ChartConfiguration, 
  DashboardLayout, 
  RealTimeData,
  SensorGroup
} from '../../types/sensors';
import { sensorService } from '../../services/SensorService';

export interface SensorsState {
  // Estado dos sensores
  connectedSensors: SensorDevice[];
  availableDevices: any[];
  isScanning: boolean;
  scanType: 'bluetooth' | 'wifi' | 'usb' | null;
  
  // Dados em tempo real
  realTimeData: RealTimeData;
  
  // Configurações
  sensorConfigurations: SensorConfiguration[];
  
  // Alertas
  alerts: SensorAlert[];
  unreadAlertsCount: number;
  
  // Dashboard e visualização
  dashboardLayouts: DashboardLayout[];
  currentLayout: string | null;
  chartConfigurations: ChartConfiguration[];
  
  // Grupos de sensores
  sensorGroups: SensorGroup[];
  
  // UI State
  selectedSensorIds: string[];
  isConnecting: boolean;
  connectionError: string | null;
  
  // Actions
  startScan: (type: 'bluetooth' | 'wifi' | 'usb') => Promise<void>;
  stopScan: () => void;
  connectSensor: (device: Partial<SensorDevice>) => Promise<void>;
  disconnectSensor: (sensorId: string) => Promise<void>;
  updateSensorConfiguration: (config: SensorConfiguration) => void;
  addSensorReading: (reading: SensorReading) => void;
  clearSensorData: (sensorId: string) => void;
  
  // Alertas
  addAlert: (alert: SensorAlert) => void;
  addSensorAlert: (alert: SensorAlert) => void;
  removeSensorAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  
  // Dashboard
  createDashboardLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDashboardLayout: (layoutId: string, updates: Partial<DashboardLayout>) => void;
  deleteDashboardLayout: (layoutId: string) => void;
  setCurrentLayout: (layoutId: string) => void;
  
  // Gráficos
  addChartConfiguration: (chart: Omit<ChartConfiguration, 'id'>) => void;
  updateChartConfiguration: (chartId: string, updates: Partial<ChartConfiguration>) => void;
  removeChartConfiguration: (chartId: string) => void;
  
  // Grupos
  createSensorGroup: (group: Omit<SensorGroup, 'id'>) => void;
  updateSensorGroup: (groupId: string, updates: Partial<SensorGroup>) => void;
  deleteSensorGroup: (groupId: string) => void;
  
  // Seleção
  selectSensor: (sensorId: string) => void;
  deselectSensor: (sensorId: string) => void;
  selectAllSensors: () => void;
  clearSelection: () => void;
  
  // Inicialização
  initializeSensorService: () => void;
  cleanup: () => void;
}

export const createSensorsSlice: StateCreator<SensorsState> = (set, get) => ({
  // Estado inicial
  connectedSensors: [],
  availableDevices: [],
  isScanning: false,
  scanType: null,
  realTimeData: {},
  sensorConfigurations: [],
  alerts: [],
  unreadAlertsCount: 0,
  dashboardLayouts: [
    {
      id: 'default',
      name: 'Layout Padrão',
      description: 'Layout padrão com gráficos básicos',
      charts: [],
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  currentLayout: 'default',
  chartConfigurations: [],
  sensorGroups: [],
  selectedSensorIds: [],
  isConnecting: false,
  connectionError: null,

  // Actions
  startScan: async (type) => {
    set({ isScanning: true, scanType: type, availableDevices: [] });
    
    try {
      let devices: any[] = [];
      
      switch (type) {
        case 'bluetooth':
          const bluetoothResult = await sensorService.scanBluetoothDevices();
          devices = bluetoothResult.devices;
          break;
        case 'wifi':
          const wifiResult = await sensorService.scanWiFiDevices();
          devices = wifiResult.devices;
          break;
        case 'usb':
          devices = await sensorService.getUSBDevices();
          break;
      }
      
      set({ availableDevices: devices, isScanning: false, scanType: null });
    } catch (error) {
      console.error('Erro durante escaneamento:', error);
      set({ isScanning: false, scanType: null, connectionError: (error as Error).message });
    }
  },

  stopScan: () => {
    set({ isScanning: false, scanType: null });
  },

  scanForDevices: async (type: ConnectionType) => {
    return get().startScan(type);
  },

  updateSensorData: (sensorId: string, data: Partial<SensorDevice>) => {
    const sensors = get().connectedSensors;
    const index = sensors.findIndex(s => s.id === sensorId);
    if (index >= 0) {
      sensors[index] = { ...sensors[index], ...data };
      set({ connectedSensors: [...sensors] });
    }
  },

  clearAlerts: () => {
    set({ alerts: [], unreadAlertsCount: 0 });
  },

  connectSensor: async (device) => {
    set({ isConnecting: true, connectionError: null });
    
    try {
      const sensor = await sensorService.connectSensor(device);
      const currentSensors = get().connectedSensors;
      
      set({ 
        connectedSensors: [...currentSensors, sensor],
        isConnecting: false,
        realTimeData: {
          ...get().realTimeData,
          [sensor.id]: {
            current: {
              id: '',
              sensorId: sensor.id,
              timestamp: new Date(),
              value: 0,
              unit: ''
            },
            history: [],
            statistics: {
              min: 0,
              max: 0,
              average: 0,
              trend: 'stable'
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao conectar sensor:', error);
      set({ isConnecting: false, connectionError: (error as Error).message });
    }
  },

  disconnectSensor: async (sensorId) => {
    try {
      await sensorService.disconnectSensor(sensorId);
      const currentSensors = get().connectedSensors;
      const realTimeData = get().realTimeData;
      
      delete realTimeData[sensorId];
      
      set({ 
        connectedSensors: currentSensors.filter(s => s.id !== sensorId),
        realTimeData,
        selectedSensorIds: get().selectedSensorIds.filter(id => id !== sensorId)
      });
    } catch (error) {
      console.error('Erro ao desconectar sensor:', error);
    }
  },

  updateSensorConfiguration: (config) => {
    const configurations = get().sensorConfigurations;
    const index = configurations.findIndex(c => c.id === config.id);
    
    if (index >= 0) {
      configurations[index] = config;
    } else {
      configurations.push(config);
    }
    
    set({ sensorConfigurations: [...configurations] });
  },

  addSensorReading: (reading) => {
    const realTimeData = get().realTimeData;
    const sensorData = realTimeData[reading.sensorId];
    
    if (sensorData) {
      const newHistory = [...sensorData.history, reading];
      
      // Manter apenas as últimas 100 leituras para performance
      if (newHistory.length > 100) {
        newHistory.shift();
      }
      
      // Calcular estatísticas
      const values = newHistory.map(r => r.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      // Determinar tendência
      let trend: 'rising' | 'falling' | 'stable' = 'stable';
      if (newHistory.length >= 5) {
        const recent = newHistory.slice(-5).map(r => r.value);
        const firstHalf = recent.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
        const secondHalf = recent.slice(-2).reduce((a, b) => a + b, 0) / 2;
        
        if (secondHalf > firstHalf * 1.05) trend = 'rising';
        else if (secondHalf < firstHalf * 0.95) trend = 'falling';
      }
      
      realTimeData[reading.sensorId] = {
        current: reading,
        history: newHistory,
        statistics: { min, max, average, trend }
      };
      
      set({ realTimeData: { ...realTimeData } });
    }
  },

  clearSensorData: (sensorId) => {
    const realTimeData = get().realTimeData;
    if (realTimeData[sensorId]) {
      realTimeData[sensorId].history = [];
      set({ realTimeData: { ...realTimeData } });
    }
  },

  // Alertas
  addAlert: (alert) => {
    const alerts = get().alerts;
    set({ 
      alerts: [alert, ...alerts],
      unreadAlertsCount: get().unreadAlertsCount + 1
    });
  },

  addSensorAlert: (alert) => {
    const alerts = get().alerts;
    set({ 
      alerts: [alert, ...alerts],
      unreadAlertsCount: get().unreadAlertsCount + 1
    });
  },

  removeSensorAlert: (alertId) => {
    const alerts = get().alerts;
    const alert = alerts.find(a => a.id === alertId);
    const wasUnread = alert && !alert.acknowledged;
    
    set({ 
      alerts: alerts.filter(a => a.id !== alertId),
      unreadAlertsCount: wasUnread ? Math.max(0, get().unreadAlertsCount - 1) : get().unreadAlertsCount
    });
  },

  acknowledgeAlert: (alertId) => {
    const alerts = get().alerts;
    const alert = alerts.find(a => a.id === alertId);
    
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      set({ 
        alerts: [...alerts],
        unreadAlertsCount: Math.max(0, get().unreadAlertsCount - 1)
      });
    }
  },

  clearAlert: (alertId) => {
    const alerts = get().alerts;
    const alert = alerts.find(a => a.id === alertId);
    const wasUnread = alert && !alert.acknowledged;
    
    set({ 
      alerts: alerts.filter(a => a.id !== alertId),
      unreadAlertsCount: wasUnread ? Math.max(0, get().unreadAlertsCount - 1) : get().unreadAlertsCount
    });
  },

  clearAllAlerts: () => {
    set({ alerts: [], unreadAlertsCount: 0 });
  },

  // Dashboard
  createDashboardLayout: (layout) => {
    const newLayout: DashboardLayout = {
      ...layout,
      id: `layout_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set({ dashboardLayouts: [...get().dashboardLayouts, newLayout] });
  },

  updateDashboardLayout: (layoutId, updates) => {
    const layouts = get().dashboardLayouts;
    const index = layouts.findIndex(l => l.id === layoutId);
    
    if (index >= 0) {
      layouts[index] = { ...layouts[index], ...updates, updatedAt: new Date() };
      set({ dashboardLayouts: [...layouts] });
    }
  },

  deleteDashboardLayout: (layoutId) => {
    const layouts = get().dashboardLayouts.filter(l => l.id !== layoutId);
    const currentLayout = get().currentLayout;
    
    set({ 
      dashboardLayouts: layouts,
      currentLayout: currentLayout === layoutId ? (layouts[0]?.id || null) : currentLayout
    });
  },

  setCurrentLayout: (layoutId) => {
    set({ currentLayout: layoutId });
  },

  // Gráficos
  addChartConfiguration: (chart) => {
    const newChart: ChartConfiguration = {
      ...chart,
      id: `chart_${Date.now()}`
    };
    
    set({ chartConfigurations: [...get().chartConfigurations, newChart] });
  },

  updateChartConfiguration: (chartId, updates) => {
    const charts = get().chartConfigurations;
    const index = charts.findIndex(c => c.id === chartId);
    
    if (index >= 0) {
      charts[index] = { ...charts[index], ...updates };
      set({ chartConfigurations: [...charts] });
    }
  },

  removeChartConfiguration: (chartId) => {
    set({ 
      chartConfigurations: get().chartConfigurations.filter(c => c.id !== chartId)
    });
  },

  // Grupos
  createSensorGroup: (group) => {
    const newGroup: SensorGroup = {
      ...group,
      id: `group_${Date.now()}`
    };
    
    set({ sensorGroups: [...get().sensorGroups, newGroup] });
  },

  updateSensorGroup: (groupId, updates) => {
    const groups = get().sensorGroups;
    const index = groups.findIndex(g => g.id === groupId);
    
    if (index >= 0) {
      groups[index] = { ...groups[index], ...updates };
      set({ sensorGroups: [...groups] });
    }
  },

  deleteSensorGroup: (groupId) => {
    set({ sensorGroups: get().sensorGroups.filter(g => g.id !== groupId) });
  },

  // Seleção
  selectSensor: (sensorId) => {
    const selected = get().selectedSensorIds;
    if (!selected.includes(sensorId)) {
      set({ selectedSensorIds: [...selected, sensorId] });
    }
  },

  deselectSensor: (sensorId) => {
    set({ selectedSensorIds: get().selectedSensorIds.filter(id => id !== sensorId) });
  },

  selectAllSensors: () => {
    const allSensorIds = get().connectedSensors.map(s => s.id);
    set({ selectedSensorIds: allSensorIds });
  },

  clearSelection: () => {
    set({ selectedSensorIds: [] });
  },

  // Inicialização
  initializeSensorService: () => {
    // Configurar listeners do serviço de sensores
    sensorService.on('sensor-reading', (reading: SensorReading) => {
      get().addSensorReading(reading);
    });
    
    sensorService.on('sensor-connected', (sensor: SensorDevice) => {
      console.log('Sensor conectado:', sensor.name);
    });
    
    sensorService.on('sensor-disconnected', (sensor: SensorDevice) => {
      console.log('Sensor desconectado:', sensor.name);
    });
    
    sensorService.on('sensor-connection-failed', ({ sensor, error }: { sensor: SensorDevice, error: Error }) => {
      get().addAlert({
        id: `alert_${Date.now()}`,
        sensorId: sensor.id,
        type: 'connection_lost',
        message: `Falha na conexão com ${sensor.name}: ${error.message}`,
        severity: 'high',
        timestamp: new Date(),
        acknowledged: false
      });
    });
  },

  cleanup: () => {
    sensorService.dispose();
    set({
      connectedSensors: [],
      realTimeData: {},
      selectedSensorIds: [],
      isScanning: false,
      isConnecting: false
    });
  }
});