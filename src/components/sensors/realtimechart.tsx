/**
 * Componente de gráfico em tempo real para visualização de dados de sensores
 */

import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, subMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SensorDevice, RealTimeData, SensorReading } from '../../types/sensors';
import useResponsive from '../../hooks/useResponsive';

interface RealTimeChartProps {
  sensors: SensorDevice[];
  realTimeData: RealTimeData;
  type?: 'line' | 'area' | 'bar';
  timeRange?: number; // em minutos
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // em milissegundos
  onFullscreen?: () => void;
  onSettings?: () => void;
}

interface ChartDataPoint {
  timestamp: number;
  time: string;
  [sensorId: string]: number | string;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  sensors,
  realTimeData,
  type = 'line',
  timeRange = 60, // 1 hora por padrão
  height = 300,
  showGrid = true,
  showLegend = true,
  autoRefresh = true,
  refreshInterval = 1000,
  onFullscreen,
  onSettings
}) => {
  const theme = useTheme();
  const responsive = useResponsive();
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Altura adaptativa
  const chartHeight = responsive.isMobile ? 180 : responsive.isTablet ? 240 : height;

  // Cores para diferentes sensores
  const sensorColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    '#9c27b0', // purple
    '#ff5722', // deep orange
    '#607d8b', // blue grey
    '#795548'  // brown
  ];

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    const now = new Date();
    const startTime = subMinutes(now, selectedTimeRange);
    const dataPoints = new Map<number, ChartDataPoint>();

    // Coletar dados de todos os sensores
    sensors.forEach((sensor) => {
      const sensorData = realTimeData[sensor.id];
      if (!sensorData?.history) return;

      sensorData.history.forEach((reading) => {
        const timestamp = new Date(reading.timestamp).getTime();
        
        // Filtrar por intervalo de tempo
        if (timestamp < startTime.getTime()) return;

        // Arredondar timestamp para agrupar leituras próximas
        const roundedTimestamp = Math.floor(timestamp / (30 * 1000)) * (30 * 1000);
        
        if (!dataPoints.has(roundedTimestamp)) {
          dataPoints.set(roundedTimestamp, {
            timestamp: roundedTimestamp,
            time: format(new Date(roundedTimestamp), 'HH:mm:ss', { locale: ptBR })
          });
        }

        const point = dataPoints.get(roundedTimestamp)!;
        point[sensor.id] = reading.value;
      });
    });

    // Converter para array e ordenar por timestamp
    return Array.from(dataPoints.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-100); // Manter apenas os últimos 100 pontos para performance
  }, [sensors, realTimeData, selectedTimeRange, lastUpdate]);

  // Calcular domínio Y baseado nos dados
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];

    let min = Infinity;
    let max = -Infinity;

    chartData.forEach((point) => {
      sensors.forEach((sensor) => {
        const value = point[sensor.id] as number;
        if (typeof value === 'number' && !isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    if (min === Infinity || max === -Infinity) return [0, 100];

    // Adicionar margem de 10%
    const margin = (max - min) * 0.1;
    return [Math.max(0, min - margin), max + margin];
  }, [chartData, sensors]);

  const handleTimeRangeChange = (event: SelectChangeEvent<number>) => {
    setSelectedTimeRange(event.target.value as number);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const formatTooltipValue = (value: any, name: string) => {
    const sensor = sensors.find(s => s.id === name);
    if (!sensor) return [value, name];

    const unit = realTimeData[sensor.id]?.current?.unit || '';
    return [`${value} ${unit}`, sensor.name];
  };

  const formatXAxisLabel = (tickItem: any) => {
    return format(new Date(tickItem), 'HH:mm', { locale: ptBR });
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const xAxisProps = {
      dataKey: 'timestamp',
      type: 'number' as const,
      scale: 'time' as const,
      domain: ['dataMin', 'dataMax'],
      tickFormatter: formatXAxisLabel
    };

    const yAxisProps = {
      domain: yDomain,
      tickFormatter: (value: number) => value.toFixed(1)
    };

    const tooltipProps = {
      labelFormatter: (value: any) => format(new Date(value), 'dd/MM HH:mm:ss', { locale: ptBR }),
      formatter: formatTooltipValue,
      contentStyle: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            <XAxis {...xAxisProps} stroke={theme.palette.text.secondary} />
            <YAxis {...yAxisProps} stroke={theme.palette.text.secondary} />
            <RechartsTooltip {...tooltipProps} />
            {showLegend && <Legend />}
            
            {sensors.map((sensor, index) => (
              <Area
                key={sensor.id}
                type="monotone"
                dataKey={sensor.id}
                stroke={sensorColors[index % sensorColors.length]}
                fill={sensorColors[index % sensorColors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                name={sensor.name}
                connectNulls={false}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            <XAxis {...xAxisProps} stroke={theme.palette.text.secondary} />
            <YAxis {...yAxisProps} stroke={theme.palette.text.secondary} />
            <RechartsTooltip {...tooltipProps} />
            {showLegend && <Legend />}
            
            {sensors.map((sensor, index) => (
              <Bar
                key={sensor.id}
                dataKey={sensor.id}
                fill={sensorColors[index % sensorColors.length]}
                name={sensor.name}
              />
            ))}
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            <XAxis {...xAxisProps} stroke={theme.palette.text.secondary} />
            <YAxis {...yAxisProps} stroke={theme.palette.text.secondary} />
            <RechartsTooltip {...tooltipProps} />
            {showLegend && <Legend />}
            
            {sensors.map((sensor, index) => {
              const sensorData = realTimeData[sensor.id];
              const currentValue = sensorData?.current?.value;
              
              return (
                <React.Fragment key={sensor.id}>
                  <Line
                    type="monotone"
                    dataKey={sensor.id}
                    stroke={sensorColors[index % sensorColors.length]}
                    strokeWidth={2}
                    dot={false}
                    name={sensor.name}
                    connectNulls={false}
                  />
                  
                  {/* Linha de referência para valor atual */}
                  {currentValue !== undefined && (
                    <ReferenceLine
                      y={currentValue}
                      stroke={sensorColors[index % sensorColors.length]}
                      strokeDasharray="5 5"
                      strokeOpacity={0.5}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </LineChart>
        );
    }
  };

  if (sensors.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary'
        }}
      >
        <Typography>Nenhum sensor selecionado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: theme.shadows[1] }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
        <Typography variant={responsive.isMobile ? 'subtitle2' : 'subtitle1'} fontWeight={600} color="text.primary">
          Gráfico em Tempo Real
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Tooltip title="Reduzir Zoom">
            <span>
              <IconButton aria-label="Reduzir Zoom" onClick={handleZoomOut} size="small" tabIndex={0}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Aumentar Zoom">
            <span>
              <IconButton aria-label="Aumentar Zoom" onClick={handleZoomIn} size="small" tabIndex={0}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Tela Cheia">
            <span>
              <IconButton aria-label="Tela Cheia" onClick={onFullscreen} size="small" tabIndex={0}>
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Configurações">
            <span>
              <IconButton aria-label="Configurações" onClick={onSettings} size="small" tabIndex={0}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      <FormControl size="small" sx={{ minWidth: 100, mb: { xs: 1, sm: 0 } }}>
        <Select
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Intervalo de tempo' }}
        >
          <MenuItem value={15}>15 min</MenuItem>
          <MenuItem value={30}>30 min</MenuItem>
          <MenuItem value={60}>1 hora</MenuItem>
          <MenuItem value={180}>3 horas</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ width: '100%', height: chartHeight, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RealTimeChart;