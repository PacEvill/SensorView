/**
 * Componente de cartão para exibir informações de um sensor individual
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import {
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  PowerOff as PowerOffIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Battery20 as Battery20Icon,
  Battery50 as Battery50Icon,
  Battery80 as Battery80Icon,
  BatteryFull as BatteryFullIcon,
  SignalCellular1Bar as Signal1BarIcon,
  SignalCellular2Bar as Signal2BarIcon,
  SignalCellular3Bar as Signal3BarIcon,
  SignalCellular4Bar as Signal4BarIcon,
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  Usb as UsbIcon,
  DeviceThermostat as TemperatureIcon,
  Opacity as HumidityIcon,
  Compress as PressureIcon,
  DirectionsRun as MotionIcon,
  Lightbulb as LightIcon,
  VolumeUp as SoundIcon,
  Air as AirQualityIcon,
  Straighten as ProximityIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SensorDevice, SensorReading } from '../../types/sensors';
import { useStore } from '../../store';
import Typography, { TypographyProps } from '@mui/material/Typography';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  minWidth: 260,
  maxWidth: 340,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  animation: 'fadeInUp 0.6s ease-out',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  '&:hover, &:focus': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 0,
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 0,
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 160,
    maxWidth: '100%',
    padding: theme.spacing(1),
    fontSize: '0.95rem',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    minWidth: 200,
    maxWidth: 300,
    padding: theme.spacing(1.5),
    fontSize: '1rem',
  },
}));

const SensorHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
  '& .MuiIconButton-root': {
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      transform: 'scale(0.95)',
    }
  }
}));

const ValueDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1, 0),
  fontWeight: 600,
  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
  color: theme.palette.primary.dark,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
  },
}));

const StatusIndicator = styled(Box)<{ status: string }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'connected':
        return theme.palette.status?.connected || theme.palette.success.main;
      case 'reading':
        return theme.palette.status?.info || theme.palette.info.main;
      case 'error':
        return theme.palette.status?.error || theme.palette.error.main;
      case 'connecting':
        return theme.palette.status?.connecting || theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: getColor(),
    animation: status === 'reading' ? 'pulse 2s infinite' : 'none',
    '@keyframes pulse': {
      '0%': {
        opacity: 1
      },
      '50%': {
        opacity: 0.5
      },
      '100%': {
        opacity: 1
      }
    }
  };
});

const StatusLabel = styled(Typography)<{ status: string }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'connected':
        return theme.palette.status?.connected || theme.palette.success.main;
      case 'reading':
        return theme.palette.status?.info || theme.palette.info.main;
      case 'error':
        return theme.palette.status?.error || theme.palette.error.main;
      case 'connecting':
        return theme.palette.status?.connecting || theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return {
    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
    fontWeight: 500,
    color: getColor(),
    lineHeight: 1.4
  };
});

const SensorName = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
  letterSpacing: '0.01em'
}));

const SensorType = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  lineHeight: 1.4
}));

interface SensorCardProps {
  sensor: SensorDevice;
  currentReading?: SensorReading;
  statistics?: {
    min: number;
    max: number;
    average: number;
    trend: 'rising' | 'falling' | 'stable';
  };
  onDisconnect: (sensorId: string) => void;
  onConfigure: (sensorId: string) => void;
}

const SensorCard: React.FC<SensorCardProps> = ({
  sensor,
  currentReading,
  statistics,
  onDisconnect,
  onConfigure
}) => {
  const theme = useTheme();
  const responsive = useResponsive();
  const { disconnectSensor } = useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  // Extrair informações de responsividade
  const {
    isMobile,
    isTablet,
    deviceType,
    getSpacing,
    getCardSize
  } = responsive;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = async () => {
    try {
      await disconnectSensor(sensor.id);
      onDisconnect(sensor.id);
    } catch (error) {
      console.error('Erro ao desconectar sensor:', error);
    }
    handleMenuClose();
  };

  const handleConfigure = () => {
    onConfigure(sensor.id);
    handleMenuClose();
  };

  const getSensorIcon = () => {
    const iconProps = { sx: { fontSize: 24 } };
    
    switch (sensor.type) {
      case 'temperature':
        return <TemperatureIcon {...iconProps} />;
      case 'humidity':
        return <HumidityIcon {...iconProps} />;
      case 'pressure':
        return <PressureIcon {...iconProps} />;
      case 'motion':
        return <MotionIcon {...iconProps} />;
      case 'light':
        return <LightIcon {...iconProps} />;
      case 'sound':
        return <SoundIcon {...iconProps} />;
      case 'air_quality':
        return <AirQualityIcon {...iconProps} />;
      case 'proximity':
        return <ProximityIcon {...iconProps} />;
      default:
        return <TemperatureIcon {...iconProps} />;
    }
  };

  const getConnectionIcon = () => {
    const iconProps = { sx: { fontSize: 16 } };
    
    switch (sensor.connectionType) {
      case 'bluetooth':
        return <BluetoothIcon {...iconProps} />;
      case 'wifi':
        return <WifiIcon {...iconProps} />;
      case 'usb':
        return <UsbIcon {...iconProps} />;
      default:
        return <WifiIcon {...iconProps} />;
    }
  };

  const getBatteryIcon = () => {
    if (!sensor.batteryLevel) return null;
    
    const iconProps = { sx: { fontSize: 16 } };
    
    if (sensor.batteryLevel > 80) return <BatteryFullIcon {...iconProps} />;
    if (sensor.batteryLevel > 50) return <Battery80Icon {...iconProps} />;
    if (sensor.batteryLevel > 20) return <Battery50Icon {...iconProps} />;
    return <Battery20Icon {...iconProps} />;
  };

  const getTrendIcon = () => {
    if (!statistics) return null;
    
    const iconProps = { sx: { fontSize: 16 } };
    
    switch (statistics.trend) {
      case 'rising':
        return <TrendingUpIcon {...iconProps} color="success" />;
      case 'falling':
        return <TrendingDownIcon {...iconProps} color="error" />;
      default:
        return <TrendingFlatIcon {...iconProps} color="info" />;
    }
  };

  const getStatusLabel = () => {
    switch (sensor.status) {
      case 'connected':
        return 'Conectado';
      case 'reading':
        return 'Lendo';
      case 'error':
        return 'Erro';
      case 'connecting':
        return 'Conectando';
      default:
        return 'Desconectado';
    }
  };

  const getStatusColor = () => {
    switch (sensor.status) {
      case 'connected':
        return 'success';
      case 'reading':
        return 'info';
      case 'error':
        return 'error';
      case 'connecting':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSensorTypeLabel = () => {
    const labels = {
      temperature: 'Temperatura',
      humidity: 'Umidade',
      pressure: 'Pressão',
      motion: 'Movimento',
      light: 'Luminosidade',
      sound: 'Som',
      air_quality: 'Qualidade do Ar',
      proximity: 'Proximidade'
    };
    return labels[sensor.type] || sensor.type;
  };

  return (
    <StyledCard>
      <CardContent sx={{ 
        flexGrow: 1, 
        p: getSpacing(),
        pb: getSpacing() / 2,
        '&:last-child': {
          pb: getSpacing()
        }
      }}>
        {/* Header */}
        <SensorHeader>
          <Stack direction="row" alignItems="center" spacing={1}>
            {getSensorIcon()}
            <StatusIndicator status={sensor.status} />
          </Stack>
          
          <IconButton
            aria-label="Mais opções"
            size="small"
            sx={{ color: theme.palette.text.secondary }}
            tabIndex={0}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        </SensorHeader>

        {/* Nome e Tipo */}
        <SensorName variant="h6" component="div" noWrap>
          {sensor.name}
        </SensorName>
        
        <SensorType variant="body2" color="text.secondary" gutterBottom>
          {getSensorTypeLabel()}
        </SensorType>

        {/* Status */}
        <Stack direction="row" spacing={getSpacing() / 2} alignItems="center" sx={{ mb: getSpacing() }}>
          <Chip
            label={getStatusLabel()}
            color={getStatusColor() as any}
            size="small"
          />
          
          {getConnectionIcon()}
          
          {sensor.batteryLevel && (
            <Tooltip title={`Bateria: ${sensor.batteryLevel}%`}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getBatteryIcon()}
              </Box>
            </Tooltip>
          )}
        </Stack>

        {/* Valor Atual */}
        {currentReading && (
          <ValueDisplay>
            <Typography variant="h4" component="div" color="primary">
              {currentReading.value.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentReading.unit}
            </Typography>
          </ValueDisplay>
        )}

        {/* Estatísticas */}
        {statistics && (
          <Box sx={{ mt: getSpacing() }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: getSpacing() / 2 }}>
              <Typography variant="caption" color="text.secondary">
                Estatísticas
              </Typography>
              {getTrendIcon()}
            </Stack>
            
            <Stack spacing={getSpacing() / 4}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Mín:</Typography>
                <Typography variant="caption">{statistics.min.toFixed(1)}</Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Máx:</Typography>
                <Typography variant="caption">{statistics.max.toFixed(1)}</Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Média:</Typography>
                <Typography variant="caption">{statistics.average.toFixed(1)}</Typography>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Informações Adicionais */}
        {(sensor.manufacturer || sensor.model) && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 1 }} />
            {sensor.manufacturer && (
              <Typography variant="caption" display="block" color="text.secondary">
                {sensor.manufacturer}
              </Typography>
            )}
            {sensor.model && (
              <Typography variant="caption" display="block" color="text.secondary">
                {sensor.model}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Menu de Opções */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleConfigure}>
          <SettingsIcon sx={{ mr: 1 }} />
          Configurar
        </MenuItem>
        
        <MenuItem onClick={() => console.log('Refresh sensor')}>
          <RefreshIcon sx={{ mr: 1 }} />
          Atualizar
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleDisconnect} sx={{ color: 'error.main' }}>
          <PowerOffIcon sx={{ mr: 1 }} />
          Desconectar
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default SensorCard;