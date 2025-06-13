import { Inter } from 'next/font/google'
import './globals.css'

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
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
