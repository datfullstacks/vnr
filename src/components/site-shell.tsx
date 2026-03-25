import Link from 'next/link'
import type { ReactNode } from 'react'

const nav = [
  { href: '/', label: 'Dòng thời gian' },
  { href: '/atlas', label: 'Atlas bản đồ' },
  { href: '/lanh-dao', label: 'Trục lãnh đạo' },
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
        <div className="site-header-copy">
          <p className="site-kicker">Sản phẩm trình bày lịch sử</p>
          <Link className="brand-mark" href="/">
            Bản đồ cách mạng Việt Nam
          </Link>
          <p className="brand-subtitle">
            Atlas trình bày tiến trình cách mạng Việt Nam trên cùng một trục thời gian, lãnh đạo và không
            gian lịch sử.
          </p>
        </div>

        <div className="site-header-meta">
          <nav aria-label="Chính" className="site-nav">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="site-header-note">Trục đọc chính: giai đoạn, lãnh đạo, sự kiện, chiến dịch và địa danh.</p>
        </div>
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
        <p>Mỗi lát cắt trên site đều gắn năm, giai đoạn, lãnh đạo và không gian lịch sử vào cùng một bản đồ đọc chung.</p>
      </footer>
    </div>
  )
}
