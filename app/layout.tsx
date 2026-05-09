import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SisOp Blog',
  description: 'Portafolio de evidencias — Sistemas Operativos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <ScrollProgress />
        <Navbar />
        <ViewTransition name="page" enter="page-enter" exit="page-exit">
          {children}
        </ViewTransition>
      </body>
    </html>
  )
}
