import { notFound } from 'next/navigation'

import { DetailMediaGallery, DetailMeta, SourceList } from '@/components/content-blocks'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getPlace } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let place: Awaited<ReturnType<typeof getPlace>>

  try {
    place = await getPlace(slug)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang địa danh cần hồ sơ từ vnr-be để dựng không gian lịch sử và nguồn đối chiếu."
          error={error}
          title="Không thể tải địa danh này"
        />
      </SiteShell>
    )
  }

  if (!place) {
    notFound()
  }

  return (
    <SiteShell>
      <div className="page-stack detail-hero">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Địa danh</p>
            <h1 className="detail-title">{place.title}</h1>
            <p className="detail-lead">{place.summary}</p>
            <DetailMeta period={place.period} region={place.region} />
          </div>
          <div className="hero-stats">
            <strong>{place.modernLocation?.province ?? 'Chưa rõ tỉnh'}</strong>
            <span>{place.modernLocation?.label ?? 'Địa danh lịch sử'}</span>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Địa danh</p>
              <h2>Không gian lịch sử của địa danh này</h2>
              <p className="section-copy">
                Hồ sơ địa danh không chỉ xác định vị trí, mà còn lý giải vì sao nơi này trở thành căn cứ,
                chiến trường, biểu tượng hay một nút thắt trong tiến trình cách mạng.
              </p>
            </div>
          </div>
          <div className="detail-copy">{place.body}</div>
        </section>

        <DetailMediaGallery
          description="Nếu địa danh đã có ảnh minh họa hoặc tư liệu trong dữ liệu công khai, chúng sẽ xuất hiện tại đây để hỗ trợ phần trình bày không gian lịch sử."
          record={place}
          title="Hình ảnh của địa danh"
        />

        <SourceList
          description="Những nguồn dưới đây giúp đối chiếu ký ức địa danh với tư liệu lịch sử và nghiên cứu chuyên khảo."
          sources={place.sources}
        />
      </div>
    </SiteShell>
  )
}
