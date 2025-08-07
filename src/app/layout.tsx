import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Universal Social Media Content Generator - Create & Polish Content for All Platforms | Thread Xpert',
  description: 'Free AI-powered tool to create and polish content for Twitter, LinkedIn, Email, Instagram, and WhatsApp. Generate content from context or polish existing content with platform-specific formatting.',
  keywords: 'social media content generator, content creation, Twitter posts, LinkedIn posts, email writing, Instagram captions, WhatsApp messages, AI content tool, content polishing, multi-platform content',
  authors: [{ name: 'Sohrab Alam' }],
  creator: 'Sohrab Alam',
  publisher: 'Thread Xpert',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thread-xpert.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  openGraph: {
    title: 'Universal Social Media Content Generator - Create & Polish Content for All Platforms',
    description: 'Free AI-powered tool to create and polish content for Twitter, LinkedIn, Email, Instagram, and WhatsApp. Generate content from context or polish existing content with platform-specific formatting.',
    url: 'https://thread-xpert.vercel.app',
    siteName: 'Thread Xpert',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Universal Social Media Content Generator - Create and polish content for all platforms',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Social Media Content Generator - Create & Polish Content for All Platforms',
    description: 'Free AI-powered tool to create and polish content for Twitter, LinkedIn, Email, Instagram, and WhatsApp.',
    images: ['/og-image.png'],
    creator: '@sohrab_alam',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EHPP1DLF6B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EHPP1DLF6B');
          `}
        </Script>
        
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Universal Social Media Content Generator",
              "description": "Free AI-powered tool to create and polish content for Twitter, LinkedIn, Email, Instagram, and WhatsApp. Generate content from context or polish existing content with platform-specific formatting.",
              "url": "https://thread-xpert.vercel.app",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Sohrab Alam",
                "url": "https://www.linkedin.com/in/mohammad-sohrab-alam-8105474b/"
              },
              "creator": {
                "@type": "Person",
                "name": "Sohrab Alam"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  )
} 