# Padrões de UI/UX - Guia Prático

Este documento contém exemplos práticos de como usar os padrões de UI/UX implementados no projeto TaskChat.

## 🎯 Índice

1. [Responsividade](#responsividade)
2. [Componentes](#componentes)
3. [Animações](#animações)
4. [Cores e Status](#cores-e-status)
5. [Tipografia](#tipografia)
6. [Acessibilidade](#acessibilidade)

---

## 📱 Responsividade

### Hook useResponsive

```typescript
import useResponsive from '../../hooks/useResponsive';

const MyComponent = () => {
  const responsive = useResponsive();
  const { isMobile, isTablet, isDesktop, getGridColumns, getSpacing } = responsive;

  return (
    <Box sx={{ p: getSpacing() }}>
      <Grid container spacing={getSpacing()}>
        <Grid item xs={12} sm={6} md={getGridColumns('sensors')}>
          {/* Conteúdo */}
        </Grid>
      </Grid>
    </Box>
  );
};
```

### Breakpoints Customizados

```typescript
// Valores retornados por getGridColumns()
const gridColumns = {
  sensors: {
    mobile: 12,    // 1 coluna
    tablet: 6,     // 2 colunas
    desktop: 4,    // 3 colunas
    large: 3       // 4 colunas
  },
  stats: {
    mobile: 12,    // 1 coluna
    tablet: 6,     // 2 colunas
    desktop: 3     // 4 colunas
  },
  charts: {
    mobile: 12,    // 1 coluna
    tablet: 6,     // 2 colunas
    desktop: 6     // 2 colunas
  }
};
```

---

## 🧩 Componentes

### Card Padrão

```typescript
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: 'fadeInUp 0.6s ease-out',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  },
  
  '@keyframes fadeInUp': {
    from: { opacity: 0; transform: 'translateY(20px)'; },
    to: { opacity: 1; transform: 'translateY(0)'; }
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.95rem',
  }
}));

// Uso
<StyledCard>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</StyledCard>
```

### Botão com Microinterações

```typescript
const ActionButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  
  '&:active': {
    transform: 'scale(0.98)',
  },
  
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 0,
  }
}));
```

### Indicador de Status

```typescript
const StatusIndicator = styled(Box)<{ status: string }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'connected': return theme.palette.status?.connected;
      case 'error': return theme.palette.status?.error;
      case 'connecting': return theme.palette.status?.connecting;
      default: return theme.palette.grey[500];
    }
  };

  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: getColor(),
    animation: status === 'reading' ? 'pulse 2s infinite' : 'none',
    
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 }
    }
  };
});

// Uso
<StatusIndicator status="connected" />
```

---

## 🎭 Animações

### Animações de Entrada

```typescript
// FadeInUp
const FadeInUpBox = styled(Box)(({ theme }) => ({
  animation: 'fadeInUp 0.6s ease-out',
  '@keyframes fadeInUp': {
    from: { opacity: 0; transform: 'translateY(20px)'; },
    to: { opacity: 1; transform: 'translateY(0)'; }
  }
}));

// SlideInLeft
const SlideInLeftBox = styled(Box)(({ theme }) => ({
  animation: 'slideInLeft 0.5s ease-out',
  '@keyframes slideInLeft': {
    from: { opacity: 0; transform: 'translateX(-20px)'; },
    to: { opacity: 1; transform: 'translateX(0)'; }
  }
}));

// Com delay escalonado
const StaggeredItem = styled(Box)(({ theme, delay = 0 }) => ({
  animation: 'fadeInUp 0.5s ease-out',
  animationDelay: `${delay}s`,
  '@keyframes fadeInUp': {
    from: { opacity: 0; transform: 'translateY(10px)'; },
    to: { opacity: 1; transform: 'translateY(0)'; }
  }
}));

// Uso com delay
{items.map((item, index) => (
  <StaggeredItem key={item.id} delay={index * 0.1}>
    {item.content}
  </StaggeredItem>
))}
```

### Transições Suaves

```typescript
// Transição padrão para todos os elementos
const transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

// Aplicação
const SmoothCard = styled(Card)(({ theme }) => ({
  transition,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));
```

---

## 🎨 Cores e Status

### Cores de Status Padronizadas

```typescript
// Função helper para cores de status
const getStatusColor = (status: string, theme: any) => {
  const statusColors = {
    connected: theme.palette.status?.connected || theme.palette.success.main,
    disconnected: theme.palette.status?.disconnected || theme.palette.error.main,
    connecting: theme.palette.status?.connecting || theme.palette.warning.main,
    error: theme.palette.status?.error || theme.palette.error.main,
    warning: theme.palette.status?.warning || theme.palette.warning.main,
    info: theme.palette.status?.info || theme.palette.info.main,
    success: theme.palette.status?.success || theme.palette.success.main
  };
  
  return statusColors[status] || theme.palette.grey[500];
};

// Uso
const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor: getStatusColor(status, theme),
  color: theme.palette.getContrastText(getStatusColor(status, theme)),
  fontWeight: 500
}));
```

### Componente de Status Completo

```typescript
interface StatusDisplayProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  label?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, label }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <StatusIndicator status={status} />
      <Typography
        variant="status"
        sx={{ color: getStatusColor(status, theme) }}
      >
        {label || getStatusLabel(status)}
      </Typography>
    </Box>
  );
};

// Uso
<StatusDisplay status="connected" label="Sensor Ativo" />
```

---

## 📝 Tipografia

### Variantes Responsivas

```typescript
// Componentes de tipografia padronizados
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

const SensorName = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
  letterSpacing: '0.01em'
}));

const SensorType = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  lineHeight: 1.4
}));

// Uso
<Box>
  <StatsValue>42</StatsValue>
  <StatsLabel>Sensores Ativos</StatsLabel>
</Box>
```

### Hierarquia de Texto

```typescript
// Para diferentes níveis de informação
const TextHierarchy = {
  primary: {
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
    fontWeight: 600,
    color: 'text.primary'
  },
  secondary: {
    fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
    fontWeight: 500,
    color: 'text.primary'
  },
  tertiary: {
    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
    fontWeight: 400,
    color: 'text.secondary'
  },
  caption: {
    fontSize: 'clamp(0.75rem, 0.8vw, 0.875rem)',
    fontWeight: 400,
    color: 'text.secondary'
  }
};
```

---

## ♿ Acessibilidade

### Foco Visual

```typescript
// Padrão de foco para todos os elementos interativos
const focusStyles = {
  '&:focus, &.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 0,
  }
};

// Aplicação em botões
const AccessibleButton = styled(Button)(({ theme }) => ({
  ...focusStyles,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));
```

### Labels Acessíveis

```typescript
// Sempre incluir aria-label em ícones
<IconButton 
  aria-label="Configurações do sensor"
  onClick={handleSettings}
>
  <SettingsIcon />
</IconButton>

// Para elementos com texto descritivo
<Tooltip title="Desconectar sensor">
  <span>
    <IconButton 
      aria-label="Desconectar sensor"
      onClick={handleDisconnect}
    >
      <PowerOffIcon />
    </IconButton>
  </span>
</Tooltip>
```

### Navegação por Teclado

```typescript
// Garantir que todos os elementos sejam focáveis
const KeyboardNavigableCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  tabIndex: 0,
  ...focusStyles,
  
  '&:focus': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8]
  }
}));

// Uso
<KeyboardNavigableCard
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {/* Conteúdo */}
</KeyboardNavigableCard>
```

---

## 📱 Layout Responsivo

### Grid Responsivo

```typescript
// Padrão para grids responsivos
const ResponsiveGrid = () => {
  const responsive = useResponsive();
  
  return (
    <Grid container spacing={responsive.getSpacing()}>
      <Grid item xs={12} sm={6} md={responsive.getGridColumns('sensors')}>
        <SensorCard />
      </Grid>
      <Grid item xs={12} sm={6} md={responsive.getGridColumns('sensors')}>
        <SensorCard />
      </Grid>
    </Grid>
  );
};
```

### Container Responsivo

```typescript
const ResponsiveContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(2),
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    maxWidth: '100vw',
  },
  
  [theme.breakpoints.between('sm', 'md')]: {
    padding: theme.spacing(1.5),
    maxWidth: '98vw',
  }
}));
```

---

## 🔄 Manutenção

### Checklist para Novos Componentes

```typescript
// Template para novos componentes
const NewComponent: React.FC<NewComponentProps> = ({ prop1, prop2 }) => {
  const theme = useTheme();
  const responsive = useResponsive();
  
  // ✅ Usar useResponsive hook
  const { isMobile, getSpacing } = responsive;
  
  // ✅ Aplicar animações de entrada
  const StyledComponent = styled(Box)(({ theme }) => ({
    animation: 'fadeInUp 0.6s ease-out',
    '@keyframes fadeInUp': {
      from: { opacity: 0; transform: 'translateY(20px)'; },
      to: { opacity: 1; transform: 'translateY(0)'; }
    }
  }));
  
  // ✅ Implementar microinterações
  const InteractiveButton = styled(Button)(({ theme }) => ({
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { transform: 'translateY(-2px)' },
    '&:active': { transform: 'scale(0.98)' }
  }));
  
  // ✅ Usar cores de status padronizadas
  const statusColor = getStatusColor(status, theme);
  
  // ✅ Adicionar labels acessíveis
  return (
    <StyledComponent>
      <InteractiveButton aria-label="Ação do componente">
        Ação
      </InteractiveButton>
    </StyledComponent>
  );
};
```

---

## 📋 Exemplos Práticos

### Card de Sensor Completo

```typescript
const SensorCardExample = () => {
  const responsive = useResponsive();
  
  return (
    <StyledCard>
      <CardContent sx={{ p: responsive.getSpacing() }}>
        <SensorHeader>
          <Box>
            <SensorName>Sensor de Temperatura</SensorName>
            <SensorType>Temperatura</SensorType>
          </Box>
          <StatusIndicator status="connected" />
        </SensorHeader>
        
        <ValueDisplay>
          <StatsValue>24.5°C</StatsValue>
        </ValueDisplay>
        
        <StatusDisplay status="connected" label="Conectado" />
      </CardContent>
    </StyledCard>
  );
};
```

### Dashboard Responsivo

```typescript
const DashboardExample = () => {
  const responsive = useResponsive();
  
  return (
    <ResponsiveContainer>
      <FadeInUpBox>
        <DashboardTitle>Dashboard de Sensores</DashboardTitle>
        
        <Grid container spacing={responsive.getSpacing()}>
          <Grid item xs={12} sm={6} md={responsive.getGridColumns('stats')}>
            <StatsCard>
              <StatsValue>42</StatsValue>
              <StatsLabel>Sensores Ativos</StatsLabel>
            </StatsCard>
          </Grid>
        </Grid>
      </FadeInUpBox>
    </ResponsiveContainer>
  );
};
```

---

Este guia deve ser usado como referência para manter consistência em todo o projeto. Sempre siga os padrões estabelecidos para garantir uma experiência de usuário coesa e acessível. 