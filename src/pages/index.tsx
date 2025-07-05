import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect directly to dashboard for sensor monitoring
    router.push('/dashboard');
  }, [router]);
  
  // Página de carregamento enquanto verifica autenticação
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f8fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/logo.png" 
          alt="TaskChat Logo" 
          style={{ 
            width: '120px', 
            marginBottom: '20px',
            opacity: 0.8
          }} 
        />
        <h2 style={{ 
          color: '#2C3E50', 
          fontWeight: 500,
          marginBottom: '10px'
        }}>
          Carregando SensorView...
        </h2>
      </div>
    </div>
  );
}