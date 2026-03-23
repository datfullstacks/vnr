'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const message = error.message || 'Da xay ra loi khong xac dinh.'
  const backendIssue =
    message.includes('vnr-be') || message.includes('Backend request failed') || message.includes('fetch')

  return (
    <html lang="vi">
      <body>
        <main
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            margin: '4rem auto',
            maxWidth: '48rem',
            padding: '0 1rem',
          }}
        >
          <p style={{ letterSpacing: '0.08em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Loi he thong
          </p>
          <h1 style={{ marginBottom: '1rem' }}>
            {backendIssue ? 'Frontend dang khong ket noi duoc backend' : 'Khong the tai trang nay'}
          </h1>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            {backendIssue
              ? 'Hay dam bao vnr-be dang chay tren cong mong doi va bien moi truong VNR_BE_URL dang dung.'
              : 'Trang cong khai gap loi trong luc tai du lieu hoac ket xuat giao dien.'}
          </p>
          <pre
            style={{
              background: '#f5efe5',
              borderRadius: '0.75rem',
              overflowX: 'auto',
              padding: '1rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </pre>
          <button
            onClick={reset}
            style={{
              background: '#8f2d1d',
              border: 0,
              borderRadius: '999px',
              color: '#fff7ee',
              cursor: 'pointer',
              marginTop: '1rem',
              padding: '0.75rem 1.2rem',
            }}
            type="button"
          >
            Thu tai lai
          </button>
        </main>
      </body>
    </html>
  )
}
