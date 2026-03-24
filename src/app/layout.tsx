import type { Metadata } from 'next'
import { IBM_Plex_Sans, Literata } from 'next/font/google'

import '@/app/globals.css'
import 'maplibre-gl/dist/maplibre-gl.css'

const sans = IBM_Plex_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

const serif = Literata({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  description:
    'Bản đồ cách mạng Việt Nam theo trục giai đoạn, lãnh đạo, sự kiện, chiến dịch, địa danh và nguồn đối chiếu.',
  metadataBase: new URL(process.env.SITE_URL?.trim() || 'http://localhost:3000'),
  title: {
    default: 'Bản đồ cách mạng Việt Nam',
    template: '%s | Bản đồ cách mạng Việt Nam',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  )
}
