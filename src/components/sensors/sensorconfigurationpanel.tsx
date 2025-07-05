/**
 * Painel de configuração avançada de sensores
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Chip,
  Alert,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Timeline as ChartIcon,
  Save as SaveIcon,
  RestoreFromTrash as ResetIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { SensorDevice, SensorConfiguration, SensorAlert, ChartConfiguration } from '../../types/sensors';
import { useStore } from '../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface SensorConfigurationPanelProps {
  open: boolean;
  onClose: () => void;
  sensor: SensorDevice;
}

const SensorConfigurationPanel: React.FC<SensorConfigurationPanelProps> = ({
  open,
  onClose,
  sensor
}) => {
  const theme = useTheme();
  const { updateSensorConfiguration, addAlert, clearAlert, updateChartConfiguration } = useStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState<SensorConfiguration>({
    id: '',
    sensorId: sensor?.id || '',
    readingInterval: 1000,
    minValue: 0,
    maxValue: 100,
    enabled: true
  });
  
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>({
    id: '',
    title: '',
    type: 'line',
    timeRange: 3600000, // 1 hora
    showGrid: true,
    showLegend: true,
    colors: ['#2196f3'],
    sensorIds: [],
    refreshRate: 1000,
    yAxisMin: undefined,
    yAxisMax: undefined,
    position: {
      x: 0,
      y: 0,
      width: 400,
      height: 300
    }
  });
  
  const [newAlert, setNewAlert] = useState<Partial<SensorAlert>>({
    type: 'threshold_exceeded',
    severity: 'warning',
    message: '',
    acknowledged: false
  });

  useEffect(() => {
    if (sensor) {
      setConfig({
        id: '',
        sensorId: sensor.id,
        readingInterval: 1000,
        minValue: 0,
        maxValue: 100,
        enabled: true
      });
      setAlerts([]);
      setChartConfig({
        id: '',
        title: '',
        type: 'line',
        timeRange: 3600000,
        showGrid: true,
        showLegend: true,
        colors: ['#2196f3'],
        sensorIds: [],
        refreshRate: 1000,
        yAxisMin: undefined,
        yAxisMax: undefined,
        position: {
          x: 0,
          y: 0,
          width: 400,
          height: 300
        }
      });
    }
  }, [sensor]);

  const handleSave = () => {
    updateSensorConfiguration(config);
    updateChartConfiguration(sensor.id, chartConfig);
    onClose();
  };

  const handleAddAlert = () => {
    if (newAlert.message) {
      const alert: SensorAlert = {
        id: Date.now().toString(),
        sensorId: sensor.id,
        type: newAlert.type!,
        message: newAlert.message,
        severity: newAlert.severity!,
        timestamp: new Date(),
        acknowledged: newAlert.acknowledged!
      };
      
      const updatedAlerts = [...alerts, alert];
      setAlerts(updatedAlerts);
      addAlert(alert);
      
      // Reset form
      setNewAlert({
        type: 'threshold_exceeded',
        message: '',
        severity: 'warning',
        acknowledged: false
      });
    }
  };

  const handleRemoveAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    clearAlert(alertId);
  };

  const formatTimeRange = (ms: number): string => {
    const minutes = ms / (1000 * 60);
    const hours = minutes / 60;
    const days = hours / 24;
    
    if (days >= 1) return `${Math.round(days)} dia(s)`;
    if (hours >= 1) return `${Math.round(hours)} hora(s)`;
    return `${Math.round(minutes)} minuto(s)`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <SettingsIcon color="primary" />
            <Box>
              <Typography variant="h6">Configurações do Sensor</Typography>
              <Typography variant="body2" color="text.secondary">
                {sensor.name} ({sensor.type})
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Geral" icon={<SettingsIcon />} />
          <Tab label="Alertas" icon={<NotificationsIcon />} />
          <Tab label="Gráficos" icon={<ChartIcon />} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Configurações de Leitura" />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Intervalo de Leitura (ms)"
                      type="number"
                      value={config.readingInterval}
                      onChange={(e) => setConfig(prev => ({ ...prev, readingInterval: parseInt(e.target.value) }))}
                      inputProps={{ min: 100, max: 60000 }}
                      helperText="Intervalo entre leituras em milissegundos"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Faixa de Valores" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Valor Mínimo"
                        type="number"
                        value={config.minValue}
                        onChange={(e) => setConfig(prev => ({ ...prev, minValue: parseFloat(e.target.value) }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Valor Máximo"
                        type="number"
                        value={config.maxValue}
                        onChange={(e) => setConfig(prev => ({ ...prev, maxValue: parseFloat(e.target.value) }))}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Novo Alerta" />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Alerta</InputLabel>
                      <Select
                        value={newAlert.type}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as any }))}
                      >
                        <MenuItem value="threshold_exceeded">Limite Excedido</MenuItem>
                        <MenuItem value="connection_lost">Conexão Perdida</MenuItem>
                        <MenuItem value="low_battery">Bateria Baixa</MenuItem>
                        <MenuItem value="custom">Personalizado</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="Mensagem"
                      value={newAlert.message}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Descrição do alerta"
                    />
                    
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddAlert}
                      disabled={!newAlert.message}
                    >
                      Adicionar Alerta
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Alertas Configurados" />
                <CardContent>
                  {alerts.length === 0 ? (
                    <Alert severity="info">
                      Nenhum alerta configurado
                    </Alert>
                  ) : (
                    <List>
                      {alerts.map((alert) => (
                        <ListItem key={alert.id} divider>
                          <ListItemText
                            primary={alert.message}
                            secondary={
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip size="small" label={alert.type} />
                                <Chip size="small" label={alert.severity} />
                                <Chip 
                                  size="small" 
                                  label={alert.acknowledged ? 'Reconhecido' : 'Não reconhecido'}
                                  color={alert.acknowledged ? 'success' : 'default'}
                                />
                              </Stack>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveAlert(alert.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Configurações do Gráfico" />
                <CardContent>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Gráfico</InputLabel>
                      <Select
                        value={chartConfig.type}
                        onChange={(e) => setChartConfig(prev => ({ ...prev, type: e.target.value as any }))}
                      >
                        <MenuItem value="line">Linha</MenuItem>
                        <MenuItem value="area">Área</MenuItem>
                        <MenuItem value="bar">Barras</MenuItem>
                        <MenuItem value="scatter">Dispersão</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth>
                      <InputLabel>Intervalo de Tempo</InputLabel>
                      <Select
                        value={chartConfig.timeRange}
                        onChange={(e) => setChartConfig(prev => ({ ...prev, timeRange: e.target.value as number }))}
                      >
                        <MenuItem value={300000}>5 Minutos</MenuItem>
                        <MenuItem value={900000}>15 Minutos</MenuItem>
                        <MenuItem value={1800000}>30 Minutos</MenuItem>
                        <MenuItem value={3600000}>1 Hora</MenuItem>
                        <MenuItem value={21600000}>6 Horas</MenuItem>
                        <MenuItem value={86400000}>24 Horas</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={chartConfig.showGrid}
                          onChange={(e) => setChartConfig(prev => ({ ...prev, showGrid: e.target.checked }))}
                        />
                      }
                      label="Mostrar Grade"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={chartConfig.showLegend}
                          onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                        />
                      }
                      label="Mostrar Legenda"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardHeader title="Eixo Y" />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Mínimo do Eixo Y"
                      type="number"
                      value={chartConfig.yAxisMin || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        setChartConfig(prev => ({ ...prev, yAxisMin: value }));
                      }}
                      placeholder="auto"
                      helperText="Deixe vazio para escala automática"
                    />
                    
                    <TextField
                      fullWidth
                      label="Máximo do Eixo Y"
                      type="number"
                      value={chartConfig.yAxisMax || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        setChartConfig(prev => ({ ...prev, yAxisMax: value }));
                      }}
                      placeholder="auto"
                      helperText="Deixe vazio para escala automática"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        
        <Button
          startIcon={<ResetIcon />}
          onClick={() => {
            // Reset to defaults
            setConfig({
              id: '',
              sensorId: sensor.id,
              readingInterval: 1000,
              minValue: 0,
              maxValue: 100,
              enabled: true
            });
          }}
        >
          Restaurar Padrões
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Salvar Configurações
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SensorConfigurationPanel;