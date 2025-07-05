'use client';

/**
 * Header redesenhado para o SensorApp
 * Implementa as melhorias de UX/UI conforme o plano de melhorias
 * Inclui recursos de acessibilidade e responsividade aprimorada
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Box,
  Tooltip,
  Button,
  Divider,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';

// Ícones
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import TaskIcon from '@mui/icons-material/Task';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SensorsIcon from '@mui/icons-material/Sensors';

// Hooks e componentes
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useColorMode } from '../../hooks/useColorMode';
import { useStore } from '../../store';

// Componentes estilizados
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FFFFFF',
  color: theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
  borderBottom: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none',
  transition: 'all 0.3s ease',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.text.primary, 0.6),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  minHeight: 56,
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'background 0.2s',
  '&:hover': {
    opacity: 0.9,
    background: alpha(theme.palette.primary.main, 0.06),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
  },
}));

import AccessibilityMenu from '../common/AccessibilityMenu';

// Interface e mock de notificações fora do componente
interface AppNotification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: AppNotification[] = [
  {
    id: 1,
    title: 'Nova mensagem', 
    message: 'Você recebeu uma nova mensagem',
    timestamp: new Date().toISOString(),
    read: false 
  },
  {
    id: 2,
    title: 'Lembrete', 
    message: 'Reunião em 30 minutos',
    timestamp: new Date().toISOString(),
    read: true 
  }
];

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  /**
   * Título personalizado para exibir na barra de navegação
   * Se não for fornecido, exibirá o título padrão "SensorApp"
   */
  pageTitle?: string;
  /**
   * Função para lidar com a pesquisa global
   */
  onSearch?: (query: string) => void;
}

