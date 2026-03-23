import Link from 'next/link'
import type { ReactNode } from 'react'

const nav = [
  { href: '/', label: 'Dòng thời gian' },
  { href: '/atlas', label: 'Bản đồ' },
  { href: '/admin', label: 'Quản trị' },
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
            VNR Atlas
          </Link>
          <p className="brand-subtitle">
            Atlas lịch sử Đảng, ưu tiên tra cứu theo mốc năm và không gian cách mạng.
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
        <p>Mỗi mốc năm mở ra một lát cắt lịch sử để đối chiếu bản đồ, sự kiện, chiến dịch và địa danh.</p>
      </footer>
    </div>
  )
}
