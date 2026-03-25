import { notFound } from 'next/navigation'

import { AtlasMapShell } from '@/components/atlas-map-shell'
import { HistoricalNarrativeDigest, PeriodHighlights, RecordGrid, SourceList } from '@/components/content-blocks'
import { LeaderContextCard, LeaderPortrait, LeaderQuickFacts, RecordsByYear } from '@/components/leader-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getLeader } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function LeaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let data: Awaited<ReturnType<typeof getLeader>>

  try {
    data = await getLeader(slug)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang hồ sơ lãnh đạo cần dữ liệu chi tiết từ vnr-be để dựng chân dung, giai đoạn và lát cắt atlas."
          error={error}
          title="Không thể tải hồ sơ lãnh đạo này"
        />
      </SiteShell>
    )
  }

  if (!data.leader) {
    notFound()
  }

  return (
    <SiteShell>
      <div className="page-stack detail-hero">
        <section className="hero-panel detail-hero-panel">
          <div>
            <p className="eyebrow">Lãnh đạo</p>
            <h1 className="detail-title">{data.leader.name}</h1>
            <p className="detail-lead">{data.leader.summary}</p>
          </div>
          <div className="leader-hero-aside">
            <LeaderPortrait leader={data.leader} variant="hero" />
            <div className="hero-stats">
              <strong>{data.leader.officeLabel}</strong>
              <span>
                {data.leader.startYear} - {data.leader.endYear >= new Date().getFullYear() ? 'nay' : data.leader.endYear}
              </span>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Hồ sơ lãnh đạo</p>
              <h2>Bối cảnh lịch sử và luận điểm chủ đạo</h2>
              <p className="section-copy">
                Phần này đặt chân dung lãnh đạo vào đúng bối cảnh chiến lược, thay vì tách khỏi các giai
                đoạn, mốc năm và không gian cách mạng.
              </p>
            </div>
          </div>
          <div className="detail-copy">{data.leader.overview}</div>
        </section>

        <LeaderQuickFacts
          campaigns={data.campaigns}
          events={data.events}
          featuredPeriods={data.featuredPeriods}
          leader={data.leader}
          officialPeriods={data.officialPeriods}
          places={data.places}
        />

        <section className="content-section">
          <LeaderContextCard
            leader={data.leader}
            periods={[...data.featuredPeriods, ...data.officialPeriods]}
            title="Lãnh đạo đang xem"
          />
        </section>

        {data.featuredPeriods.length > 0 ? (
          <PeriodHighlights
            description="Đây là những giai đoạn mà lãnh đạo này được nhấn nổi bật trên giao diện của site."
            periods={data.featuredPeriods}
            title="Những giai đoạn được nhấn nổi bật"
          />
        ) : null}

        {data.officialPeriods.length > 0 ? (
          <PeriodHighlights
            description="Khối này chỉ giữ các giai đoạn mà lãnh đạo đang xem có cương vị chính thức trong metadata lịch sử."
            periods={data.officialPeriods}
            title="Những giai đoạn gắn với cương vị chính thức"
          />
        ) : null}

        <section className="content-section story-map-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lát cắt bản đồ</p>
              <h2>Bản đồ và hồ sơ liên quan trong thời kỳ này</h2>
              <p className="section-copy">
                Atlas ở đây đã được thu hẹp theo thời gian và các hồ sơ lịch sử liên quan tới lãnh đạo đang xem.
              </p>
            </div>
          </div>

          <AtlasMapShell
            activeYear={data.activeYear ?? data.leader.endYear}
            boundaryEpoch={data.activeBoundaryEpoch ?? null}
            campaigns={data.campaigns}
            events={data.events}
            layer="all"
            overlays={data.overlays}
            places={data.places}
          />
        </section>

        <HistoricalNarrativeDigest
          campaigns={data.campaigns}
          description="Thay vì chỉ nhìn tên năm, khối này gom các sự kiện và chiến dịch then chốt để người đọc thấy được chuyển động lịch sử cụ thể trong nhiệm kỳ đang xem."
          events={data.events}
          title="Những bước ngoặt lịch sử gắn với giai đoạn này"
        />

        <RecordsByYear campaigns={data.campaigns} events={data.events} title="Những mốc năm nổi bật trong nhiệm kỳ" />

        <RecordGrid
          description="Các địa danh dưới đây là những không gian cần đối chiếu khi đọc lại giai đoạn gắn với lãnh đạo này."
          records={data.places}
          title="Địa danh và không gian lịch sử liên quan"
        />

        <SourceList
          description="Nguồn chính thức và nguồn đối chiếu dùng để xác nhận chức danh, nhiệm kỳ và bối cảnh của chân dung lãnh đạo."
          sources={data.leader.sources}
          title="Nguồn đối chiếu cho hồ sơ lãnh đạo"
        />
      </div>
    </SiteShell>
  )
}