const Header = ({ sidebarCollapsed, onSidebarToggle, pageTitle, onSearch }: HeaderProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Estado para controle da pesquisa
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estados para menus
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [messagesAnchorEl, setMessagesAnchorEl] = useState<null | HTMLElement>(null);
  const [tasksAnchorEl, setTasksAnchorEl] = useState<null | HTMLElement>(null);
  
  // Estado para controle de notificações
  const [showNotificationBadge, setShowNotificationBadge] = useState<boolean>(true);
  
  // Handlers para menus
  const logout = useStore(state => state.logout);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    router.push('/'); // Redireciona para a landing page após o logout
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem component={Link} href="/profile">
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Perfil" />
      </MenuItem>
      
      <MenuItem component={Link} href="/settings">
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Configurações" />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Sair" />
      </MenuItem>
    </Menu>
  );
  
  // Function to mark all notifications as read
  const markAllAsRead = () => {
    // In a real app, this would update the state or call an API
    console.log('Marking all notifications as read');
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
    markAllAsRead();
  };
  
  const handleMessagesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMessagesAnchorEl(event.currentTarget);
  };
  
  const handleTasksMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTasksAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
    setMessagesAnchorEl(null);
    setTasksAnchorEl(null);
  };
  
  // Função para lidar com a pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };
  
  // Efeito para esconder o badge de notificação após visualização
  useEffect(() => {
    if (notificationsAnchorEl) {
      setShowNotificationBadge(false);
    }
  }, [notificationsAnchorEl]);
  
  // useEffect para badge de notificações
  useEffect(() => {
    if (unreadNotifications > 0) {
      setShowNotificationBadge(true);
    }
  }, [mockNotifications]);
  
  const handleSettings = () => {
    handleMenuClose();
    router.push('/profile');
  };
  
  // unreadNotifications usando mockNotifications
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  const unreadMessages = 3; // Exemplo - substituir por dados reais
  const pendingTasks = 5; // Exemplo - substituir por dados reais
  
  // Renderização dos menus
  // Estilização adicional para o menu de perfil
  const profileMenuPaperProps = {
    elevation: 3,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
      mt: 1.5,
      borderRadius: 2,
      minWidth: 180,
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };
  
  // This section was duplicated and has been removed

  // Componente de avatar do usuário
  const UserAvatar = () => (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
        <AccountCircle />
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Usuário</Typography>
        <Typography variant="body2" color="text.secondary">usuario@email.com</Typography>
      </Box>
    </Box>
  );

  const renderUserProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        sx: { width: 320, maxWidth: '100%' }
      }}
    >
      <UserAvatar />
      
      <Divider />
      
      <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
        <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
        Configurações
      </MenuItem>
      
      <MenuItem onClick={toggleColorMode} sx={{ py: 1.5 }}>
        {theme.palette.mode === 'dark' ? (
          <>
            <LightModeIcon fontSize="small" sx={{ mr: 2 }} />
            Modo Claro
          </>
        ) : (
          <>
            <DarkModeIcon fontSize="small" sx={{ mr: 2 }} />
            Modo Escuro
          </>
        )}
      </MenuItem>
      
      <MenuItem onClick={() => {}} sx={{ py: 1.5 }}>
        <HelpOutlineIcon fontSize="small" sx={{ mr: 2 }} />
        Ajuda & Suporte
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
        <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
        Sair
      </MenuItem>
    </Menu>
  );

  // Renderização do menu de notificações
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notificationsAnchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 320,
          maxHeight: 400,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight="bold">Notificações</Typography>
        <Button size="small" onClick={() => {
          // Mark all notifications as read
          const updatedNotifications = mockNotifications.map(notification => ({
            ...notification,
            read: true
          }));
          // In a real app, you would update the state here
          console.log('Marked all as read', updatedNotifications);
        }}>Marcar todas como lidas</Button>
      </Box>
      
      <Divider />
      
      {mockNotifications.length > 0 ? (
        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
          {mockNotifications.map((notification: AppNotification, index: number) => (
            <React.Fragment key={notification.id}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  py: 1.5,
                  backgroundColor: notification.read ? 'transparent' : alpha('#1976d2', 0.05), // Using a static color instead of theme reference
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium">
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < mockNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhuma notificação
          </Typography>
        </Box>
      )}
    </Menu>
  );
  
  interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    read: boolean;
  }

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: 1,
      sender: 'João Silva',
      content: 'Olá, podemos marcar uma reunião?',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      sender: 'Maria Santos',
      content: 'Documentos enviados',
      timestamp: new Date().toISOString(),
      read: true
    }
  ];

  // Message interface is already defined above

  // Renderização do menu de mensagens
  const renderMessagesMenu = (
    <Menu
      anchorEl={messagesAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(messagesAnchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 320,
          maxHeight: 400,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight="bold">Mensagens</Typography>
        <Button size="small" onClick={() => {}}>Marcar todas como lidas</Button>
      </Box>
      
      <Divider />
      
      {mockMessages.length > 0 ? (
        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
          {mockMessages.map((message: Message, index: number) => (
            <React.Fragment key={message.id}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  py: 1.5,
                  backgroundColor: message.read ? 'transparent' : alpha('#1976d2', 0.05), // Using a static color instead of theme reference
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium">
                      {message.sender}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < mockMessages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhuma mensagem
          </Typography>
        </Box>
      )}
    </Menu>
  );
  
  // Renderização do menu de tarefas
  const renderTasksMenu = (
    <Menu
      anchorEl={tasksAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(tasksAnchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 320,
          maxHeight: 400,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight="bold">Tarefas Pendentes</Typography>
        <Button size="small" onClick={() => {}}>Ver todas</Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Funcionalidade em desenvolvimento
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        <Button size="small" onClick={() => router.push('/tasks')}>
          Gerenciar tarefas
        </Button>
      </Box>
    </Menu>
  );
  
  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ minHeight: 64, px: 3 }}>
          {/* Botão do menu lateral com suporte a toggle */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="abrir/fechar menu lateral"
            onClick={onSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Link href="/dashboard" passHref>
            <LogoContainer>
              <SensorsIcon sx={{ fontSize: 44, color: '#a259f7' }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: 'bold', color: '#a259f7', ml: 1, letterSpacing: 1 }}
              >
                SensorView
              </Typography>
            </LogoContainer>
          </Link>
          
          <Box component="form" onSubmit={handleSearchSubmit}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Campo de pesquisa global"
              />
            </Search>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Tarefas pendentes">
              <ActionButton
                size="large"
                aria-label="mostrar tarefas pendentes"
                color="inherit"
                onClick={handleTasksMenuOpen}
              >
                <Badge badgeContent={pendingTasks} color="error">
                  <TaskIcon />
                </Badge>
              </ActionButton>
            </Tooltip>
            
            <Tooltip title="Mensagens">
              <ActionButton
                size="large"
                aria-label="mostrar novas mensagens"
                color="inherit"
                onClick={handleMessagesMenuOpen}
              >
                <Badge badgeContent={unreadMessages} color="error">
                  <MailIcon />
                </Badge>
              </ActionButton>
            </Tooltip>
            
            <AccessibilityMenu />
            
            <Tooltip title="Notificações">
              <ActionButton
                size="large"
                aria-label="mostrar notificações"
                color="inherit"
                onClick={handleNotificationsMenuOpen}
              >
                {unreadNotifications > 0 && showNotificationBadge ? (
                  <StyledBadge badgeContent={unreadNotifications} color="error">
                    <NotificationsIcon />
                  </StyledBadge>
                ) : (
                  <NotificationsIcon />
                )}
              </ActionButton>
            </Tooltip>
            
              <Tooltip title="Perfil">
                <ActionButton
                  size="large"
                  edge="end"
                  aria-label="conta do usuário atual"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <AccountCircle />
                    </Avatar>
                </ActionButton>
              </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {renderUserProfileMenu}
      {renderNotificationsMenu}
      {renderMessagesMenu}
      {renderTasksMenu}
    </>
  );
};

export default Header;