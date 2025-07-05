/**
 * Dialog para conexão de novos sensores
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useTheme,
  Grid
} from '@mui/material';
import {
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  Usb as UsbIcon,
  Refresh as RefreshIcon,
  DeviceThermostat as TemperatureIcon,
  Opacity as HumidityIcon,
  Compress as PressureIcon,
  DirectionsRun as MotionIcon,
  Lightbulb as LightIcon,
  VolumeUp as SoundIcon,
  Air as AirQualityIcon,
  Straighten as ProximityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SensorType, ConnectionType, SensorDevice } from '../../types/sensors';
import { useStore } from '../../store';

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 20,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  border: `2px solid transparent`,
  transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
  background: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    borderColor: theme.palette.primary.light,
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
    background: theme.palette.action.selected,
  },
}));

const DeviceCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '&.available': {
    borderLeft: `4px solid ${theme.palette.success.main}`
  },
  '&.connecting': {
    borderLeft: `4px solid ${theme.palette.warning.main}`
  },
  '&.error': {
    borderLeft: `4px solid ${theme.palette.error.main}`
  }
}));

const DeviceListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  border: `2px solid transparent`,
  transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  background: theme.palette.background.paper,
  '&.Mui-selected, &.selected': {
    borderColor: theme.palette.primary.main,
    background: theme.palette.action.selected,
    boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
  },
  '&:hover': {
    borderColor: theme.palette.primary.light,
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  },
}));

interface SensorConnectionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedType: SensorType;
  onTypeChange: (type: SensorType) => void;
}

const steps = ['Tipo de Sensor', 'Método de Conexão', 'Escanear Dispositivos', 'Configurar Sensor'];

const sensorTypes: { type: SensorType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    type: 'temperature',
    label: 'Temperatura',
    icon: <TemperatureIcon />,
    description: 'Monitora temperatura ambiente ou de objetos'
  },
  {
    type: 'humidity',
    label: 'Umidade',
    icon: <HumidityIcon />,
    description: 'Mede umidade relativa do ar'
  },
  {
    type: 'pressure',
    label: 'Pressão',
    icon: <PressureIcon />,
    description: 'Monitora pressão atmosférica ou de fluidos'
  },
  {
    type: 'motion',
    label: 'Movimento',
    icon: <MotionIcon />,
    description: 'Detecta movimento e vibração'
  },
  {
    type: 'light',
    label: 'Luminosidade',
    icon: <LightIcon />,
    description: 'Mede intensidade de luz ambiente'
  },
  {
    type: 'sound',
    label: 'Som',
    icon: <SoundIcon />,
    description: 'Monitora níveis de ruído e som'
  },
  {
    type: 'air_quality',
    label: 'Qualidade do Ar',
    icon: <AirQualityIcon />,
    description: 'Analisa qualidade e composição do ar'
  },
  {
    type: 'proximity',
    label: 'Proximidade',
    icon: <ProximityIcon />,
    description: 'Detecta proximidade e distância de objetos'
  }
];

const connectionTypes: { type: ConnectionType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    type: 'bluetooth',
    label: 'Bluetooth',
    icon: <BluetoothIcon />,
    description: 'Conexão sem fio de curta distância'
  },
  {
    type: 'wifi',
    label: 'Wi-Fi',
    icon: <WifiIcon />,
    description: 'Conexão sem fio via rede local'
  },
  {
    type: 'usb',
    label: 'USB',
    icon: <UsbIcon />,
    description: 'Conexão direta via cabo USB'
  }
];

const SensorConnectionDialog: React.FC<SensorConnectionDialogProps> = ({
  open,
  onClose,
  selectedType,
  onTypeChange
}) => {
  const theme = useTheme();
  const {
    startScan,
    stopScan,
    connectSensor,
    availableDevices,
    isScanning,
    isConnecting,
    connectionError
  } = useStore();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>('wifi');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [sensorName, setSensorName] = useState('');
  const [sensorConfig, setSensorConfig] = useState({
    readingInterval: 1000,
    unit: '',
    minValue: 0,
    maxValue: 100
  });

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setActiveStep(0);
      setSelectedDevice(null);
      setSensorName('');
      setSensorConfig({
        readingInterval: 1000,
        unit: '',
        minValue: 0,
        maxValue: 100
      });
    }
  }, [open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleScan = async () => {
    try {
      await startScan(selectedConnectionType);
    } catch (error) {
      console.error('Erro ao escanear dispositivos:', error);
    }
  };

  const handleConnect = async () => {
    if (!selectedDevice || !sensorName) return;

    const sensorData: Partial<SensorDevice> = {
      name: sensorName,
      type: selectedType,
      connectionType: selectedConnectionType,
      ...selectedDevice
    };

    try {
      await connectSensor(sensorData);
      onClose();
    } catch (error) {
      console.error('Erro ao conectar sensor:', error);
    }
  };

  const getDefaultUnit = (type: SensorType): string => {
    const units = {
      temperature: '°C',
      humidity: '%',
      pressure: 'hPa',
      motion: 'detected',
      light: 'lux',
      sound: 'dB',
      air_quality: 'AQI',
      proximity: 'cm'
    };
    return units[type] || '';
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom align="center">
              Selecione o tipo de sensor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
              Escolha o tipo de sensor que você deseja conectar.
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 3,
              justifyItems: 'center',
              alignItems: 'stretch',
              mb: 2
            }}>
              {sensorTypes.map((sensor) => (
                  <StyledCard
                  key={sensor.type}
                    className={selectedType === sensor.type ? 'selected' : ''}
                    onClick={() => onTypeChange(sensor.type)}
                  sx={{ width: 220, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                      {React.cloneElement(sensor.icon as React.ReactElement, { sx: { fontSize: 56 } })}
                      </Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {sensor.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sensor.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom align="center">
              Método de Conexão
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
              Como você deseja conectar o sensor?
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 3,
              justifyItems: 'center',
              alignItems: 'stretch',
              mb: 2
            }}>
              {connectionTypes.map((connection) => (
                  <StyledCard
                  key={connection.type}
                    className={selectedConnectionType === connection.type ? 'selected' : ''}
                    onClick={() => setSelectedConnectionType(connection.type)}
                  sx={{ width: 220, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                      {React.cloneElement(connection.icon as React.ReactElement, { sx: { fontSize: 64 } })}
                      </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {connection.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {connection.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
              ))}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" align="center" sx={{ flex: 1 }}>
                Dispositivos Disponíveis
              </Typography>
              <Button
                startIcon={isScanning ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={handleScan}
                disabled={isScanning}
                variant="contained"
                size="medium"
                sx={{ ml: 2, borderRadius: 8, fontWeight: 600 }}
              >
                {isScanning ? 'Escaneando...' : 'Escanear'}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} align="center">
              {isScanning ? `Escaneando dispositivos ${selectedConnectionType}...` : 'Selecione um dispositivo para conectar.'}
            </Typography>
            {connectionError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {connectionError}
              </Alert>
            )}
            <Box sx={{ maxHeight: 320, overflow: 'auto', px: 1 }}>
              {availableDevices.length === 0 && !isScanning ? (
                <Alert severity="info">
                  Nenhum dispositivo encontrado. Clique em "Escanear" para procurar dispositivos.
                </Alert>
              ) : (
                <List disablePadding>
                  {availableDevices.map((device, index) => (
                    <DeviceListItem
                      key={index}
                    >
                      <ListItemButton
                        selected={selectedDevice === device}
                        onClick={() => setSelectedDevice(device)}
                      >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                          {React.cloneElement(
                            connectionTypes.find(c => c.type === selectedConnectionType)?.icon as React.ReactElement,
                          { color: 'primary', sx: { fontSize: 36 } }
                          )}
                        </ListItemIcon>
                        <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight={600}>{device.name || device.hostname || `Dispositivo ${index + 1}`}</Typography>}
                          secondary={
                          <Typography variant="caption" color="text.secondary">
                            {selectedConnectionType === 'wifi' 
                              ? `IP: ${device.ip}` 
                              : selectedConnectionType === 'bluetooth'
                              ? `RSSI: ${device.rssi} dBm`
                              : `${device.manufacturer || 'Desconhecido'}`}
                          </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          {selectedDevice === device && (
                          <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} />
                          )}
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    </DeviceListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configurar Sensor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure as propriedades do sensor.
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nome do Sensor"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                placeholder={`Sensor de ${sensorTypes.find(s => s.type === selectedType)?.label}`}
                required
              />
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Unidade de Medida"
                    value={sensorConfig.unit || getDefaultUnit(selectedType)}
                    onChange={(e) => setSensorConfig(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Intervalo de Leitura (ms)"
                    type="number"
                    value={sensorConfig.readingInterval}
                    onChange={(e) => setSensorConfig(prev => ({ ...prev, readingInterval: parseInt(e.target.value) }))}
                    inputProps={{ min: 100, max: 60000 }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Valor Mínimo"
                    type="number"
                    value={sensorConfig.minValue}
                    onChange={(e) => setSensorConfig(prev => ({ ...prev, minValue: parseFloat(e.target.value) }))}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Valor Máximo"
                    type="number"
                    value={sensorConfig.maxValue}
                    onChange={(e) => setSensorConfig(prev => ({ ...prev, maxValue: parseFloat(e.target.value) }))}
                  />
                </Grid>
              </Grid>
              
              {selectedDevice && (
                <Alert severity="info">
                  <Typography variant="subtitle2">Dispositivo Selecionado:</Typography>
                  <Typography variant="body2">
                    {selectedDevice.name || selectedDevice.hostname || 'Dispositivo'}
                    {selectedConnectionType === 'wifi' && ` (${selectedDevice.ip})`}
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!selectedType;
      case 1:
        return !!selectedConnectionType;
      case 2:
        return !!selectedDevice;
      case 3:
        return !!sensorName;
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(activeStep);
  const isLastStep = activeStep === steps.length - 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Conectar Novo Sensor</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancelar
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Voltar
        </Button>
        
        {isLastStep ? (
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={!canProceed || isConnecting}
            startIcon={isConnecting ? <CircularProgress size={16} /> : null}
          >
            {isConnecting ? 'Conectando...' : 'Conectar Sensor'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed}
          >
            Próximo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SensorConnectionDialog;