import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import Adsense from '@/components/GoogleAds'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Radius",
  description: "Radius, simple but clean"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <Adsense pid="4011630613786565" />
      </head>

      <body className={inter.className}>
        <Navbar />

        <div className="pt-14">{children}</div>
      </body>
    </html>
  )
}
