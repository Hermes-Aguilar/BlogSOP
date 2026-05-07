import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import './globals.css'

export const metadata: Metadata = {
  title: 'SisOp Blog',
  description: 'Portafolio de evidencias — Sistemas Operativos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ScrollProgress />
        <Navbar />
        {children}
      </body>
    </html>
  )
}