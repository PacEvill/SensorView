/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignora erros de TypeScript durante o build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignora erros de ESLint durante o build
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Habilita features experimentais do Next.js
    appDir: false,
  },
  webpack: (config, { isServer }) => {
    // Configurações do webpack para resolver problemas de módulos
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;