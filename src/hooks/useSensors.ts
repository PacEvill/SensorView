/**
 * Hooks personalizados para gerenciamento de sensores
 */

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useStore } from '../store';
import SensorService from '../services/SensorService';
import { SensorType, ConnectionType, SensorDevice, SensorReading } from '../types/sensors';
import { generateSimulatedReading } from '../utils/sensorUtils';

// Implementações simples de debounce e throttle
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Hook principal para gerenciamento de sensores
 */
export const useSensors = () => {
  const {
    connectedSensors,
    availableDevices,
    realTimeData,
    isScanning,
    startScan,
    connectSensor,
    disconnectSensor,
    addSensorReading,
    addAlert,
    clearAllAlerts
  } = useStore();

  const sensorService = useRef(new SensorService());

  // Conectar sensor
  const handleConnectSensor = useCallback(async (
    device: SensorDevice,
    config?: any
  ) => {
    try {
      await connectSensor(device);
      return true;
    } catch (error) { 
      console.error('Erro ao conectar sensor:', error);
      return false;
    }
  }, [connectSensor]);

  // Desconectar sensor
  const handleDisconnectSensor = useCallback(async (sensorId: string) => {
    try {
      await sensorService.current.disconnectSensor(sensorId);
      disconnectSensor(sensorId);
      return true;
    } catch (error) {
      console.error('Erro ao desconectar sensor:', error);
      return false;
    }
  }, [disconnectSensor]);

  // Escanear dispositivos
  const handleScanDevices = useCallback(async (connectionType: 'bluetooth' | 'wifi' | 'usb') => {
    try {
      await startScan(connectionType);
      return availableDevices;
    } catch (error) {
      console.error('Erro ao escanear dispositivos:', error);
      return [];
    }
  }, [startScan, availableDevices]);

  return {
    connectedSensors,
    availableDevices,
    realTimeData,
    isScanning,
    connectSensor: handleConnectSensor,
    disconnectSensor: handleDisconnectSensor,
    scanDevices: handleScanDevices,
    clearAllAlerts
  };
};

/**
 * Hook para dados em tempo real de um sensor específico
 */
