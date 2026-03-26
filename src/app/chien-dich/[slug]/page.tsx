import { notFound } from 'next/navigation'

import { DetailMediaGallery, DetailMeta, RelatedLinks, SourceList } from '@/components/content-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getCampaign } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let campaign: Awaited<ReturnType<typeof getCampaign>>

  try {
    campaign = await getCampaign(slug)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang chiến dịch cần hồ sơ từ vnr-be để dựng diễn biến, kết quả và các liên hệ không gian lịch sử."
          error={error}
          title="Không thể tải chiến dịch này"
        />
      </SiteShell>
    )
  }

  if (!campaign) {
    notFound()
  }

  return (
    <SiteShell>
      <div className="page-stack detail-hero">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Chiến dịch</p>
            <h1 className="detail-title">{campaign.title}</h1>
            <p className="detail-lead">{campaign.summary}</p>
            <DetailMeta
              period={campaign.period}
              region={campaign.region}
              timeLabel={`${new Date(campaign.startDate).getUTCFullYear()}${campaign.endDate ? ` - ${new Date(campaign.endDate).getUTCFullYear()}` : ''}`}
            />
          </div>
          <div className="hero-stats">
            <strong>Kết quả</strong>
            <span>{campaign.outcome}</span>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Chiến dịch</p>
              <h2>Diễn biến và ý nghĩa của chiến dịch</h2>
              <p className="section-copy">
                Phần này tập trung vào mục tiêu, cách đánh, địa bàn hoạt động và kết quả chiến lược của
                chiến dịch trong toàn bộ cục diện lịch sử.
              </p>
            </div>
          </div>
          <div className="detail-copy">{campaign.body}</div>
        </section>

        <DetailMediaGallery
          description="Nếu hồ sơ chiến dịch đã có ảnh tư liệu trong dữ liệu công khai, chúng sẽ được hiển thị tại đây để tăng lớp trực quan cho phần trình bày."
          record={campaign}
          title="Ảnh tư liệu của chiến dịch"
        />

        <RelatedLinks
          campaigns={[]}
          description="Những sự kiện và địa danh dưới đây là các điểm nối để đọc chiến dịch trong mạng lưới lịch sử rộng hơn."
          events={campaign.relatedEvents}
          places={campaign.relatedPlaces}
          title="Các hồ sơ nối với chiến dịch"
        />
        <SourceList
          description="Nguồn tư liệu được dùng để đối chiếu diễn biến, quy mô và kết quả của chiến dịch."
          sources={campaign.sources}
        />
      </div>
    </SiteShell>
  )
}
