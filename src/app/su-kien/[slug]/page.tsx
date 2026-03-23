import { notFound } from 'next/navigation'

import { DetailMeta, RelatedLinks, SourceList } from '@/components/content-blocks'
import { SiteShell } from '@/components/site-shell'
import { getEvent } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  return (
    <SiteShell>
      <div className="page-stack detail-hero">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Sự kiện</p>
            <h1 className="detail-title">{event.title}</h1>
            <p className="detail-lead">{event.summary}</p>
            <DetailMeta
              period={event.period}
              region={event.region}
              timeLabel={new Date(event.startDate).toLocaleDateString('vi-VN')}
            />
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Diễn giải</p>
              <h2>Vì sao sự kiện này là một mốc quan trọng?</h2>
              <p className="section-copy">
                Hồ sơ dưới đây đặt sự kiện vào đúng bối cảnh giai đoạn, không gian lịch sử và tác động
                của nó đối với tiến trình cách mạng.
              </p>
            </div>
          </div>
          <div className="detail-copy">{event.content}</div>
        </section>

        <RelatedLinks
          description="Những địa danh và hồ sơ liên quan giúp mở rộng bối cảnh của sự kiện theo không gian và thời gian."
          places={event.places}
          title="Mở rộng từ sự kiện này"
        />
        <SourceList
          description="Các nguồn dưới đây là lớp đối chiếu cần thiết để theo dõi cách sự kiện được ghi nhận trong tư liệu và nghiên cứu."
          sources={event.sources}
        />
      </div>
    </SiteShell>
  )
}
