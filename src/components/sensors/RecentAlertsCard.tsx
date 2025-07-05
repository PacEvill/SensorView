import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Temperatura',
    message: 'Sensor 01 acima do limite!',
    date: '2024-06-01 14:22',
    icon: <ErrorOutlineIcon color="error" sx={{ fontSize: 20, mb: '-2px' }} />, 
    color: 'error.main'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Umidade',
    message: 'Sensor 03 abaixo do normal.',
    date: '2024-06-01 13:50',
    icon: <WarningAmberIcon color="warning" sx={{ fontSize: 20, mb: '-2px' }} />, 
    color: 'warning.main'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Bateria',
    message: 'Sensor 07 com bateria baixa.',
    date: '2024-06-01 12:10',
    icon: <WarningAmberIcon color="warning" sx={{ fontSize: 20, mb: '-2px' }} />, 
    color: 'warning.main'
  }
];

const RecentAlertsCard = () => (
  <Card sx={{ borderRadius: 3, p: 0, background: 'background.paper', minWidth: 320 }}>
    <CardContent sx={{ textAlign: 'center', pb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 32, mb: 1 }} />
        <Typography variant="h6" fontWeight={700} color="warning.main">
          Alertas Recentes
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {mockAlerts.map((alert) => (
        <Box key={alert.id} sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color={alert.color}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
          >
            {alert.title} {alert.icon}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {alert.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {alert.date}
          </Typography>
        </Box>
      ))}
      <Button
        variant="outlined"
        color="warning"
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          minWidth: 220,
          mx: 'auto',
          display: 'block',
          mt: 2
        }}
      >
        VER TODOS OS ALERTAS
      </Button>
    </CardContent>
  </Card>
);

export default RecentAlertsCard; 