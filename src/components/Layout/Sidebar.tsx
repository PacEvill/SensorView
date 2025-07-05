import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, useMediaQuery, IconButton, Tooltip, Avatar, Badge, Button } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import { Home as HomeIcon, Assignment as AssignmentIcon, Group as GroupIcon, Business as BusinessIcon, Phone as PhoneIcon, Chat as ChatIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Sensors as SensorsIcon, Notifications as NotificationsIcon, BarChart as BarChartIcon, Add as AddIcon, GetApp as GetAppIcon, Brightness4 as Brightness4Icon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

const openedMixin = (theme: any): any => ({

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: any): any => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: collapsedDrawerWidth,
});

const DrawerHeader = styled('div')<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? collapsedDrawerWidth : drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(collapsed && {
    ...closedMixin(theme),
  }),
  ...(!collapsed && {
    ...openedMixin(theme),
  }),
  '& .MuiDrawer-paper': {
    borderRight: 'none',
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.background.paper,
    width: collapsed ? collapsedDrawerWidth : drawerWidth,
    outline: 'none',
    animation: 'slideInLeft 0.4s ease-out',
    '@keyframes slideInLeft': {
      from: {
        opacity: 0,
        transform: 'translateX(-100%)'
      },
      to: {
        opacity: 1,
        transform: 'translateX(0)'
      }
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      minWidth: 0,
      maxWidth: '100vw',
    },
  },
}));

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose }) => {
  const theme = useTheme();
  const router = useRouter();
  const responsive = useResponsive();
  
  const {
    isMobile,
    isTablet,
    deviceType,
    getSidebarWidth,
    getSpacing
  } = responsive;
  
  // Calcular larguras dinâmicas
  const currentDrawerWidth = getSidebarWidth(false);
  const currentCollapsedWidth = getSidebarWidth(true);

  // Mock de status rápido e usuário
  const connectedSensors = 5; // Exemplo
  const unreadAlerts = 2; // Exemplo
  const user = { name: 'Usuário', email: 'usuario@email.com' };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Sensores', icon: <SensorsIcon />, path: '/sensors' },
    { text: 'Alertas', icon: <NotificationsIcon />, path: '/alerts', badge: unreadAlerts },
    { text: 'Relatórios', icon: <BarChartIcon />, path: '/reports' },
  ];

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "permanent"}
      collapsed={collapsed}
      open={isMobile ? !collapsed : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Melhor performance em mobile
      }}
      sx={{
        width: collapsed ? currentCollapsedWidth : currentDrawerWidth,
        '& .MuiDrawer-paper': {
          width: collapsed ? currentCollapsedWidth : currentDrawerWidth,
          borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
          boxShadow: isMobile ? theme.shadows[16] : theme.shadows[2],
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <DrawerHeader collapsed={collapsed}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', pl: collapsed ? 0 : 2 }}>
          {!collapsed && (
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              TaskChat
            </Typography>
          )}
        </Box>
      </DrawerHeader>
      <Divider />
      {/* Navegação principal */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Link href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton
                sx={{
                  minHeight: isMobile ? 56 : 48,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: getSpacing(),
                  py: isMobile ? 2 : 1.5,
                  backgroundColor: router.pathname === item.path ? theme.palette.action.selected : 'transparent',
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'fadeInUp 0.5s ease-out',
                  animationDelay: `${0.1}s`,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  },
                  '&:hover, &:focus': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 0,
                  },
                  '&:active': { transform: 'scale(0.98)' },
                  '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 0 },
                }}
                tabIndex={0}
                aria-label={item.text}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: router.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: collapsed ? 0 : 1 }} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {/* Status rápido */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Sensores conectados
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
            {connectedSensors}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Alertas não lidos
          </Typography>
          <Typography variant="h6" color="error" sx={{ fontWeight: 700 }}>
            {unreadAlerts}
          </Typography>
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      {/* Ações rápidas */}
      <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2, mb: 1 }} size="small">
          {!collapsed && 'Conectar Sensor'}
        </Button>
        <Button variant="outlined" startIcon={<GetAppIcon />} sx={{ borderRadius: 2 }} size="small">
          {!collapsed && 'Exportar Dados'}
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      {/* Perfil do usuário */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{user.name[0]}</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      {/* Rodapé */}
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', mt: 'auto' }}>
        <IconButton color="inherit" size="small">
          <Brightness4Icon />
        </IconButton>
        <IconButton color="inherit" size="small">
          <HelpOutlineIcon />
        </IconButton>
        <IconButton color="inherit" size="small">
                <ExitToAppIcon />
        </IconButton>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;