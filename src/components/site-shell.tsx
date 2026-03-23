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
            Dòng thời gian và bản đồ lịch sử Đảng Cộng sản Việt Nam, nối sự kiện, địa danh, chiến dịch
            và các gương mặt tiêu biểu qua từng giai đoạn.
          </p>
        </div>

        <nav className="site-nav" aria-label="Chính">
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
        <p>Mỗi mốc năm mở ra một lát cắt lịch sử với không gian cách mạng, chiến trường, căn cứ địa và bước ngoặt của dân tộc.</p>
        <p>Từ dòng thời gian, người đọc có thể đi thẳng sang bản đồ, hồ sơ sự kiện, địa danh, chiến dịch và các giai đoạn lớn của lịch sử Đảng.</p>
      </footer>
    </div>
  )
}
