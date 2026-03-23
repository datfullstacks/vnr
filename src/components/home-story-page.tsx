import Link from 'next/link'

import type { ExplorerSnapshot } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  buildTimeSliceHref,
  listForType,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { NarrativeFocus, RecordGrid } from '@/components/content-blocks'
import { TimelineController } from '@/components/timeline-controller'

export function HomeStoryPage({
  filters,
  snapshot,
}: {
  filters: SearchState
  snapshot: ExplorerSnapshot
}) {
  const activeYear = resolveActiveYear(snapshot, filters)
  const activePeriod = resolveActivePeriod(snapshot, filters, activeYear)
  const { maxYear, minYear } = resolveTimelineBounds(snapshot)
  const visibleRecords = listForType(snapshot, 'all')
  const activeThemes = activePeriod?.keyThemes.slice(0, 3) ?? []
  const atlasHref = buildTimeSliceHref('/atlas', activeYear, filters.period)

  return (
    <div className="page-stack">
      <section className="hero-panel story-hero">
        <div className="story-hero-copy">
          <p className="eyebrow">Dòng thời gian lịch sử Đảng</p>
          <h1>Theo dòng lịch sử Đảng trên bản đồ Việt Nam</h1>
          <p>Chọn một mốc năm để đọc bối cảnh lịch sử, rồi đi tiếp sang bản đồ và các hồ sơ tiêu biểu.</p>
          <p className="hero-context">
            Năm <strong>{activeYear}</strong>
            {activePeriod ? (
              <>
                {' '}
                đang mở ra <strong>{activePeriod.title}</strong>.
              </>
            ) : (
              '.'
            )}
          </p>

          <div className="hero-actions">
            <Link className="primary-button" href={atlasHref}>
              Khám phá trên atlas
            </Link>
            {activePeriod ? (
              <Link className="ghost-button" href={`/giai-doan/${activePeriod.slug}`}>
                Đọc giai đoạn này
              </Link>
            ) : null}
          </div>
        </div>

        <TimelineController
          filters={filters}
          maxYear={maxYear}
          minYear={minYear}
          periods={snapshot.periods}
          variant="compact"
        />
      </section>

      <NarrativeFocus period={activePeriod} year={activeYear} />

      <section className="content-section story-map-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bản đồ của lát cắt</p>
            <h2>Điều gì đáng nhìn trên bản đồ ở năm {activeYear}?</h2>
            {snapshot.activeBoundaryEpoch ? (
              <p className="section-copy">
                {snapshot.activeBoundaryEpoch.title}. {snapshot.activeBoundaryEpoch.summary}
              </p>
            ) : activePeriod ? (
              <p className="section-copy">
                Bản đồ đang đặt sự kiện, chiến dịch và địa danh vào đúng bối cảnh của {activePeriod.title}.
              </p>
            ) : (
              <p className="section-copy">Chưa có lớp nền lịch sử phù hợp cho năm đang xem.</p>
            )}
          </div>

          <Link className="ghost-button" href={atlasHref}>
            Mở atlas đầy đủ
          </Link>
        </div>

        {activePeriod ? (
          <div className="map-focus-strip">
            <strong>{activePeriod.title}</strong>
            <span>
              {activeThemes.length > 0
                ? activeThemes.join(' · ')
                : 'Chọn một điểm trên bản đồ để mở ngữ cảnh lịch sử tương ứng.'}
            </span>
          </div>
        ) : null}

        <AtlasMapShell
          activeYear={activeYear}
          boundaryEpoch={snapshot.activeBoundaryEpoch ?? null}
          campaigns={snapshot.campaigns}
          events={snapshot.events}
          layer="all"
          overlays={snapshot.overlays}
          places={snapshot.places}
        />
      </section>

      <RecordGrid
        description="Một vài điểm vào tiêu biểu để đi tiếp từ lát cắt đang xem, thay vì dàn trải toàn bộ tư liệu ngay trên trang chủ."
        records={visibleRecords.slice(0, 4)}
        title={`Những bản ghi nổi bật ở năm ${activeYear}`}
      />
    </div>
  )
}
