import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-fraunces',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://elle-donuts.com'),
  title: 'EllE Donuts - Premium Artisan Donuts',
  description: 'Indulge in our handcrafted artisan donuts made with premium ingredients. Order now via WhatsApp for delivery across Oman.',
  keywords: 'donuts, artisan donuts, premium donuts, Oman, desserts, bakery',
  authors: [{ name: 'EllE Donuts' }],
  creator: 'EllE Donuts',
  publisher: 'EllE Donuts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'EllE Donuts - Premium Artisan Donuts',
    description: 'Indulge in our handcrafted artisan donuts made with premium ingredients.',
    url: 'https://elledonuts.com',
    siteName: 'EllE Donuts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EllE Donuts - Premium Artisan Donuts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EllE Donuts - Premium Artisan Donuts',
    description: 'Indulge in our handcrafted artisan donuts made with premium ingredients.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF7FA' },
    { media: '(prefers-color-scheme: dark)', color: '#FFF7FA' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}