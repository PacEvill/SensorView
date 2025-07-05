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
  AlertTitle,
  Divider
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
  Usb as UsbIcon,
  PowerOff as PowerOffIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  BarChart as BarChartIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
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
import { useColorMode } from '../../hooks/useColorMode';

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

// Mock de dados de sensores
  const sensorStats = {
  total: 12,
  online: 9,
  offline: 2,
  error: 1,
};

// Mock de alertas recentes
const recentAlerts = [
  { id: 1, type: 'Temperatura', message: 'Sensor 01 acima do limite!', date: '2024-06-01 14:22', status: 'crítico' },
  { id: 2, type: 'Umidade', message: 'Sensor 03 abaixo do normal.', date: '2024-06-01 13:50', status: 'aviso' },
  { id: 3, type: 'Bateria', message: 'Sensor 07 com bateria baixa.', date: '2024-06-01 12:10', status: 'aviso' },
];

// Mock de atividades recentes
const recentActivities = [
  { id: 1, activity: 'Sensor 01 conectado', time: 'há 2 min' },
  { id: 2, activity: 'Alerta crítico resolvido', time: 'há 10 min' },
  { id: 3, activity: 'Configuração alterada', time: 'há 30 min' },
];

// Mock de estatísticas rápidas
const quickStats = [
  { label: 'Média de leitura', value: '23.5°C', icon: <TrendingUpIcon color="info" /> },
  { label: 'Pico de alerta', value: '5 alertas', icon: <WarningAmberIcon color="warning" /> },
  { label: 'Tempo online', value: '99.8%', icon: <CheckCircleIcon color="success" /> },
];

// Mock de próximos eventos
const upcomingEvents = [
  { id: 1, event: 'Manutenção programada', date: '2024-06-05 09:00' },
  { id: 2, event: 'Atualização de firmware', date: '2024-06-10 15:00' },
];

// Mock de últimos usuários logados
const recentUsers = [
  { id: 1, name: 'João Silva', time: 'há 5 min' },
  { id: 2, name: 'Maria Santos', time: 'há 1h' },
  { id: 3, name: 'Carlos Lima', time: 'há 2h' },
];

// Mock de tarefas rápidas
const quickTasks = [
  { id: 1, task: 'Atualizar sensores', done: false },
  { id: 2, task: 'Verificar alertas', done: true },
  { id: 3, task: 'Exportar dados', done: false },
];

const cardStyle = {
  p: { xs: 2.5, sm: 4 },
  borderRadius: 4,
  boxShadow: 6,
  bgcolor: 'background.paper',
  minHeight: { xs: 180, sm: 220, md: 240 },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: 12,
  },
};

