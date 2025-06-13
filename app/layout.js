import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../lib/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Carbon Comply - Professional Carbon Footprint Analysis',
  description: 'Advanced carbon footprint calculation and compliance reporting for businesses',
  keywords: 'carbon footprint, CO2 calculator, sustainability, compliance, environmental reporting',
  authors: [{ name: 'Carbon Comply Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div id="root">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
