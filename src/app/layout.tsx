import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { cn, constructMetadata } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import BottomNav from '@/components/BottomNav'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="theme-color" content="#ffffff"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Zonomo" />
      </head>
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.className
        )}>
        <ThemeProvider>
          <main className='relative flex flex-col min-h-screen'>
            <Providers>
              <Navbar />
              <div className='flex-grow flex-1'>
                {children}
              </div>
            </Providers>
          </main>

          <Toaster position='top-center' richColors />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
