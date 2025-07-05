import React from 'react';
import { Box, Typography } from '@mui/material';

function Error({ statusCode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Typography variant="h3" color="error" gutterBottom>
        {statusCode ? `Erro ${statusCode}` : 'Erro desconhecido'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {statusCode
          ? `Ocorreu um erro ${statusCode} no servidor ou na página requisitada.`
          : 'Ocorreu um erro inesperado no cliente.'}
      </Typography>
    </Box>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 