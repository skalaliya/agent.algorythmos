import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Algorythmos - AI Workflow Automation',
  description: 'Automate your workflows with AI-powered automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-canvas">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
