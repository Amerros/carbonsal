/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway configuration
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Remove standalone output for now - causing issues with Railway
  // output: 'standalone',
  
  // Optimize for Railway deployment
  poweredByHeader: false,
  compress: true,
  
  images: {
    domains: [],
    unoptimized: true, // Better for Railway deployment
  },
  
  // Environment variables for Railway
  env: {
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_URL: process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
      : process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  },
  
  // Railway-specific headers
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.RAILWAY_PUBLIC_DOMAIN 
              ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
              : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
