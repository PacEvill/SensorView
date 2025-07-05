/**
 * Dashboard principal para visualização de dados de sensores em tempo real
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CardHeader,
  Stack,
  Tooltip,
  Fade,
  CircularProgress,
  useTheme,
  LinearProgress,
  useMediaQuery,
  Skeleton,
  AlertTitle
} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  DeviceHub as DeviceHubIcon,
  Close as CloseIcon,
  GetApp as ExportIcon,
  Speed as PerformanceIcon,
  MoreVert as MoreIcon,
  Fullscreen as FullscreenIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  Usb as UsbIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useStore } from '../../store';
import { useSensors, useAlerts } from '../../hooks/useSensors';
import { useHydration } from '../../hooks/useHydration';
import SensorCard from './sensorcard';
import SensorConnectionDialog from './sensorconnectiondialog';
import SensorConfigurationPanel from './sensorconfigurationpanel';
import SensorAlerts from './sensoralerts';
import PerformanceMonitor from './performancemonitor';
import DataExportDialog from './dataexportdialog';
import { SensorDevice, SensorType } from '../../types/sensors';
import { useRouter } from 'next/router';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.between('sm', 'md')]: {
    padding: theme.spacing(2),
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  }
}));

const SensorGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  flexGrow: 1,
  '& .MuiGrid-item': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: theme.shadows[4],
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
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
  }
}));

const ActionButtons = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '& > *': {
      flex: 1
    }
  },
  '& .MuiButton-root': {
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    }
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
  letterSpacing: 0.5,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  animation: 'slideInLeft 0.5s ease-out',
  '@keyframes slideInLeft': {
    from: {
      opacity: 0,
      transform: 'translateX(-20px)'
    },
    to: {
      opacity: 1,
      transform: 'translateX(0)'
    }
  }
}));

const StatsValue = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: 'inherit'
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
  fontWeight: 500,
  lineHeight: 1.4,
  color: 'inherit',
  opacity: 0.9
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '0.01em',
  color: theme.palette.text.primary
}));

const EnhancedChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 80%, rgba(10, 132, 255, 0.08) 100%)`,
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    height: '220px',
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.between('sm', 'md')]: {
    height: '300px',
    padding: theme.spacing(2),
  },
}));

const summaryCards = [
  {
    title: 'Sensores',
    description: 'Veja o status e quantidade de sensores conectados.',
    icon: <SensorsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />,
    button: 'Ver todos',
    link: '/sensors',
  },
  {
    title: 'Alertas',
    description: 'Acompanhe os alertas mais recentes do sistema.',
    icon: <WarningAmberIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />,
    button: 'Ver todos',
    link: '/alerts',
  },
  {
    title: 'Configurações',
    description: 'Acesse e ajuste as configurações do sistema.',
    icon: <SettingsIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />,
    button: 'Ajustar',
    link: '/settings',
  },
];

const SensorDashboard: React.FC = () => {
  const router = useRouter();

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, width: '100%', minHeight: '100vh', bgcolor: (theme) => theme.palette.background.default }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: (theme) => theme.palette.text.primary }}>
        Visão Geral
      </Typography>
      <Grid container spacing={4}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              {card.icon}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: (theme) => theme.palette.text.primary }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: (theme) => theme.palette.text.secondary }}>
                {card.description}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => router.push(card.link)}>
                {card.button}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SensorDashboard;