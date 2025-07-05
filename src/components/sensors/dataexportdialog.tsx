/**
 * Componente para exportação de dados dos sensores
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  FormGroup,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Close as CloseIcon,
  FileDownload as FileIcon,
  TableChart as CsvIcon,
  Code as JsonIcon,
  Description as ExcelIcon,
  DateRange as DateIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { ptBR } from 'date-fns/locale';
import { useStore } from '../../store';
import { formatBytes, formatTimestamp } from '../../utils/sensorUtils';
import { SensorReading } from '../../types/sensors';

interface DataExportDialogProps {
  open: boolean;
  onClose: () => void;
}

const DataExportDialog: React.FC<DataExportDialogProps> = ({ open, onClose }) => {
  const { connectedSensors, realTimeData } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  
  // Estados do formulário
  const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'custom' | 'last24h' | 'last7d' | 'last30d'>('last24h');
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(false);
  const [maxRecords, setMaxRecords] = useState(10000);
  const [groupBySensor, setGroupBySensor] = useState(false);
  
  // Estados de validação
  const [errors, setErrors] = useState<string[]>([]);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [recordCount, setRecordCount] = useState(0);

  // Selecionar todos os sensores por padrão
  useEffect(() => {
    if (connectedSensors.length > 0 && selectedSensors.length === 0) {
      setSelectedSensors(connectedSensors.map(s => s.id));
    }
  }, [connectedSensors, selectedSensors.length]);

  // Calcular estimativas
  useEffect(() => {
    const calculateEstimates = () => {
      let totalRecords = 0;
      let totalSize = 0;

      selectedSensors.forEach(sensorId => {
        const sensorData = realTimeData[sensorId];
        if (!sensorData) return;
        
        const readings = sensorData.history || [];
        let filteredReadings = readings;

        // Aplicar filtro de data
        if (dateRange !== 'all') {
          const now = Date.now();
          let startTime: number;

          switch (dateRange) {
            case 'last24h':
              startTime = now - 24 * 60 * 60 * 1000;
              break;
            case 'last7d':
              startTime = now - 7 * 24 * 60 * 60 * 1000;
              break;
            case 'last30d':
              startTime = now - 30 * 24 * 60 * 60 * 1000;
              break;
            case 'custom':
              startTime = startDate?.getTime() || 0;
              const endTime = endDate?.getTime() || now;
              filteredReadings = readings.filter(
                (r: SensorReading) => {
                  const timestamp = r.timestamp instanceof Date ? r.timestamp.getTime() : r.timestamp;
                  return timestamp >= startTime && timestamp <= endTime;
                }
              );
              break;
            default:
              startTime = 0;
          }

          if (dateRange !== 'custom') {
            filteredReadings = readings.filter((r: SensorReading) => {
              const timestamp = r.timestamp instanceof Date ? r.timestamp.getTime() : r.timestamp;
              return timestamp >= startTime;
            });
          }
        }

        totalRecords += Math.min(filteredReadings.length, maxRecords);
        
        // Estimar tamanho baseado no formato
        const avgRecordSize = format === 'json' ? 150 : format === 'csv' ? 50 : 80;
        totalSize += filteredReadings.length * avgRecordSize;
      });

      setRecordCount(totalRecords);
      setEstimatedSize(totalSize);
    };

    calculateEstimates();
  }, [selectedSensors, realTimeData, dateRange, startDate, endDate, maxRecords, format]);

  // Validar formulário
  useEffect(() => {
    const newErrors: string[] = [];

    if (selectedSensors.length === 0) {
      newErrors.push('Selecione pelo menos um sensor');
    }

    if (dateRange === 'custom') {
      if (!startDate || !endDate) {
        newErrors.push('Selecione as datas de início e fim');
      } else if (startDate >= endDate) {
        newErrors.push('A data de início deve ser anterior à data de fim');
      }
    }

    if (recordCount > maxRecords) {
      newErrors.push(`Muitos registros selecionados (${recordCount}). Máximo: ${maxRecords}`);
    }

    if (estimatedSize > 50 * 1024 * 1024) { // 50MB
      newErrors.push('Arquivo muito grande. Reduza o período ou número de sensores');
    }

    setErrors(newErrors);
  }, [selectedSensors, dateRange, startDate, endDate, recordCount, maxRecords, estimatedSize]);

  const handleSensorToggle = (sensorId: string) => {
    setSelectedSensors(prev => 
      prev.includes(sensorId)
        ? prev.filter(id => id !== sensorId)
        : [...prev, sensorId]
    );
  };

  const handleSelectAllSensors = () => {
    setSelectedSensors(
      selectedSensors.length === connectedSensors.length 
        ? [] 
        : connectedSensors.map(s => s.id)
    );
  };

  const handleExport = async () => {
    if (errors.length > 0) return;

    let timeRange: { start: number; end: number } | undefined;

    if (dateRange !== 'all') {
      const now = Date.now();
      let start: number;

      switch (dateRange) {
        case 'last24h':
          start = now - 24 * 60 * 60 * 1000;
          break;
        case 'last7d':
          start = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'last30d':
          start = now - 30 * 24 * 60 * 60 * 1000;
          break;
        case 'custom':
          start = startDate?.getTime() || 0;
          break;
        default:
          start = 0;
      }

      timeRange = {
        start,
        end: dateRange === 'custom' ? (endDate?.getTime() || now) : now
      };
    }

    setIsExporting(true);
    
    try {
      // Simular exportação de dados
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria implementada a lógica real de exportação
      console.log('Exportando dados:', { format, selectedSensors, timeRange });
      
      onClose();
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (fmt: string) => {
    switch (fmt) {
      case 'csv': return <CsvIcon />;
      case 'json': return <JsonIcon />;
      case 'xlsx': return <ExcelIcon />;
      default: return <FileIcon />;
    }
  };

  const getFormatDescription = (fmt: string) => {
    switch (fmt) {
      case 'csv': return 'Arquivo de texto separado por vírgulas, compatível com Excel';
      case 'json': return 'Formato estruturado, ideal para desenvolvimento';
      case 'xlsx': return 'Planilha do Excel com formatação avançada';
      default: return '';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DownloadIcon />
            Exportar Dados dos Sensores
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Formato de Exportação */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">Formato de Exportação</FormLabel>
                <RadioGroup
                  row
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                >
                  {['csv', 'json', 'xlsx'].map((fmt) => (
                    <FormControlLabel
                      key={fmt}
                      value={fmt}
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          {getFormatIcon(fmt)}
                          <Box>
                            <Typography variant="body2">
                              {fmt.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getFormatDescription(fmt)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Seleção de Sensores */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Sensores para Exportar
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSensors.length === connectedSensors.length}
                    indeterminate={
                      selectedSensors.length > 0 && 
                      selectedSensors.length < connectedSensors.length
                    }
                    onChange={handleSelectAllSensors}
                  />
                }
                label="Selecionar Todos"
              />
              
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {connectedSensors.map((sensor) => {
                  const dataCount = realTimeData[sensor.id]?.history?.length || 0;
                  
                  return (
                    <ListItem key={sensor.id} dense>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedSensors.includes(sensor.id)}
                          onChange={() => handleSensorToggle(sensor.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={sensor.name}
                        secondary={
                          <Box>
                            <Typography variant="caption">
                              {sensor.type} • {dataCount} registros
                            </Typography>
                            <br />
                            <Chip
                              size="small"
                              label={sensor.connectionType}
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {/* Período de Dados */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Período dos Dados
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Período</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  label="Período"
                >
                  <MenuItem value="all">Todos os dados</MenuItem>
                  <MenuItem value="last24h">Últimas 24 horas</MenuItem>
                  <MenuItem value="last7d">Últimos 7 dias</MenuItem>
                  <MenuItem value="last30d">Últimos 30 dias</MenuItem>
                  <MenuItem value="custom">Período personalizado</MenuItem>
                </Select>
              </FormControl>

              {dateRange === 'custom' && (
                <Box mt={2}>
                  <DateTimePicker
                    label="Data de Início"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal"
                      }
                    }}
                  />
                  <DateTimePicker
                    label="Data de Fim"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal"
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Opções Avançadas */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Opções Avançadas
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeMetadata}
                      onChange={(e) => setIncludeMetadata(e.target.checked)}
                    />
                  }
                  label="Incluir metadados dos sensores"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeStatistics}
                      onChange={(e) => setIncludeStatistics(e.target.checked)}
                    />
                  }
                  label="Incluir estatísticas resumidas"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={groupBySensor}
                      onChange={(e) => setGroupBySensor(e.target.checked)}
                    />
                  }
                  label="Agrupar dados por sensor"
                />
              </FormGroup>
              
              <TextField
                label="Máximo de registros"
                type="number"
                value={maxRecords}
                onChange={(e) => setMaxRecords(Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 100, max: 100000, step: 100 }}
                helperText="Limite de registros para evitar arquivos muito grandes"
              />
            </Box>

            {/* Resumo da Exportação */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Resumo da Exportação
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                  icon={<FilterIcon />}
                  label={`${selectedSensors.length} sensores`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<DateIcon />}
                  label={`${recordCount.toLocaleString()} registros`}
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  icon={<FileIcon />}
                  label={`~${formatBytes(estimatedSize)}`}
                  color="info"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Alertas e Erros */}
            {errors.length > 0 && (
              <Box>
                {errors.map((error, index) => (
                  <Alert key={index} severity="error" sx={{ mb: 1 }}>
                    {error}
                  </Alert>
                ))}
              </Box>
            )}

            {isExporting && (
              <Box>
                <Alert severity="info">
                  <Typography variant="body2">
                    Exportando dados... Isso pode levar alguns momentos.
                  </Typography>
                  <LinearProgress sx={{ mt: 1 }} />
                </Alert>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={errors.length > 0 || isExporting}
            startIcon={<DownloadIcon />}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DataExportDialog;