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
    'Website ưu tiên dòng thời gian cho bản đồ lịch sử cách mạng Việt Nam: giai đoạn, sự kiện, chiến dịch, địa danh, trích nguồn và câu hỏi ôn tập.',
  metadataBase: new URL(process.env.SITE_URL?.trim() || 'http://localhost:3000'),
  title: {
    default: 'VNR Atlas',
    template: '%s | VNR Atlas',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  )
}
