import { SiteShell } from '@/components/site-shell'
import { LeaderTimelineSection } from '@/components/leader-blocks'
import { getExplorerSnapshot } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function LeadersPage() {
  const snapshot = await getExplorerSnapshot()
  const leaders = snapshot.leaders

  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Lãnh đạo</p>
            <h1>Các thời kỳ lãnh đạo của Đảng từ 1930 đến nay</h1>
            <p>
              Trang này gom toàn bộ các đồng chí Tổng Bí thư theo trục thời gian, đồng thời nhấn riêng Hồ
              Chí Minh với chức danh Chủ tịch Đảng để giữ đúng cấu trúc lịch sử của site.
            </p>
          </div>
          <div className="hero-stats">
            <span className="hero-stat-label">Tổng số chân dung</span>
            <strong>{leaders.length}</strong>
            <span>Đầy đủ trục công khai của site ở thời điểm dữ liệu hiện tại.</span>
          </div>
        </section>

        <LeaderTimelineSection
          description="Mỗi card dẫn sang hồ sơ riêng và một lát cắt atlas tương ứng để nối chân dung lãnh đạo với giai đoạn, năm và không gian lịch sử."
          leaders={leaders}
          periods={snapshot.periods}
          title="Hồ sơ lãnh đạo công khai"
        />
      </div>
    </SiteShell>
  )
}
