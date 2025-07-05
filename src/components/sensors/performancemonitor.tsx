/**
 * Componente para monitoramento de performance do sistema
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  DataUsage as DataIcon,
  NetworkCheck as NetworkIcon,
  Battery90 as BatteryIcon,
  Wifi as WifiIcon
} from '@mui/icons-material';
import { usePerformanceMonitor } from '../../hooks/useSensors';
import { useStore } from '../../store';
import { SensorReading } from '../../types/sensors';
import { formatBytes, formatDuration } from '../../utils/sensorUtils';

interface PerformanceMonitorProps {
  compact?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(false);
  const metrics = usePerformanceMonitor();
  const { connectedSensors, realTimeData } = useStore();

  // Calcular estatísticas do sistema
  const systemStats = {
    connectedSensors: connectedSensors.length,
    activeSensors: connectedSensors.filter(s => s.status === 'connected').length,
    totalDataPoints: Object.values(realTimeData).reduce(
      (total, sensorData) => total + (sensorData?.history?.length || 0),
      0
    ),
    averageBattery: connectedSensors.length > 0 
      ? Math.round(
          connectedSensors.reduce((sum, s) => sum + (s.batteryLevel || 0), 0) / 
          connectedSensors.length
        )
      : 0,
    connectionTypes: Array.from(new Set(connectedSensors.map(s => s.connectionType))),
    uptime: Date.now() - (Date.now() - 3600000) // Simulado: 1 hora
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'error';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  };

  const getStatusText = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'Crítico';
    if (value >= thresholds.warning) return 'Atenção';
    return 'Normal';
  };

  if (compact) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              Performance
            </Typography>
            <Box display="flex" gap={1}>
              <Chip 
                size="small" 
                label={`${systemStats.activeSensors}/${systemStats.connectedSensors}`}
                color={systemStats.activeSensors === systemStats.connectedSensors ? 'success' : 'warning'}
                icon={<NetworkIcon />}
              />
              <Chip 
                size="small" 
                label={`${Math.round(metrics.memoryUsage)}MB`}
                color={getStatusColor(metrics.memoryUsage, { warning: 100, critical: 200 })}
                icon={<MemoryIcon />}
              />
              <IconButton 
                size="small" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
          
          <Collapse in={expanded}>
            <Box mt={2}>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex="1 1 calc(50% - 8px)" minWidth="200px">
                  <Typography variant="body2" color="textSecondary">
                    Pontos de Dados
                  </Typography>
                  <Typography variant="h6">
                    {systemStats.totalDataPoints.toLocaleString()}
                  </Typography>
                </Box>
                <Box flex="1 1 calc(50% - 8px)" minWidth="200px">
                  <Typography variant="body2" color="textSecondary">
                    Tempo Ativo
                  </Typography>
                  <Typography variant="h6">
                    {formatDuration(systemStats.uptime)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monitor de Performance
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Uso de Memória */}
          <Box width="100%" sx={{ '@media (min-width: 900px)': { width: '50%' } }}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Uso de Memória
                </Typography>
                <Chip 
                  size="small" 
                  label={getStatusText(metrics.memoryUsage, { warning: 100, critical: 200 })}
                  color={getStatusColor(metrics.memoryUsage, { warning: 100, critical: 200 })}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, (metrics.memoryUsage / 200) * 100)}
                color={getStatusColor(metrics.memoryUsage, { warning: 100, critical: 200 })}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary">
                {formatBytes(metrics.memoryUsage * 1024 * 1024)} / 200MB
              </Typography>
            </Box>
          </Box>

          {/* Pontos de Dados */}
          <Box width="100%" sx={{ '@media (min-width: 900px)': { width: '50%' } }}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Pontos de Dados
                </Typography>
                <Chip 
                  size="small" 
                  label={systemStats.totalDataPoints > 5000 ? 'Alto' : 'Normal'}
                  color={systemStats.totalDataPoints > 5000 ? 'warning' : 'success'}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(100, (systemStats.totalDataPoints / 10000) * 100)}
                color={systemStats.totalDataPoints > 5000 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary">
                {systemStats.totalDataPoints.toLocaleString()} pontos
              </Typography>
            </Box>
          </Box>

          {/* Estatísticas do Sistema */}
          <Box width="100%">
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Estatísticas do Sistema
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flex="1 1 calc(25% - 6px)" minWidth="150px" sx={{ '@media (max-width: 600px)': { flex: '1 1 calc(50% - 4px)' } }}>
                <Box textAlign="center">
                  <NetworkIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {systemStats.activeSensors}/{systemStats.connectedSensors}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Sensores Ativos
                  </Typography>
                </Box>
              </Box>
              
              <Box flex="1 1 calc(25% - 6px)" minWidth="150px" sx={{ '@media (max-width: 600px)': { flex: '1 1 calc(50% - 4px)' } }}>
                <Box textAlign="center">
                  <BatteryIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {systemStats.averageBattery}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Bateria Média
                  </Typography>
                </Box>
              </Box>
              
              <Box flex="1 1 calc(25% - 6px)" minWidth="150px" sx={{ '@media (max-width: 600px)': { flex: '1 1 calc(50% - 4px)' } }}>
                <Box textAlign="center">
                  <DataIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {formatBytes(metrics.memoryUsage * 1024 * 1024)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Memória Usada
                  </Typography>
                </Box>
              </Box>
              
              <Box flex="1 1 calc(25% - 6px)" minWidth="150px" sx={{ '@media (max-width: 600px)': { flex: '1 1 calc(50% - 4px)' } }}>
                <Box textAlign="center">
                  <SpeedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {formatDuration(systemStats.uptime)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tempo Ativo
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tipos de Conexão */}
          <Box width="100%">
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Tipos de Conexão Ativas
            </Typography>
            
            <Box display="flex" gap={1} flexWrap="wrap">
              {systemStats.connectionTypes.map((type) => {
                const count = connectedSensors.filter(s => s.connectionType === type).length;
                const getIcon = () => {
                  switch (type) {
                    case 'bluetooth': return '🔵';
                    case 'wifi': return '📶';
                    case 'usb': return '🔌';
                    default: return '📡';
                  }
                };
                
                return (
                  <Chip
                    key={type}
                    label={`${getIcon()} ${type.toUpperCase()} (${count})`}
                    variant="outlined"
                    size="small"
                  />
                );
              })}
              
              {systemStats.connectionTypes.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  Nenhuma conexão ativa
                </Typography>
              )}
            </Box>
          </Box>

          {/* Detalhes dos Sensores */}
          {connectedSensors.length > 0 && (
            <Box width="100%">
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Detalhes dos Sensores
              </Typography>
              
              <List dense>
                {connectedSensors.slice(0, 5).map((sensor) => {
                  const sensorData = realTimeData[sensor.id];
                  const dataCount = sensorData?.history?.length || 0;
                  const lastReading = sensorData?.current;
                  
                  return (
                    <ListItem key={sensor.id}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: sensor.status === 'connected' ? 'success.main' : 'error.main'
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={sensor.name}
                        secondary={
                          <Box>
                            <Typography variant="caption" component="div">
                              {sensor.type} • {sensor.connectionType} • {dataCount} pontos
                            </Typography>
                            {lastReading && (
                              <Typography variant="caption" color="textSecondary">
                                Última leitura: {lastReading.value} {lastReading.unit}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box textAlign="right">
                        <Typography variant="caption" color="textSecondary">
                          {sensor.batteryLevel}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={sensor.batteryLevel || 0}
                          sx={{ width: 40, height: 4, mt: 0.5 }}
                          color={sensor.batteryLevel && sensor.batteryLevel > 20 ? 'success' : 'error'}
                        />
                      </Box>
                    </ListItem>
                  );
                })}
                
                {connectedSensors.length > 5 && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                          ... e mais {connectedSensors.length - 5} sensores
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;