export const useSensorData = (sensorId: string) => {
  const { realTimeData, addSensorReading, addAlert } = useStore();
  const [isActive, setIsActive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sensorData = realTimeData[sensorId] || {
    current: { id: '', sensorId, timestamp: new Date(), value: 0, unit: '' },
    history: [],
    statistics: { min: 0, max: 0, average: 0, trend: 'stable' as const }
  };

  // Função throttled para atualizar dados
  const throttledUpdate = useCallback(
    throttle((id: string, reading: SensorReading) => {
      addSensorReading(reading);
    }, 100),
    [addSensorReading]
  );

  // Simular dados em tempo real
  const simulateRealtimeData = useCallback(() => {
    if (!isActive) return;

    const sensor = useStore.getState().connectedSensors.find(s => s.id === sensorId);
    if (!sensor) return;

    const lastReading = sensorData.history[sensorData.history.length - 1];
    const newReading = generateSimulatedReading(
      sensor.type,
      lastReading?.value
    );

    throttledUpdate(sensorId, newReading);

    // Verificar alertas simples
    const value = newReading.value;
    let alertLevel: 'info' | 'warning' | 'critical' | null = null;
    
    // Lógica simples de alertas baseada no tipo de sensor
    if (sensor.type === 'temperature') {
      if (value > 35 || value < 0) alertLevel = 'critical';
      else if (value > 30 || value < 5) alertLevel = 'warning';
    } else if (sensor.type === 'humidity') {
      if (value > 90 || value < 10) alertLevel = 'critical';
      else if (value > 80 || value < 20) alertLevel = 'warning';
    }
    
    if (alertLevel === 'critical' || alertLevel === 'warning') {
      addAlert({
        id: `alert_${Date.now()}`,
        sensorId,
        type: 'threshold_exceeded',
        severity: alertLevel,
        message: `${sensor.name}: ${newReading.value} ${newReading.unit}`,
        timestamp: new Date(),
        acknowledged: false
      });
    }
  }, [sensorId, sensorData, isActive, throttledUpdate, addAlert]);

  // Iniciar/parar simulação
  useEffect(() => {
    if (isActive && sensorId) {
      const sensor = useStore.getState().connectedSensors.find(s => s.id === sensorId);
      if (sensor) {
        intervalRef.current = setInterval(
          simulateRealtimeData,
          1000
        );
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sensorId, isActive, simulateRealtimeData]);

  // Pausar/retomar coleta de dados
  const toggleDataCollection = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  return {
    data: sensorData,
    isActive,
    toggleDataCollection
  };
};

/**
 * Hook para estatísticas de sensores
 */
export const useSensorStatistics = (sensorId?: string) => {
  const { connectedSensors, realTimeData } = useStore();
  const [stats, setStats] = useState<any>(null);

  const calculateStats = useCallback(() => {
    if (sensorId) {
      // Estatísticas de um sensor específico
      const data = realTimeData[sensorId];
      if (!data || data.history.length === 0) return null;
      
      const values = data.history.map((r: SensorReading) => r.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      
      return { min, max, avg, count: data.history.length };
    } else {
      // Estatísticas gerais
      const totalSensors = connectedSensors.length;
      const activeSensors = connectedSensors.filter(s => s.status === 'connected').length;
      const totalReadings = Object.values(realTimeData).reduce(
        (total, data) => total + (data.history ? data.history.length : 0),
        0
      );
      
      return {
        totalSensors,
        activeSensors,
        totalReadings,
        sensorTypes: [...new Set(connectedSensors.map(s => s.type))].join(', ')
      };
    }
  }, [sensorId, connectedSensors, realTimeData]);

  // Atualizar estatísticas com debounce
  const debouncedCalculate = useCallback(
    debounce(() => {
      setStats(calculateStats());
    }, 500),
    [calculateStats]
  );

  useEffect(() => {
    debouncedCalculate();
  }, [debouncedCalculate]);

  return stats;
};

/**
 * Hook para gerenciar alertas
 */
export const useAlerts = () => {
  const { alerts, addAlert, clearAlert, acknowledgeAlert, clearAllAlerts } = useStore();
  const [filter, setFilter] = useState<{ type: 'all' | 'critical' | 'warning' | 'info'; acknowledged?: boolean; severity?: 'critical' | 'warning' | 'info' }>({ type: 'all' });
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => !showAcknowledged || !alert.acknowledged)
      .filter(alert => filter.type === 'all' ? true : alert.severity === filter.type);
  }, [alerts, filter, showAcknowledged]);

  const unreadAlertsCount = useMemo(() => alerts.filter(a => !a.acknowledged).length, [alerts]);

  const alertCounts = useMemo(() => ({
    total: alerts.length,
    unread: unreadAlertsCount,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  }), [alerts, unreadAlertsCount]);

  return {
    alerts: filteredAlerts,
    alertCounts,
    filter,
    setFilter,
    showAcknowledged,
    setShowAcknowledged,
    addAlert,
    removeAlert: clearAlert,
    acknowledgeAlert,
    clearAlerts: clearAllAlerts
  };
};

/**
 * Hook para exportação de dados
 */
export const useDataExport = () => {
  const { realTimeData, connectedSensors } = useStore();
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async (
    format: 'csv' | 'json' | 'xlsx',
    sensorIds?: string[],
    timeRange?: { start: number; end: number }
  ) => {
    setIsExporting(true);
    
    try {
      // Preparar dados para exportação
      const sensorsToExport = sensorIds || Object.keys(realTimeData);
      const exportData: any[] = [];

      sensorsToExport.forEach(sensorId => {
        const sensor = connectedSensors.find(s => s.id === sensorId);
        const sensorData = realTimeData[sensorId];
        const readings = sensorData?.history || [];
        
        let filteredReadings = readings;
        if (timeRange) {
          filteredReadings = readings.filter(
            r => new Date(r.timestamp).getTime() >= timeRange.start && new Date(r.timestamp).getTime() <= timeRange.end
          );
        }

        filteredReadings.forEach(reading => {
          exportData.push({
            sensorId,
            sensorName: sensor?.name || 'Unknown',
            sensorType: sensor?.type || 'unknown',
            timestamp: reading.timestamp,
            value: reading.value,
            unit: reading.unit
          });
        });
      });

      // Converter para formato solicitado
      let content: string;
      let mimeType: string;
      let filename: string;

      switch (format) {
        case 'csv':
          // Conversão simples para CSV
          const headers = Object.keys(exportData[0] || {}).join(',');
          const rows = exportData.map(row => Object.values(row).join(','));
          content = [headers, ...rows].join('\n');
          mimeType = 'text/csv';
          filename = `sensor_data_${Date.now()}.csv`;
          break;
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          filename = `sensor_data_${Date.now()}.json`;
          break;
        default:
          throw new Error('Formato não suportado');
      }

      // Download do arquivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [realTimeData, connectedSensors]);

  return {
    exportData,
    isExporting
  };
};

/**
 * Hook para configurações de dashboard
 */
export const useDashboardLayout = () => {
  const { dashboardLayouts, currentLayout, updateDashboardLayout } = useStore();
  const dashboardLayout = dashboardLayouts.find(l => l.id === currentLayout);

  const addWidget = useCallback((widget: any) => {
    if (!dashboardLayout) return;
    const newLayout = {
      ...dashboardLayout,
      widgets: [...(dashboardLayout.widgets || []), widget]
    };
    updateDashboardLayout(dashboardLayout.id, newLayout);
  }, [dashboardLayout, updateDashboardLayout]);

  const removeWidget = useCallback((widgetId: string) => {
    if (!dashboardLayout) return;
    const newLayout = {
      ...dashboardLayout,
      widgets: (dashboardLayout.widgets || []).filter((w: any) => w.id !== widgetId)
    };
    updateDashboardLayout(dashboardLayout.id, newLayout);
  }, [dashboardLayout, updateDashboardLayout]);

  const updateWidget = useCallback((widgetId: string, updates: any) => {
    if (!dashboardLayout) return;
    const newLayout = {
      ...dashboardLayout,
      widgets: (dashboardLayout.widgets || []).map((w: any) => 
        w.id === widgetId ? { ...w, ...updates } : w
      )
    };
    updateDashboardLayout(dashboardLayout.id, newLayout);
  }, [dashboardLayout, updateDashboardLayout]);

  return {
    layout: dashboardLayout,
    addWidget,
    removeWidget,
    updateWidget,
    updateLayout: (layout: any) => {
      if (dashboardLayout) {
        updateDashboardLayout(dashboardLayout.id, layout);
      }
    }
  };
};

/**
 * Hook para performance e otimização
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    dataPoints: 0,
    updateFrequency: 0
  });

  const updateMetrics = useCallback(() => {
    // Simular métricas de performance
    if (typeof window !== 'undefined' && (window as any).performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        renderTime: performance.now() % 100,
        dataPoints: Object.values(useStore.getState().realTimeData)
          .reduce((total, data) => total + (data.history ? data.history.length : 0), 0)
      }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return metrics;
};

export default {
  useSensors,
  useSensorData,
  useSensorStatistics,
  useAlerts,
  useDataExport,
  useDashboardLayout,
  usePerformanceMonitor
};