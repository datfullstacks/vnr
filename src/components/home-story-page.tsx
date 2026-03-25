import Link from 'next/link'

import type { ExplorerSnapshot } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  listForType,
  resolveActiveLeader,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { RecordGrid } from '@/components/content-blocks'
import { FormationOverview, LeaderContextCard, LeaderTimelineSection } from '@/components/leader-blocks'
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
  const activeLeader = resolveActiveLeader(snapshot, filters, activeYear, activePeriod)
  const { maxYear, minYear } = resolveTimelineBounds(snapshot)
  const visibleRecords = listForType(snapshot, 'all')
  const atlasParams = new URLSearchParams({
    year: String(activeYear),
  })

  if (filters.period) {
    atlasParams.set('period', filters.period)
  }

  if (filters.leader) {
    atlasParams.set('leader', filters.leader)
  }

  const atlasHref = `/atlas?${atlasParams.toString()}`

  return (
    <div className="page-stack">
      <section className="hero-panel story-hero">
        <div className="story-hero-copy">
          <p className="eyebrow">Không gian trình bày</p>
          <h1>Bản đồ cách mạng Việt Nam trên cùng một trục thời gian và không gian</h1>
          <p>
            Màn hình mở đầu này gom hai trục cốt lõi của sản phẩm: tiến trình hình thành Đảng và chuỗi
            thời kỳ lãnh đạo trên nền bản đồ Việt Nam.
          </p>
          <div className="story-focus-card">
            <span className="hero-stat-label">Lát cắt hiện tại</span>
            <strong>{activeYear}</strong>
            <p className="hero-context">
              {activeLeader
                ? `${activeLeader.name}${activePeriod ? ` trong ${activePeriod.title}` : ''}.`
                : activePeriod
                  ? activePeriod.title
                  : 'Chọn một năm để mở bối cảnh tương ứng.'}
            </p>
          </div>

          <div className="hero-actions">
            <Link className="primary-button" href={atlasHref}>
              Mở atlas theo lát cắt này
            </Link>
            <Link className="ghost-button" href="/lanh-dao">
              Xem trục lãnh đạo
            </Link>
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

      <FormationOverview periods={snapshot.periods} />
      <LeaderTimelineSection leaders={snapshot.leaders} periods={snapshot.periods} />

      <section className="content-section story-map-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bản đồ của lát cắt</p>
            <h2>Lát cắt lịch sử đang hiện lên thế nào trên bản đồ?</h2>
            {snapshot.activeBoundaryEpoch ? (
              <p className="section-copy">
                {snapshot.activeBoundaryEpoch.title}. {snapshot.activeBoundaryEpoch.summary}
              </p>
            ) : activePeriod ? (
              <p className="section-copy">
                Bản đồ đang đặt sự kiện, chiến dịch và địa danh vào đúng bối cảnh của{' '}
                {activePeriod.title}.
              </p>
            ) : (
              <p className="section-copy">Chưa có lớp nền lịch sử phù hợp cho năm đang xem.</p>
            )}
          </div>

          <Link className="ghost-button" href={atlasHref}>
            Mở atlas đầy đủ
          </Link>
        </div>

        <AtlasMapShell
          activeYear={activeYear}
          boundaryEpoch={snapshot.activeBoundaryEpoch ?? null}
          campaigns={snapshot.campaigns}
          events={snapshot.events}
          layer="all"
          overlays={snapshot.overlays}
          places={snapshot.places}
        />

        <LeaderContextCard leader={activeLeader} periods={snapshot.periods} title="Lãnh đạo của lát cắt này" />
      </section>

      <RecordGrid
        description="Một vài hồ sơ tiêu biểu của lát cắt đang xem, đủ để dẫn người xem đi tiếp mà không làm trang chủ trở nên quá dày."
        maxItems={3}
        records={visibleRecords}
        title={`Những hồ sơ nổi bật quanh năm ${activeYear}`}
      />
    </div>
  )
}
