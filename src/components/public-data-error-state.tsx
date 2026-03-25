import Link from 'next/link'

import { describePublicDataError, resolveBackendUrl } from '@/lib/content-service'

export function PublicDataErrorState({
  context,
  error,
  title = 'Không thể tải dữ liệu công khai',
}: {
  context: string
  error: unknown
  title?: string
}) {
  return (
    <section className="content-section public-data-error">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Lỗi dữ liệu</p>
          <h2>{title}</h2>
          <p className="section-copy">{context}</p>
        </div>
      </div>

      <div className="public-data-error-grid">
        <div className="public-data-error-card">
          <strong>Backend mong đợi</strong>
          <code>{resolveBackendUrl()}</code>
          <p>
            Hãy kiểm tra `vnr-be` đang chạy và frontend `vnr` đang dùng đúng biến `VNR_BE_URL` hoặc
            `CONTENT_API_BASE_URL`.
          </p>
        </div>

        <div className="public-data-error-card">
          <strong>Thông điệp nhận được</strong>
          <pre>{describePublicDataError(error)}</pre>
        </div>
      </div>

      <div className="hero-actions">
        <Link className="primary-button" href="/">
          Về dòng thời gian
        </Link>
        <Link className="ghost-button" href="/atlas">
          Mở atlas
        </Link>
      </div>
    </section>
  )
}
