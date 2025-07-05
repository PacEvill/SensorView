/**
 * Componente para exibir e gerenciar alertas de sensores
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Stack,
  Alert,
  Collapse,
  Button,
  Badge,
  Tooltip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
  Snooze as SnoozeIcon,
  VolumeOff as MuteIcon,
  VolumeUp as UnmuteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SensorAlert } from '../../types/sensors';
import { useStore } from '../../store';

const AlertCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&.critical': {
    borderLeft: `4px solid ${theme.palette.error.main}`,
    backgroundColor: alpha(theme.palette.error.main, 0.05)
  },
  '&.warning': {
    borderLeft: `4px solid ${theme.palette.warning.main}`,
    backgroundColor: alpha(theme.palette.warning.main, 0.05)
  },
  '&.info': {
    borderLeft: `4px solid ${theme.palette.info.main}`,
    backgroundColor: alpha(theme.palette.info.main, 0.05)
  },
  '&.success': {
    borderLeft: `4px solid ${theme.palette.success.main}`,
    backgroundColor: alpha(theme.palette.success.main, 0.05)
  },
  '&.muted': {
    opacity: 0.6
  }
}));

const AlertListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

interface SensorAlertsProps {
  maxHeight?: number;
  showHeader?: boolean;
  compact?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const SensorAlerts: React.FC<SensorAlertsProps> = ({
  maxHeight = 400,
  showHeader = true,
  compact = false,
  open = true,
  onClose
}) => {
  const theme = useTheme();
  const {
    connectedSensors,
    alerts,
    acknowledgeAlert,
    clearAlert,
    clearAllAlerts
  } = useStore();
  
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'muted'>('all');
  
  // Simular alguns alertas ativos para demonstração
  const [activeAlerts, setActiveAlerts] = useState<SensorAlert[]>([
    {
      id: '1',
      sensorId: 'sensor-1',
      type: 'threshold_exceeded',
      message: 'Temperatura alta detectada',
      severity: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      acknowledged: false
    },
    {
      id: '2',
      sensorId: 'sensor-2',
      type: 'threshold_exceeded',
      message: 'Umidade muito baixa',
      severity: 'critical',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos atrás
      acknowledged: false
    },
    {
      id: '3',
      sensorId: 'sensor-3',
      type: 'connection_lost',
      message: 'Mudança brusca na pressão',
      severity: 'low',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
      acknowledged: true
    }
  ]);

  const getSensorName = (sensorId: string): string => {
    const sensor = connectedSensors.find(s => s.id === sensorId);
    return sensor?.name || `Sensor ${sensorId}`;
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <SuccessIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d atrás`;
    if (diffHours > 0) return `${diffHours}h atrás`;
    if (diffMins > 0) return `${diffMins}min atrás`;
    return 'Agora';
  };

  const handleDismissAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    clearAlert(alertId);
  };

  const handleMuteAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    acknowledgeAlert(alertId);
  };

  const handleUnmuteAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: false } : alert
    ));
    acknowledgeAlert(alertId);
  };

  const handleClearAll = () => {
    setActiveAlerts([]);
    clearAllAlerts();
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    switch (filter) {
      case 'active':
        return !alert.acknowledged;
      case 'muted':
        return alert.acknowledged;
      default:
        return true;
    }
  });

  const activeCount = activeAlerts.filter(alert => !alert.acknowledged).length;
  const mutedCount = activeAlerts.filter(alert => alert.acknowledged).length;

  if (compact) {
    return (
      <Card>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Badge badgeContent={activeCount} color="error">
                <NotificationsIcon color={activeCount > 0 ? 'error' : 'disabled'} />
              </Badge>
              <Typography variant="body2">
                {activeCount > 0 ? `${activeCount} alerta(s) ativo(s)` : 'Nenhum alerta'}
              </Typography>
            </Stack>
            
            {activeCount > 0 && (
              <Button size="small" onClick={handleClearAll}>
                Limpar Todos
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Badge badgeContent={activeCount} color="error">
                <NotificationsIcon color={activeCount > 0 ? 'error' : 'disabled'} />
              </Badge>
              <Typography variant="h6">Alertas</Typography>
            </Stack>
          }
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Filtrar alertas">
                <Button
                  size="small"
                  variant={filter === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('all')}
                >
                  Todos ({activeAlerts.length})
                </Button>
              </Tooltip>
              
              <Tooltip title="Alertas ativos">
                <Button
                  size="small"
                  variant={filter === 'active' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('active')}
                  color="error"
                >
                  Ativos ({activeCount})
                </Button>
              </Tooltip>
              
              <Tooltip title="Alertas silenciados">
                <Button
                  size="small"
                  variant={filter === 'muted' ? 'contained' : 'outlined'}
                  onClick={() => setFilter('muted')}
                  color="inherit"
                >
                  Silenciados ({mutedCount})
                </Button>
              </Tooltip>
              
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          }
        />
      )}
      
      <Collapse in={expanded}>
        <CardContent sx={{ pt: 0, textAlign: 'center' }}>
          {filteredAlerts.length === 0 ? (
            <Alert severity="info" sx={{ mt: 1 }}>
              {filter === 'all' 
                ? 'Nenhum alerta ativo no momento'
                : filter === 'active'
                ? 'Nenhum alerta ativo'
                : 'Nenhum alerta silenciado'
              }
            </Alert>
          ) : (
            <Box>
              {activeCount > 0 && filter !== 'muted' && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {activeCount} alerta(s) requer(em) atenção
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearAll}
                    color="error"
                  >
                    Limpar Todos
                  </Button>
                </Stack>
              )}
              
              <Box sx={{ maxHeight, overflow: 'auto' }}>
                <List dense>
                  {filteredAlerts.map((alert) => (
                    <AlertListItem key={alert.id}>
                      <ListItemIcon>
                        {getAlertIcon(alert.severity || 'info')}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {alert.message}
                            </Typography>
                            {alert.acknowledged && (
                              <Chip
                                size="small"
                                label="Silenciado"
                                color="default"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              {getSensorName(alert.sensorId)} • {formatTimeAgo(alert.timestamp)}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                size="small"
                                label={alert.type}
                                variant="outlined"
                              />

                              <Chip
                                size="small"
                                label={alert.severity}
                                color={
                                  alert.severity === 'high' ? 'error' :
                                  alert.severity === 'medium' ? 'warning' :
                                  alert.severity === 'low' ? 'info' : 'default'
                                }
                                variant="outlined"
                              />
                            </Stack>
                          </Stack>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={0.5}>
                          {alert.acknowledged ? (
                            <Tooltip title="Reativar alerta">
                              <IconButton
                                size="small"
                                onClick={() => handleUnmuteAlert(alert.id)}
                              >
                                <UnmuteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Silenciar alerta">
                              <IconButton
                                size="small"
                                onClick={() => handleMuteAlert(alert.id)}
                              >
                                <MuteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Dispensar alerta">
                            <IconButton
                              size="small"
                              onClick={() => handleDismissAlert(alert.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </ListItemSecondaryAction>
                    </AlertListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" color="warning" sx={{ borderRadius: 2, fontWeight: 600, minWidth: 220, mx: 'auto', display: 'block' }}>
              VER TODOS OS ALERTAS
            </Button>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default SensorAlerts;