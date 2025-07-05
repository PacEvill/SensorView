import React from 'react';
import { Box, Typography, Button, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          bgcolor: (theme) => theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <SentimentVeryDissatisfiedIcon
          sx={{
            fontSize: { xs: 64, sm: 100, md: 120 },
            color: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            mb: 2,
            opacity: 0.85,
          }}
        />
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            color: (theme) => theme.palette.text.primary,
            letterSpacing: 2,
            fontSize: { xs: 48, sm: 72, md: 90 },
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            mb: 2,
            color: (theme) => theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: { xs: 20, sm: 28 },
          }}
        >
          Oops! Página não encontrada.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: (theme) => theme.palette.text.secondary,
            fontSize: { xs: 15, sm: 18 },
          }}
        >
          A página que você está procurando não existe ou foi movida.<br />
          Se precisar de ajuda, entre em contato com o suporte.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
          sx={{
            mt: 2,
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          Voltar para o início
        </Button>
      </Box>
    </>
  );
}