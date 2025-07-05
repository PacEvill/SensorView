import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, useMediaQuery, IconButton, Tooltip, Avatar, Badge, Button, Menu, MenuItem } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import { Home as HomeIcon, Assignment as AssignmentIcon, Group as GroupIcon, Business as BusinessIcon, Phone as PhoneIcon, Chat as ChatIcon, Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Sensors as SensorsIcon, Notifications as NotificationsIcon, BarChart as BarChartIcon, Add as AddIcon, GetApp as GetAppIcon, Brightness4 as Brightness4Icon, HelpOutline as HelpOutlineIcon, MenuOpen as MenuOpenIcon, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { alpha } from '@mui/material/styles';

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
  const { isMobile, getSidebarWidth, getSpacing } = responsive;
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  
  // Calcular larguras dinâmicas
  const currentDrawerWidth = getSidebarWidth(false);
  const currentCollapsedWidth = getSidebarWidth(true);

  // Mock de status rápido e usuário
  const connectedSensors = 5; // Exemplo
  const unreadAlerts = 2; // Exemplo
  const user = { name: 'Usuário', email: 'usuario@email.com', avatar: '' };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Sensores', icon: <SensorsIcon />, path: '/sensors' },
    { text: 'Alertas', icon: <NotificationsIcon />, path: '/alerts', badge: unreadAlerts },
    { text: 'Relatórios', icon: <BarChartIcon />, path: '/reports' },
  ];

  // Handler para menu de perfil
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  // Handler para colapsar/expandir
  const handleCollapseToggle = () => {
    onClose();
  };

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "permanent"}
      collapsed={collapsed}
      open={isMobile ? !collapsed : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: collapsed ? getSidebarWidth(true) : getSidebarWidth(false),
        '& .MuiDrawer-paper': {
          width: collapsed ? getSidebarWidth(true) : getSidebarWidth(false),
          borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
          boxShadow: isMobile ? theme.shadows[16] : theme.shadows[2],
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          px: collapsed ? 0 : 1.5,
        },
      }}
    >
      {/* Botão de colapsar/expandir sempre visível */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end', py: 1, px: 1 }}>
        <IconButton
          aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          onClick={handleCollapseToggle}
          size="large"
          sx={{ color: theme.palette.primary.main }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>
      {/* Avatar e menu de perfil */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <Tooltip title={user.name} placement="right" arrow>
          <IconButton onClick={handleProfileMenuOpen} aria-label="Abrir menu de perfil" size="large">
            <Avatar sx={{ width: 44, height: 44 }} src={user.avatar}>
              {user.name[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
        {!collapsed && (
          <>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </>
        )}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuItem onClick={handleProfileMenuClose}>Perfil</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Configurações</MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>Sair</MenuItem>
        </Menu>
      </Box>
      <Divider />
      {/* Navegação principal com nav/ul/li para SEO e acessibilidade */}
      <nav aria-label="Menu principal">
        <List component="ul" sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              component="li"
              key={item.text}
              disablePadding
              sx={{
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'flex-start',
                alignItems: 'center',
                my: 0.5,
              }}
            >
              <Link href={item.path} passHref legacyBehavior>
                <Tooltip title={collapsed ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                    component="a"
                    role="menuitem"
                    aria-label={item.text}
                    tabIndex={0}
                    sx={{
                      width: 48,
                      height: 48,
                      minWidth: 48,
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 0,
                      m: 0,
                      backgroundColor: router.pathname === item.path ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                      borderRadius: '12px',
                      boxShadow: router.pathname === item.path ? theme.shadows[4] : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover, &:focus': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.18),
                        outline: `1.5px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        outlineOffset: 0,
                        borderRadius: '12px',
                      },
                      '&:active': { transform: 'scale(0.98)' },
                      '&.Mui-focusVisible': {
                        outline: `1.5px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        outlineOffset: 0,
                        borderRadius: '12px',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        m: 0,
                        p: 0,
                        position: 'relative',
                        color: router.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                        fontSize: 28,
                        transition: 'font-size 0.2s',
                      }}
                    >
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} overlap="circular">
                          {item.icon}
                        </Badge>
                      ) : item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        display: collapsed ? 'none' : 'block',
                        ml: 2,
                        fontWeight: router.pathname === item.path ? 700 : 500,
                        color: router.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                        transition: 'opacity 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </Link>
            </ListItem>
          ))}
        </List>
      </nav>
      <Divider sx={{ my: 1 }} />
      {/* Status rápido */}
      {!collapsed && (
        <>
          {/* Saudação e status */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
              Olá, {user.name}!
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%', display: 'inline-block', mr: 0.5 }} />
              Online
            </Typography>
          </Box>
          {/* Resumo rápido */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Sensores conectados: <b>{connectedSensors}</b>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Alertas não lidos: <b>{unreadAlerts}</b>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Último login: 10:32
            </Typography>
          </Box>
        </>
      )}
      <Divider sx={{ my: 1 }} />
      {/* Ações rápidas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 2, mt: 'auto' }}>
        <Tooltip title={collapsed ? 'Configurações' : ''} placement="right" arrow>
          <IconButton color="primary" sx={{ mb: 1 }} aria-label="Configurações">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={collapsed ? 'Alternar tema' : ''} placement="right" arrow>
          <IconButton color="primary" sx={{ mb: 1 }} aria-label="Alternar tema">
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title={collapsed ? 'Ajuda' : ''} placement="right" arrow>
          <IconButton color="primary" sx={{ mb: 1 }} aria-label="Ajuda">
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={collapsed ? 'Sair' : ''} placement="right" arrow>
          <IconButton color="error" sx={{ mt: 2 }} aria-label="Sair">
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {/* Rodapé com versão e suporte */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 2, mt: 'auto', textAlign: 'center' }}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            TaskChat v1.0.0
          </Typography>
          <Typography
            variant="caption"
            color="primary.main"
            component="a"
            href="https://suporte.exemplo.com"
            target="_blank"
            rel="noopener"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Suporte
          </Typography>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default Sidebar;