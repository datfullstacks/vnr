import { notFound } from 'next/navigation'

import { NarrativeFocus, PeriodHighlights, RecordGrid } from '@/components/content-blocks'
import { SiteShell } from '@/components/site-shell'
import { getPeriod } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function PeriodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPeriod(slug)

  if (!data.period) {
    notFound()
  }

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
            <span>{data.period.keyThemes.join(' · ')}</span>
          </div>
        </section>

        <NarrativeFocus period={data.period} year={data.period.startYear} />
        <RecordGrid
          description="Các sự kiện dưới đây cho thấy nhịp chuyển chính trị, quân sự và xã hội của toàn giai đoạn."
          records={data.events}
          title="Những sự kiện tiêu biểu trong giai đoạn"
        />
        <RecordGrid
          description="Những chiến dịch và phong trào này thể hiện cách đường lối cách mạng đi vào thực tiễn và làm thay đổi cục diện."
          records={data.campaigns}
          title="Chiến dịch, phong trào và các đợt cao điểm"
        />
        <RecordGrid
          description="Mỗi địa danh là một điểm tựa để đọc lại căn cứ địa, chiến trường, nơi ra quyết định hay không gian ký ức của giai đoạn."
          records={data.places}
          title="Địa danh, căn cứ và không gian lịch sử"
        />
        <PeriodHighlights
          description="Trang này đặt giai đoạn đang xem vào toàn bộ dòng chảy lớn hơn của lịch sử Đảng và cách mạng Việt Nam."
          periods={[data.period]}
        />
      </div>
    </SiteShell>
  )
}
