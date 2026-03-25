import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { LeaderTimelineSection } from '@/components/leader-blocks'
import { getExplorerSnapshot } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function LeadersPage() {
  let snapshot: Awaited<ReturnType<typeof getExplorerSnapshot>>

  try {
    snapshot = await getExplorerSnapshot()
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang lãnh đạo cần snapshot công khai để dựng đầy đủ chuỗi Tổng Bí thư và các giai đoạn tương ứng."
          error={error}
          title="Không thể tải hồ sơ lãnh đạo"
        />
      </SiteShell>
    )
  }

  const leaders = snapshot.leaders

  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Lãnh đạo</p>
            <h1>Các thời kỳ lãnh đạo của Đảng từ 1930 đến nay</h1>
            <p>
              Trang này gom toàn bộ các đồng chí giữ vai trò lãnh đạo trung tâm của Đảng trên một trục
              thời gian liền mạch, phù hợp để trình bày nhanh trong buổi demo.
            </p>
          </div>
          <div className="hero-stats">
            <span className="hero-stat-label">Tổng số chân dung</span>
            <strong>{leaders.length}</strong>
            <span>Toàn bộ chân dung công khai đang có trên site ở thời điểm dữ liệu hiện tại.</span>
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
