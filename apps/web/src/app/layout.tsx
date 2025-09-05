import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Algorythmos - AI Workflow Automation',
    template: '%s | Algorythmos'
  },
  description: 'Automate your workflows with AI-powered automation. Build, schedule, and monitor intelligent workflows with our Relay.app-style platform.',
  keywords: ['workflow automation', 'AI automation', 'business process automation', 'workflow builder'],
  authors: [{ name: 'Algorythmos' }],
  creator: 'Algorythmos',
  publisher: 'Algorythmos',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://algorythmos.com',
    title: 'Algorythmos - AI Workflow Automation',
    description: 'Automate your workflows with AI-powered automation',
    siteName: 'Algorythmos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algorythmos - AI Workflow Automation',
    description: 'Automate your workflows with AI-powered automation',
    creator: '@algorythmos',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
          return (
          <html lang="en">
            <body className={`${inter.className} bg-white text-gray-900`}>
              <Navbar />
              {children}
              <Footer />
            </body>
          </html>
        )
}