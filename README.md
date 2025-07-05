# 🌡️ Visualizador de Dados de Sensores em Tempo Real

Um aplicativo web moderno e intuitivo para visualização em tempo real de dados de sensores, desenvolvido com React, TypeScript e Material-UI. Este projeto foi adaptado para funcionar exclusivamente como um visualizador de dados de sensores, mantendo o design original e oferecendo uma interface clara e visualmente atraente.

## 📋 Índice

- [Características](#-características)
- [Tipos de Sensores Suportados](#-tipos-de-sensores-suportados)
- [Conectividade](#-conectividade)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Arquitetura](#-arquitetura)
- [Componentes Principais](#-componentes-principais)
- [Configuração](#-configuração)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Características

### 🎯 Interface de Usuário
- **Design Moderno**: Interface limpa e intuitiva baseada em Material-UI
- **Visualização em Tempo Real**: Gráficos e medidores que atualizam automaticamente
- **Dashboard Personalizável**: Layout flexível com widgets reorganizáveis
- **Tema Responsivo**: Compatível com dispositivos desktop e móveis
- **Modo Escuro/Claro**: Alternância entre temas para melhor experiência

### 📊 Visualização de Dados
- **Gráficos Interativos**: Linha, área e barras com zoom e pan
- **Medidores em Tempo Real**: Gauges e indicadores visuais
- **Estatísticas Automáticas**: Cálculo de min, max, média e tendências
- **Alertas Inteligentes**: Sistema de notificações baseado em thresholds
- **Histórico de Dados**: Armazenamento e visualização de dados históricos

### 🔧 Funcionalidades Avançadas
- **Exportação de Dados**: CSV, JSON e Excel com filtros avançados
- **Monitor de Performance**: Acompanhamento de uso de memória e performance
- **Sistema de Alertas**: Notificações críticas, avisos e informações
- **Configuração Flexível**: Personalização de intervalos, unidades e calibração
- **Detecção de Anomalias**: Identificação automática de valores anômalos

## 🌡️ Tipos de Sensores Suportados

| Tipo | Unidade | Faixa | Descrição |
|------|---------|-------|----------|
| **Temperatura** | °C | -40 a 85°C | Sensores de temperatura ambiente e industrial |
| **Umidade** | % | 0 a 100% | Medição de umidade relativa do ar |
| **Pressão** | hPa | 300 a 1100 hPa | Pressão atmosférica e barométrica |
| **Movimento** | detectado | 0/1 | Detectores de movimento PIR |
| **Luminosidade** | lux | 0 a 100.000 lux | Sensores de luz ambiente |
| **Som** | dB | 0 a 140 dB | Medidores de nível sonoro |
| **Qualidade do Ar** | AQI | 0 a 500 | Índice de qualidade do ar |
| **Proximidade** | cm | 0 a 400 cm | Sensores ultrassônicos de distância |

## 🔌 Conectividade

### Bluetooth
- **Protocolo**: Bluetooth Low Energy (BLE)
- **Alcance**: Até 10 metros
- **Dispositivos Simultâneos**: Até 10
- **Configuração**: Escaneamento automático e pareamento simples

### Wi-Fi
- **Protocolo**: HTTP/HTTPS, WebSocket
- **Alcance**: Rede local
- **Dispositivos Simultâneos**: Até 50
- **Portas Padrão**: 80, 8080, 3000, 5000

### USB
- **Protocolo**: Serial, HID
- **Conexão**: Plug and play
- **Dispositivos Simultâneos**: Até 20
- **Compatibilidade**: Windows, macOS, Linux

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 16.0 ou superior
- **npm** 7.0 ou superior (ou **yarn** 1.22+)
- **Git** para clonagem do repositório

### Passo a Passo

#### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/sensor-data-viewer.git
cd sensor-data-viewer
```

#### 2. Instale as Dependências
```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

#### 3. Configure o Ambiente
```bash
# Copie o arquivo de configuração
cp .env.example .env.local

# Edite as configurações conforme necessário
nano .env.local
```

#### 4. Execute o Projeto
```bash
# Modo de desenvolvimento
npm run dev

# Ou com yarn
yarn dev
```

#### 5. Acesse a Aplicação
Abra seu navegador e acesse: `http://localhost:3000`

### Instalação em Produção

```bash
# Build da aplicação
npm run build

# Inicie o servidor de produção
npm start
```

## 📱 Uso

### Conectando Sensores

1. **Clique em "Conectar Sensor"** no dashboard principal
2. **Selecione o tipo de sensor** (temperatura, umidade, etc.)
3. **Escolha o método de conexão** (Bluetooth, Wi-Fi, USB)
4. **Escaneie dispositivos disponíveis**
5. **Configure o sensor** (nome, intervalo de leitura, unidades)
6. **Confirme a conexão**

### Visualizando Dados

- **Dashboard Principal**: Visão geral de todos os sensores
- **Gráficos Individuais**: Clique em um sensor para ver detalhes
- **Controles de Zoom**: Use a roda do mouse ou gestos touch
- **Seleção de Período**: Escolha entre 5min, 1h, 24h, 7d, 30d

### Configurando Alertas

1. **Acesse as configurações** do sensor
2. **Defina thresholds** para crítico, aviso e informação
3. **Configure notificações** (som, desktop, email)
4. **Teste os alertas** com valores simulados

### Exportando Dados

1. **Clique no menu de opções** (⋮)
2. **Selecione "Exportar Dados"**
3. **Escolha o formato** (CSV, JSON, Excel)
4. **Configure filtros** (sensores, período, máximo de registros)
5. **Baixe o arquivo** gerado

## 🏗️ Arquitetura

### Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── sensors/        # Componentes específicos de sensores
│   ├── layout/         # Layout e navegação
│   └── common/         # Componentes reutilizáveis
├── hooks/              # Custom hooks
├── services/           # Serviços e APIs
├── store/              # Gerenciamento de estado (Zustand)
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
├── config/             # Configurações
└── pages/              # Páginas Next.js
```

### Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Next.js
- **UI**: Material-UI (MUI), Emotion
- **Gráficos**: Recharts
- **Estado**: Zustand com persistência
- **Datas**: date-fns
- **Build**: Next.js, Webpack

## 🧩 Componentes Principais

### SensorDashboard
Componente principal que orquestra toda a interface do dashboard.

```typescript
import { SensorDashboard } from '@/components/sensors/SensorDashboard';

<SensorDashboard />
```

### SensorCard
Exibe informações individuais de cada sensor.

```typescript
import { SensorCard } from '@/components/sensors/SensorCard';

<SensorCard 
  sensor={sensorData}
  onConfigure={handleConfigure}
  onDisconnect={handleDisconnect}
/>
```

### RealTimeChart
Gráfico interativo para visualização de dados em tempo real.

```typescript
import { RealTimeChart } from '@/components/sensors/RealTimeChart';

<RealTimeChart
  sensorId="temp_001"
  chartType="line"
  timeRange={3600000} // 1 hora
/>
```

### SensorConnectionDialog
Dialog para conexão de novos sensores.

```typescript
import { SensorConnectionDialog } from '@/components/sensors/SensorConnectionDialog';

<SensorConnectionDialog
  open={dialogOpen}
  onClose={handleClose}
  onConnect={handleConnect}
/>
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_APP_NAME="Sensor Data Viewer"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_WS_URL="ws://localhost:3000/ws"
NEXT_PUBLIC_MAX_DATA_POINTS=1000
NEXT_PUBLIC_DATA_RETENTION_DAYS=30
```

### Configuração de Sensores

Edite `src/config/sensors.ts` para personalizar:

```typescript
export const SENSOR_DEFAULTS = {
  temperature: {
    unit: '°C',
    minValue: -40,
    maxValue: 85,
    precision: 1,
    readingInterval: 1000
  },
  // ... outros sensores
};
```

### Thresholds de Alertas

```typescript
export const ALERT_THRESHOLDS = {
  temperature: {
    critical: { min: -10, max: 50 },
    warning: { min: 0, max: 40 },
    info: { min: 10, max: 30 }
  },
  // ... outros sensores
};
```

## 🧪 Testes

### Executando Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes end-to-end
npm run test:e2e
```

### Estrutura de Testes

```
__tests__/
├── components/         # Testes de componentes
├── hooks/             # Testes de hooks
├── services/          # Testes de serviços
├── utils/             # Testes de utilitários
└── integration/       # Testes de integração
```

### Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react';
import { SensorCard } from '@/components/sensors/SensorCard';

test('renders sensor card with correct data', () => {
  const mockSensor = {
    id: 'test-sensor',
    name: 'Test Temperature Sensor',
    type: 'temperature',
    status: 'connected'
  };

  render(<SensorCard sensor={mockSensor} />);
  
  expect(screen.getByText('Test Temperature Sensor')).toBeInTheDocument();
  expect(screen.getByText('Conectado')).toBeInTheDocument();
});
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run type-check   # Verificação de tipos TypeScript
```

### Hooks Personalizados

#### useSensors
```typescript
const { 
  connectedSensors, 
  connectSensor, 
  disconnectSensor,
  scanDevices 
} = useSensors();
```

#### useSensorData
```typescript
const { 
  data, 
  isActive, 
  toggleDataCollection 
} = useSensorData(sensorId);
```

#### useAlerts
```typescript
const { 
  alerts, 
  alertCounts, 
  acknowledgeAlert,
  clearAlerts 
} = useAlerts();
```

## 🌐 Compatibilidade

### Sistemas Operacionais
- ✅ **Windows** 10/11
- ✅ **macOS** 10.15+
- ✅ **Linux** (Ubuntu, Debian, CentOS)
- ✅ **iOS** (Safari 14+)
- ✅ **Android** (Chrome 90+)

### Navegadores
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

## 📊 Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo e useMemo para evitar re-renders
- **Throttling**: Limitação de atualizações em tempo real
- **Downsampling**: Redução de pontos de dados para gráficos
- **Virtual Scrolling**: Para listas grandes de sensores

### Métricas de Performance
- **Tempo de Carregamento**: < 3 segundos
- **Uso de Memória**: < 200MB
- **Latência de Dados**: < 100ms
- **FPS dos Gráficos**: 60 FPS

## 🔒 Segurança

### Medidas Implementadas
- **Validação de Dados**: Sanitização de inputs
- **HTTPS**: Comunicação criptografada
- **CSP**: Content Security Policy
- **Rate Limiting**: Limitação de requisições
- **Logs de Auditoria**: Rastreamento de ações

## 🚨 Solução de Problemas

### Problemas Comuns

#### Sensor não conecta
1. Verifique se o dispositivo está ligado
2. Confirme a compatibilidade do protocolo
3. Teste a conectividade de rede
4. Reinicie o serviço de escaneamento

#### Dados não atualizam
1. Verifique a conexão com o sensor
2. Confirme o intervalo de leitura
3. Teste a latência da rede
4. Reinicie a coleta de dados

#### Performance lenta
1. Reduza o número de pontos de dados
2. Aumente o intervalo de atualização
3. Feche gráficos desnecessários
4. Limpe dados antigos

### Logs e Debugging

```bash
# Habilitar logs detalhados
DEBUG=sensor:* npm run dev

# Verificar logs do navegador
# Abra DevTools > Console

# Logs do servidor
tail -f logs/sensor-service.log
```

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes

- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos (feat, fix, docs, etc.)

### Reportando Bugs

Use o template de issue para reportar bugs:

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 95]
- Versão: [ex: 1.2.3]
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **UI/UX Designer**: [Nome do Designer]
- **Tester**: [Nome do Tester]

## 🙏 Agradecimentos

- [Material-UI](https://mui.com/) pela excelente biblioteca de componentes
- [Recharts](https://recharts.org/) pelos gráficos interativos
- [Zustand](https://github.com/pmndrs/zustand) pelo gerenciamento de estado
- [Next.js](https://nextjs.org/) pelo framework React

## 📞 Suporte

- **Email**: suporte@sensor-viewer.com
- **Discord**: [Link do Discord]
- **Documentação**: [Link da Documentação]
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/sensor-data-viewer/issues)

---

**Desenvolvido com ❤️ para a comunidade de IoT e sensores**

*Última atualização: Dezembro 2024*

## 🎨 Padrões de UI/UX

### 📱 Responsividade

O projeto utiliza um sistema de responsividade avançado com breakpoints customizados:

```typescript
// Breakpoints implementados
xs: 0,      // Mobile portrait
sm: 600,    // Mobile landscape / Tablet portrait  
md: 900,    // Tablet landscape / Small desktop
lg: 1200,   // Desktop
xl: 1536,   // Large desktop
xxl: 1920   // 4K / Ultrawide
```

#### Hook useResponsive
```typescript
const responsive = useResponsive();
const { isMobile, isTablet, isDesktop, getGridColumns, getSpacing } = responsive;
```

### 🎨 Paleta de Cores

#### Cores Principais (Apple-inspired)
- **Primary**: `#0A84FF` (Apple Blue)
- **Secondary**: `#8E8E98` (Apple Gray)
- **Success**: `#34C759` (Apple Green)
- **Error**: `#FF3B30` (Apple Red)
- **Warning**: `#FF9500` (Apple Orange)
- **Info**: `#5AC8FA` (Apple Light Blue)

#### Cores de Status Padronizadas
```typescript
status: {
  connected: '#34C759',
  disconnected: '#FF3B30', 
  connecting: '#FF9500',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  success: '#34C759'
}
```

### 📝 Tipografia

#### Hierarquia Responsiva
```typescript
h1: clamp(2rem, 5vw, 3.5rem)     // Títulos principais
h2: clamp(1.75rem, 4vw, 2.75rem) // Subtítulos
h3: clamp(1.5rem, 3vw, 2.25rem)  // Seções
h4: clamp(1.25rem, 2.5vw, 1.75rem) // Cards
h5: clamp(1.125rem, 2vw, 1.5rem)   // Elementos médios
h6: clamp(1rem, 1.5vw, 1.25rem)    // Elementos pequenos
body1: clamp(0.875rem, 1.2vw, 1rem) // Texto principal
body2: clamp(0.75rem, 1vw, 0.875rem) // Texto secundário
```

#### Variantes Específicas
- **StatsValue**: Para valores numéricos grandes
- **StatsLabel**: Para labels de estatísticas
- **SensorName**: Para nomes de sensores
- **SensorType**: Para tipos de sensores
- **StatusLabel**: Para indicadores de status

### 🧩 Componentes Padrão

#### 1. Cards
```typescript
// Cards com animações e hover
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));
```

#### 2. Botões
```typescript
// Botões com microinterações
'&:hover': {
  transform: 'translateY(-2px)',
},
'&:active': {
  transform: 'scale(0.98)',
}
```

#### 3. Indicadores de Status
```typescript
// Cores padronizadas para status
const getStatusColor = (status) => {
  switch (status) {
    case 'connected': return theme.palette.status.connected;
    case 'error': return theme.palette.status.error;
    case 'connecting': return theme.palette.status.connecting;
    default: return theme.palette.grey[500];
  }
};
```

### 🎭 Animações e Microinterações

#### Animações de Entrada
```css
/* FadeInUp */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* SlideInLeft */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

#### Transições Suaves
```typescript
// Transição padrão para todos os elementos
transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
```

### 📐 Espaçamento Responsivo

#### Sistema de Spacing
```typescript
// Função getSpacing() retorna valores baseados no dispositivo
const spacing = responsive.getSpacing(); // 1, 2, 3, 4

// Aplicação responsiva
sx={{ 
  p: { xs: 1, sm: 2, md: 3 },
  mb: { xs: 1, sm: 2, md: 3 }
}}
```

### 🔧 Grid System

#### Colunas Responsivas
```typescript
// Função getGridColumns() para diferentes contextos
const columns = responsive.getGridColumns('sensors'); // 12, 6, 4, 3

// Aplicação
<Grid item xs={12} sm={6} md={getGridColumns('sensors')}>
```

### 🎯 Padrões de Acessibilidade

#### Foco Visual
```typescript
'&:focus, &.Mui-focusVisible': {
  outline: `2px solid ${theme.palette.primary.main}`,
  outlineOffset: 0,
}
```

#### Labels Acessíveis
```typescript
<IconButton aria-label="Mais opções" tabIndex={0}>
  <MoreVertIcon />
</IconButton>
```

#### Contraste WCAG
- Cores de warning/info com texto escuro para melhor contraste
- Cores de status padronizadas para fácil identificação

### 📱 Layout Responsivo

#### Sidebar
- **Mobile**: Oculto por padrão, overlay temporário
- **Tablet**: Colapsado por padrão, largura 240px expandida
- **Desktop**: Expandido por padrão, largura 260px

#### Dashboard
- **Mobile**: Cards em coluna única, padding reduzido
- **Tablet**: Cards em 2 colunas, padding médio
- **Desktop**: Cards em 3-4 colunas, padding completo

### 🎨 Modo Escuro

O projeto suporta modo escuro com cores ajustadas:
- Background: `#1C1C1E` (Apple Dark)
- Paper: `#2C2C2E` (Apple Dark Gray)
- Texto: `#FFFFFF` e `#98989D`

### 📋 Checklist de Implementação

#### Para Novos Componentes:
- [ ] Usar `useResponsive()` hook
- [ ] Aplicar animações de entrada
- [ ] Implementar microinterações
- [ ] Usar cores de status padronizadas
- [ ] Adicionar labels acessíveis
- [ ] Testar em mobile/tablet/desktop
- [ ] Verificar contraste WCAG

#### Para Novas Páginas:
- [ ] Usar Layout component
- [ ] Implementar responsividade
- [ ] Adicionar feedback visual
- [ ] Testar navegação por teclado
- [ ] Verificar performance

### 🚀 Performance

#### Otimizações Implementadas:
- Lazy loading de componentes
- Debounce em inputs
- Memoização de cálculos pesados
- Transições CSS otimizadas
- Imagens responsivas

### 🔄 Manutenção

#### Para Atualizações:
1. Sempre testar em múltiplos dispositivos
2. Manter consistência com padrões estabelecidos
3. Usar variáveis do tema para cores
4. Documentar mudanças significativas
5. Verificar acessibilidade

---

## 🛠️ Tecnologias

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Styled Components + Emotion
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Material Icons
- **Date Handling**: date-fns

## 📦 Instalação

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 📄 Licença

MIT License