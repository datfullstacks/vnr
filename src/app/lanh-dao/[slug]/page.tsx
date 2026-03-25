import { notFound } from 'next/navigation'

import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  HistoricalNarrativeDigest,
  NarrativeFocus,
  PeriodHighlights,
  QuizHighlights,
  RecordGrid,
  SourceList,
} from '@/components/content-blocks'
import { LeaderContextCard, LeaderPortrait, LeaderQuickFacts, RecordsByYear } from '@/components/leader-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getLeader, getPeriod } from '@/lib/content-service'

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

  const leader = data.leader

  const contextPeriod =
    [...data.featuredPeriods, ...data.officialPeriods].find(
      (period) => period.startYear <= leader.endYear && period.endYear >= leader.startYear,
    ) ??
    data.featuredPeriods[0] ??
    data.officialPeriods[0] ??
    null

  let periodContext:
    | Awaited<ReturnType<typeof getPeriod>>
    | null = null

  if (contextPeriod) {
    try {
      periodContext = await getPeriod(contextPeriod.slug)
    } catch {
      periodContext = null
    }
  }

  return (
    <SiteShell>
      <div className="page-stack detail-hero">
        <section className="hero-panel detail-hero-panel">
          <div>
            <p className="eyebrow">Lãnh đạo</p>
            <h1 className="detail-title">{leader.name}</h1>
            <p className="detail-lead">{leader.summary}</p>
          </div>
          <div className="leader-hero-aside">
            <LeaderPortrait leader={leader} variant="hero" />
            <div className="hero-stats">
              <strong>{leader.officeLabel}</strong>
              <span>
                {leader.startYear} - {leader.endYear >= new Date().getFullYear() ? 'nay' : leader.endYear}
              </span>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Hồ sơ lãnh đạo</p>
              <h2>Bối cảnh lịch sử và luận điểm chính</h2>
              <p className="section-copy">
                Phần này đặt chân dung lãnh đạo vào đúng bối cảnh chiến lược, gắn với giai đoạn, mốc năm
                và không gian lịch sử liên quan.
              </p>
            </div>
          </div>
          <div className="detail-copy">{leader.overview}</div>
        </section>

        <LeaderQuickFacts
          campaigns={data.campaigns}
          events={data.events}
          featuredPeriods={data.featuredPeriods}
          leader={leader}
          officialPeriods={data.officialPeriods}
          places={data.places}
        />

        <section className="content-section">
          <LeaderContextCard
            leader={leader}
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
                Atlas ở đây đã được thu hẹp theo thời gian và các hồ sơ liên quan tới lãnh đạo đang xem.
              </p>
            </div>
          </div>

          <AtlasMapShell
            activeYear={data.activeYear ?? leader.endYear}
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
          description="Đây là những sự kiện và chiến dịch gắn trực tiếp với hồ sơ lãnh đạo đang xem."
          events={data.events}
          title="Những hồ sơ lịch sử gắn trực tiếp với chân dung này"
        />

        <RecordsByYear
          campaigns={data.campaigns}
          events={data.events}
          title="Những mốc năm trực tiếp quanh nhiệm kỳ"
        />

        <RecordGrid
          description="Các địa danh dưới đây là những không gian gắn trực tiếp với hồ sơ lãnh đạo đang xem."
          records={data.places}
          title="Địa danh liên hệ trực tiếp với hồ sơ lãnh đạo"
        />

        <QuizHighlights
          description="Các bộ câu hỏi dưới đây bám vào những mốc và hồ sơ liên hệ trực tiếp với lãnh đạo đang xem."
          quizzes={data.quizzes}
          title="Ôn tập nhanh theo hồ sơ lãnh đạo"
        />

        {periodContext?.period ? (
          <>
            <NarrativeFocus period={periodContext.period} year={data.activeYear ?? leader.endYear} />


            <HistoricalNarrativeDigest
              campaigns={periodContext.campaigns}
              description="Khối này mở rộng sang bối cảnh chung của giai đoạn để người xem không bị giới hạn ở các hồ sơ trực tiếp của riêng lãnh đạo."
              events={periodContext.events}
              maxItems={8}
              title={`Bối cảnh rộng hơn của ${periodContext.period.title}`}
            />

            <RecordGrid
              description="Những địa danh tiêu biểu của giai đoạn giúp đọc rộng hơn bối cảnh không gian quanh chân dung lãnh đạo."
              maxItems={6}
              records={periodContext.places}
              title="Địa danh tiêu biểu của giai đoạn"
            />

            <QuizHighlights
              description="Nếu giai đoạn có bộ câu hỏi ôn tập, chúng sẽ xuất hiện ở đây như phần nối từ chân dung cá nhân sang bối cảnh lớn hơn."
              quizzes={periodContext.quizzes}
              title="Ôn tập theo giai đoạn"
            />
          </>
        ) : null}

        <SourceList
          description="Nguồn chính thức và nguồn đối chiếu dùng để xác nhận chức danh, nhiệm kỳ và bối cảnh của chân dung lãnh đạo."
          sources={leader.sources}
          title="Nguồn đối chiếu cho hồ sơ lãnh đạo"
        />
      </div>
    </SiteShell>
  )
}
