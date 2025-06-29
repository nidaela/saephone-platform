import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saephone | Smartphone Sales Platform',
  description: 'Plataforma de ventas de smartphones Saephone',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
