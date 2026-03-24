import Link from 'next/link'
import type { ReactNode } from 'react'

const nav = [
  { href: '/', label: 'Dòng thời gian' },
  { href: '/atlas', label: 'Bản đồ' },
  { href: '/lanh-dao', label: 'Lãnh đạo' },
]

export function SiteShell({
  children,
  title,
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <div>
          <Link className="brand-mark" href="/">
            Bản đồ cách mạng Việt Nam
          </Link>
          <p className="brand-subtitle">
            Đọc lịch sử cách mạng Việt Nam theo hai trục chính: các giai đoạn hình thành và các thời kỳ
            lãnh đạo của Đảng trên nền bản đồ Việt Nam.
          </p>
        </div>

        <nav aria-label="Chính" className="site-nav">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="site-main">
        {title ? (
          <div className="page-heading">
            <h1>{title}</h1>
          </div>
        ) : null}
        {children}
      </main>

      <footer className="site-footer">
        <p>Mỗi lát cắt lịch sử ở đây đều đặt năm, giai đoạn, lãnh đạo và không gian cách mạng vào cùng một bản đồ đọc chung.</p>
      </footer>
    </div>
  )
}