const SensorDashboard: React.FC = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  // Cálculo de porcentagem de sensores online/offline
  const onlinePercent = Math.round((sensorStats.online / sensorStats.total) * 100);
  const offlinePercent = Math.round((sensorStats.offline / sensorStats.total) * 100);

  return (
    <Box sx={{ p: { xs: 1, sm: 3, md: 4 }, width: '100%', minHeight: '100vh', bgcolor: (theme) => theme.palette.background.default }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: (theme) => theme.palette.text.primary, letterSpacing: 1 }}>
        Visão Geral
          </Typography>
      <Grid container spacing={3}>
        {/* Linha 1: Cards de resumo de sensores + gráfico de barras */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ ...cardStyle, background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff' }}>
                <Tooltip title="Total de sensores cadastrados">
                  <Badge badgeContent={sensorStats.total} color="primary" sx={{ mb: 1 }}>
                    <SensorsIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Badge>
                </Tooltip>
                <Typography variant="h5" fontWeight={700}>{sensorStats.total}</Typography>
                <Typography variant="body2">Sensores Totais</Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ ...cardStyle, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff' }}>
                <Tooltip title="Sensores online">
                  <Badge badgeContent={sensorStats.online} color="success" sx={{ mb: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Badge>
                </Tooltip>
                <Typography variant="h5" fontWeight={700}>{sensorStats.online}</Typography>
                <Typography variant="body2">Online</Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ ...cardStyle, background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#fff' }}>
                <Tooltip title="Sensores offline">
                  <Badge badgeContent={sensorStats.offline} color="warning" sx={{ mb: 1 }}>
                    <PowerOffIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Badge>
                </Tooltip>
                <Typography variant="h5" fontWeight={700}>{sensorStats.offline}</Typography>
                <Typography variant="body2">Offline</Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ ...cardStyle, background: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)', color: '#fff' }}>
                <Tooltip title="Sensores com erro">
                  <Badge badgeContent={sensorStats.error} color="error" sx={{ mb: 1 }}>
                    <ErrorIcon sx={{ fontSize: 40, color: '#fff' }} />
              </Badge>
                </Tooltip>
                <Typography variant="h5" fontWeight={700}>{sensorStats.error}</Typography>
                <Typography variant="body2">Com Erro</Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ ...cardStyle, alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <BarChartIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Sensores Online/Offline</Typography>
            </Box>
            <Box width="100%" mb={1}>
              <Typography variant="body2" color="success.main">Online: {onlinePercent}%</Typography>
              <LinearProgress variant="determinate" value={onlinePercent} sx={{ height: 10, borderRadius: 5, mb: 1, bgcolor: 'success.lighter' }} color="success" />
              <Typography variant="body2" color="warning.main">Offline: {offlinePercent}%</Typography>
              <LinearProgress variant="determinate" value={offlinePercent} sx={{ height: 10, borderRadius: 5, bgcolor: 'warning.lighter' }} color="warning" />
            </Box>
          </Card>
        </Grid>

        {/* Linha 2: Alertas, Atividades, Tarefas rápidas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <WarningAmberIcon color="warning" />
              <Typography variant="h6" fontWeight={700}>Alertas Recentes</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1} flex={1}>
              {recentAlerts.map(alert => (
                <Fade in key={alert.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: alert.status === 'crítico' ? 'error.lighter' : 'warning.lighter', borderRadius: 2, p: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} color={alert.status === 'crítico' ? 'error.main' : 'warning.main'}>
                      {alert.type} {alert.status === 'crítico' ? <ErrorIcon fontSize="small" color="error" sx={{ ml: 0.5 }} /> : <WarningAmberIcon fontSize="small" color="warning" sx={{ ml: 0.5 }} />}
                    </Typography>
                    <Typography variant="body2">{alert.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{alert.date}</Typography>
                  </Box>
                </Fade>
              ))}
            </Stack>
            <Button variant="outlined" color="warning" sx={{ mt: 2, alignSelf: 'center' }} onClick={() => router.push('/alerts')}>
              Ver todos os alertas
            </Button>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <TimelineIcon color="info" />
              <Typography variant="h6" fontWeight={700}>Atividades Recentes</Typography>
          </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1} flex={1}>
              {recentActivities.map(act => (
                <Box key={act.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.2, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="body2" fontWeight={600}>{act.activity}</Typography>
                  <Typography variant="caption" color="text.secondary">{act.time}</Typography>
                </Box>
              ))}
              </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" mb={2} gap={1}>
              <AssignmentTurnedInIcon color="success" />
              <Typography variant="h6" fontWeight={700}>Tarefas Rápidas</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1} flex={1}>
              {quickTasks.map(task => (
                <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.2, borderRadius: 2, bgcolor: task.done ? 'success.lighter' : 'action.hover' }}>
                  <CheckCircleIcon color={task.done ? 'success' : 'disabled'} fontSize="small" />
                  <Typography variant="body2" fontWeight={600} sx={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.task}</Typography>
                </Box>
              ))}
              </Stack>
          </Card>
        </Grid>
        
        {/* Linha 3: Estatísticas, Configurações, Eventos, Usuários */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>Estatísticas Rápidas</Typography>
            </Box>
            <Divider sx={{ mb: 2, width: '100%' }} />
            <Stack spacing={2} width="100%">
              {quickStats.map((stat, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.2, borderRadius: 2, bgcolor: 'action.hover' }}>
                  {stat.icon}
                  <Typography variant="body2" fontWeight={600}>{stat.label}:</Typography>
                  <Typography variant="body2">{stat.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SettingsIcon color="secondary" />
              <Typography variant="h6" fontWeight={700}>Configurações Rápidas</Typography>
            </Box>
            <Divider sx={{ mb: 2, width: '100%' }} />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Tema atual: <b>{colorMode === 'dark' ? 'Escuro' : 'Claro'}</b>
            </Typography>
            <Tooltip title="Alternar tema claro/escuro">
              <IconButton color="primary" onClick={toggleColorMode} size="large">
                {colorMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" mt={2}>
              Clique para alternar o tema
            </Typography>
            <Button variant="outlined" color="secondary" sx={{ mt: 3 }} onClick={() => router.push('/settings')}>
              Ir para Configurações
            </Button>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <EventIcon color="info" />
              <Typography variant="h6" fontWeight={700}>Próximos Eventos</Typography>
            </Box>
            <Divider sx={{ mb: 2, width: '100%' }} />
            <Stack spacing={1} width="100%">
              {upcomingEvents.map(ev => (
                <Box key={ev.id} sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="body2" fontWeight={600}>{ev.event}</Typography>
                  <Typography variant="caption" color="text.secondary">{ev.date}</Typography>
                </Box>
              ))}
              </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SecurityIcon color="success" />
              <Typography variant="h6" fontWeight={700}>Últimos Usuários</Typography>
            </Box>
            <Divider sx={{ mb: 2, width: '100%' }} />
            <Stack spacing={1} width="100%">
              {recentUsers.map(user => (
                <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <GroupIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.time}</Typography>
                </Box>
              ))}
              </Stack>
          </Card>
        </Grid>
      </Grid>
     </Box>
  );
};

export default SensorDashboard;