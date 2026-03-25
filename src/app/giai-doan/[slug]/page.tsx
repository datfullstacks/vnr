import { notFound } from 'next/navigation'

import { HistoricalNarrativeDigest, NarrativeFocus, PeriodHighlights, RecordGrid } from '@/components/content-blocks'
import { PeriodLeaderSummary, RecordsByYear } from '@/components/leader-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getPeriod } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function PeriodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let data: Awaited<ReturnType<typeof getPeriod>>

  try {
    data = await getPeriod(slug)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang giai đoạn cần dữ liệu chi tiết từ vnr-be để dựng bối cảnh, lãnh đạo và các bước ngoặt lịch sử."
          error={error}
          title="Không thể tải hồ sơ giai đoạn này"
        />
      </SiteShell>
    )
  }

  if (!data.period) {
    notFound()
  }

  const orderedPeriods = [...data.periods].sort((left, right) => left.displayOrder - right.displayOrder)
  const currentIndex = orderedPeriods.findIndex((period) => period.slug === data.period?.slug)
  const surroundingPeriods = orderedPeriods.slice(Math.max(0, currentIndex - 1), currentIndex + 2)

  return (
    <SiteShell>
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Giai đoạn</p>
            <h1>{data.period.title}</h1>
            <p>{data.period.overview}</p>
          </div>
          <div className="hero-stats">
            <strong>
              {data.period.startYear} - {data.period.endYear}
            </strong>
            <span>{data.period.leadershipLabel ?? data.period.keyThemes.join(' · ')}</span>
          </div>
        </section>

        <NarrativeFocus period={data.period} year={data.period.startYear} />
        <PeriodLeaderSummary leaders={data.leaders} period={data.period} />
        <HistoricalNarrativeDigest
          campaigns={data.campaigns}
          description="Khối này giữ lại các sự kiện và chiến dịch tạo nên nhịp điệu thực sự của giai đoạn, để người đọc không chỉ thấy tên period mà còn thấy các bước ngoặt cụ thể."
          events={data.events}
          title="Những bước ngoặt lịch sử của giai đoạn"
        />
        <RecordsByYear campaigns={data.campaigns} events={data.events} />
        <RecordGrid
          description="Mỗi địa danh là một điểm tựa để đọc lại căn cứ địa, chiến trường, nơi ra quyết định hay không gian ký ức của giai đoạn."
          records={data.places}
          title="Địa danh, căn cứ và không gian lịch sử"
        />
        <PeriodHighlights
          description="Giai đoạn này được đặt vào chuỗi lớn hơn để người đọc không mất mạch trước và sau nó."
          periods={surroundingPeriods}
        />
      </div>
    </SiteShell>
  )
}
