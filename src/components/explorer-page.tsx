import dynamic from 'next/dynamic'

import type { ExplorerRecord, ExplorerSnapshot, PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

import { NarrativeFocus, PeriodHighlights, RecordGrid } from '@/components/content-blocks'
import { TimelineController } from '@/components/timeline-controller'

const AtlasMap = dynamic(
  () => import('@/components/atlas-map').then((module) => module.AtlasMap),
  {
    loading: () => (
      <div className="map-shell map-shell-loading" aria-busy="true">
        <div className="map-stage">
          <div className="map-loading">
            <div className="map-loading-bar" />
            <p>Đang nạp bản đồ lịch sử...</p>
          </div>
        </div>
        <aside className="map-aside">
          <p className="eyebrow">Chú giải bản đồ</p>
          <div className="map-loading-copy">
            Bản đồ sẽ được tải sau khi phần giao diện chính đã sẵn sàng để trang phản hồi nhanh hơn.
          </div>
        </aside>
      </div>
    ),
    ssr: false,
  },
)

function periodOptions(periods: PeriodRecord[]) {
  return periods.map((period) => (
    <option key={period.id} value={period.slug}>
      {period.title}
    </option>
  ))
}

function listForType(snapshot: ExplorerSnapshot, type: SearchState['type']): ExplorerRecord[] {
  if (type === 'events') return snapshot.events
  if (type === 'campaigns') return snapshot.campaigns
  if (type === 'places') return snapshot.places
  return [...snapshot.events, ...snapshot.campaigns, ...snapshot.places]
}

function resolveActivePeriod(snapshot: ExplorerSnapshot, filters: SearchState, activeYear: number) {
  if (filters.period) {
    return snapshot.periods.find((period) => period.slug === filters.period) ?? null
  }

  return (
    snapshot.periods.find((period) => period.startYear <= activeYear && period.endYear >= activeYear) ??
    null
  )
}

export function ExplorerPage({
  description,
  filters,
  heading,
  snapshot,
}: {
  description: string
  filters: SearchState
  heading: string
  snapshot: ExplorerSnapshot
}) {
  const visibleRecords = listForType(snapshot, filters.type)
  const activeYear = snapshot.activeYear ?? filters.year ?? snapshot.periods.at(-1)?.endYear ?? 1975
  const timelineMinYear = Math.min(
    ...snapshot.periods.map((period) => period.startYear),
    ...snapshot.boundaryEpochs.map((epoch) => epoch.validFromYear),
  )
  const timelineMaxYear = Math.max(
    ...snapshot.periods.map((period) => period.endYear),
    ...snapshot.boundaryEpochs.map((epoch) => epoch.validToYear),
  )
  const activePeriod = resolveActivePeriod(snapshot, filters, activeYear)
  const from = filters.from ?? ''
  const to = filters.to ?? ''
  const year = filters.year ?? activeYear

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dòng thời gian lịch sử Đảng</p>
          <h1>{heading}</h1>
          <p>{description}</p>
          {activePeriod ? (
            <p className="hero-context">
              Năm {activeYear} đang mở ra <strong>{activePeriod.title}</strong>. {activePeriod.summary}
            </p>
          ) : null}
        </div>
        <div className="hero-stats">
          <strong>{visibleRecords.length}</strong>
          <span>bản ghi đang nổi lên trên lát cắt thời gian hiện tại</span>
          <small>
            {activePeriod
              ? `${activePeriod.startYear} - ${activePeriod.endYear} · ${activePeriod.keyThemes.slice(0, 2).join(' · ')}`
              : `Năm bản đồ: ${activeYear}`}
          </small>
        </div>
      </section>

      <form className="filters-card" method="get">
        <label>
          <span>Tìm kiếm</span>
          <input defaultValue={filters.q} name="q" placeholder="Sự kiện, chiến dịch, địa danh..." />
        </label>
        <label>
          <span>Giai đoạn</span>
          <select defaultValue={filters.period ?? ''} name="period">
            <option value="">Tất cả giai đoạn</option>
            {periodOptions(snapshot.periods)}
          </select>
        </label>
        <label>
          <span>Vùng</span>
          <select defaultValue={filters.region ?? ''} name="region">
            <option value="">Tất cả vùng</option>
            <option value="north">Miền Bắc</option>
            <option value="central">Miền Trung</option>
            <option value="south">Miền Nam</option>
            <option value="interregional">Liên vùng</option>
            <option value="international">Quốc tế</option>
          </select>
        </label>
        <label>
          <span>Loại bản ghi</span>
          <select defaultValue={filters.type} name="type">
            <option value="all">Tất cả</option>
            <option value="events">Sự kiện</option>
            <option value="campaigns">Chiến dịch</option>
            <option value="places">Địa danh</option>
          </select>
        </label>
        <label>
          <span>Lớp hiển thị</span>
          <select defaultValue={filters.layer} name="layer">
            <option value="all">Tất cả lớp</option>
            <option value="boundaries">Chỉ nền theo năm</option>
            <option value="historical">Chỉ lớp diễn biến lịch sử</option>
            <option value="records">Chỉ sự kiện, chiến dịch, địa danh</option>
          </select>
        </label>
        <input name="from" type="hidden" value={from} />
        <input name="to" type="hidden" value={to} />
        <input name="year" type="hidden" value={year} />
        <button className="primary-button" type="submit">
          Áp dụng bộ lọc
        </button>
      </form>

      <TimelineController
        filters={filters}
        maxYear={timelineMaxYear}
        minYear={timelineMinYear}
        periods={snapshot.periods}
      />

      <NarrativeFocus period={activePeriod} year={activeYear} />

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bản đồ</p>
            <h2>Không gian lịch sử trên bản đồ tại năm {activeYear}</h2>
            {snapshot.activeBoundaryEpoch ? (
              <p className="section-copy">
                {snapshot.activeBoundaryEpoch.title}. {snapshot.activeBoundaryEpoch.summary}
              </p>
            ) : activePeriod ? (
              <p className="section-copy">
                Bản đồ đang đặt sự kiện, chiến dịch và địa danh vào bối cảnh của {activePeriod.title}.
              </p>
            ) : (
              <p className="section-copy">Chưa có mốc nền lịch sử phù hợp cho năm đang chọn.</p>
            )}
          </div>
        </div>
        <AtlasMap
          activeYear={activeYear}
          boundaryEpoch={snapshot.activeBoundaryEpoch ?? null}
          campaigns={snapshot.campaigns}
          events={snapshot.events}
          layer={filters.layer}
          overlays={snapshot.overlays}
          places={snapshot.places}
        />
      </section>

      <RecordGrid
        description="Mỗi thẻ là một điểm vào để lần theo sự kiện, chiến dịch và địa danh gắn với lát cắt thời gian đang xem."
        records={visibleRecords.slice(0, 12)}
        title={`Những bản ghi đang hiện ra ở mốc năm ${activeYear}`}
      />
      <PeriodHighlights
        description="Các giai đoạn dưới đây là xương sống của atlas: mỗi chặng nối một bối cảnh lịch sử, một không gian cách mạng và những gương mặt tiêu biểu."
        periods={snapshot.periods}
      />
    </div>
  )
}
