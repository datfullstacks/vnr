import Link from 'next/link'

import type { ExplorerSnapshot, RecordRegion } from '@/lib/content-types'
import type { LayerType, SearchState } from '@/lib/search-state'

import { AtlasControlsDrawer } from '@/components/atlas-controls-drawer'
import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  buildTimeSliceHref,
  listForType,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { RecordGrid } from '@/components/content-blocks'
import { TimelineController } from '@/components/timeline-controller'

function buildAtlasResetHref(year: number, periodSlug?: string) {
  return buildTimeSliceHref('/atlas', year, periodSlug)
}

function typeLabel(type: SearchState['type']) {
  switch (type) {
    case 'events':
      return 'Sự kiện'
    case 'campaigns':
      return 'Chiến dịch'
    case 'places':
      return 'Địa danh'
    default:
      return 'Tất cả bản ghi'
  }
}

function regionLabel(region?: RecordRegion) {
  switch (region) {
    case 'north':
      return 'Miền Bắc'
    case 'central':
      return 'Miền Trung'
    case 'south':
      return 'Miền Nam'
    case 'interregional':
      return 'Liên vùng'
    case 'international':
      return 'Quốc tế'
    default:
      return ''
  }
}

function layerLabel(layer: LayerType) {
  switch (layer) {
    case 'boundaries':
      return 'Chỉ nền theo năm'
    case 'historical':
      return 'Chỉ lớp lịch sử'
    case 'records':
      return 'Chỉ bản ghi điểm'
    default:
      return 'Tất cả lớp'
  }
}

function deepFilterCount(filters: SearchState) {
  let count = 0

  if (filters.type !== 'all') count += 1
  if (filters.region) count += 1
  if (filters.layer !== 'all') count += 1
  if (filters.q) count += 1

  return count
}

export function AtlasExplorerPage({
  filters,
  snapshot,
}: {
  filters: SearchState
  snapshot: ExplorerSnapshot
}) {
  const activeYear = resolveActiveYear(snapshot, filters)
  const activePeriod = resolveActivePeriod(snapshot, filters, activeYear)
  const visibleRecords = listForType(snapshot, filters.type)
  const { maxYear, minYear } = resolveTimelineBounds(snapshot)
  const activeThemes = activePeriod?.keyThemes.slice(0, 3) ?? []
  const appliedFilters = deepFilterCount(filters)
  const drawerKey = [
    activeYear,
    filters.period ?? '',
    filters.q ?? '',
    filters.type,
    filters.region ?? '',
    filters.layer,
  ].join(':')
  const from = filters.from ?? ''
  const homeHref = buildTimeSliceHref('/', activeYear, filters.period)
  const resetHref = buildAtlasResetHref(activeYear, filters.period)
  const toggleSummary = activePeriod
    ? `${activePeriod.title} · ${appliedFilters > 0 ? `${appliedFilters} lọc sâu` : 'chưa bật lọc sâu'}`
    : `Năm ${activeYear} · ${appliedFilters > 0 ? `${appliedFilters} lọc sâu` : 'chưa bật lọc sâu'}`
  const to = filters.to ?? ''
  const year = filters.year ?? activeYear

  return (
    <div className="page-stack atlas-page-stack">
      <section className="hero-panel atlas-hero">
        <div className="atlas-hero-copy">
          <p className="eyebrow">Atlas nhiều lớp</p>
          <h1>Bản đồ lịch sử nhiều lớp</h1>
          <p>Không gian thao tác sâu để chọn năm, khóa giai đoạn và đối chiếu trực tiếp các lớp hiển thị.</p>
          {activePeriod ? (
            <p className="hero-context">
              Năm <strong>{activeYear}</strong> đang nằm trong <strong>{activePeriod.title}</strong>.
            </p>
          ) : null}
        </div>

        <div className="hero-stats">
          <span className="hero-stat-label">Đang hiển thị</span>
          <strong>{activeYear}</strong>
          <span>{visibleRecords.length} bản ghi theo bộ lọc hiện tại</span>
          <small>{activeThemes.length > 0 ? activeThemes.join(' · ') : 'Ưu tiên bản đồ và điều khiển thao tác sâu.'}</small>
        </div>
      </section>

      <section className="content-section atlas-workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Điều khiển atlas</p>
            <h2>Điều khiển thời gian, lớp hiển thị và bộ lọc trong cùng một workspace</h2>
            <p className="section-copy">
              Chỉnh lát cắt thời gian trước, rồi tinh tiếp bằng loại bản ghi, vùng và lớp hiển thị ngay cạnh bản
              đồ.
            </p>
          </div>

          <Link className="ghost-button" href={homeHref}>
            Xem lát cắt kể chuyện
          </Link>
        </div>

        <AtlasControlsDrawer key={drawerKey} summary={toggleSummary} title={`Năm ${activeYear}`}>
          <div className="atlas-control-deck">
            <TimelineController
              filters={filters}
              maxYear={maxYear}
              minYear={minYear}
              periods={snapshot.periods}
              variant="full"
            />

            <form className="filters-card atlas-filters-card" method="get">
              <label className="filters-card-search">
                <span>Tìm kiếm</span>
                <input defaultValue={filters.q} name="q" placeholder="Sự kiện, chiến dịch, địa danh..." />
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
                <span>Lớp hiển thị</span>
                <select defaultValue={filters.layer} name="layer">
                  <option value="all">Tất cả lớp</option>
                  <option value="boundaries">Chỉ nền theo năm</option>
                  <option value="historical">Chỉ lớp lịch sử</option>
                  <option value="records">Chỉ bản ghi điểm</option>
                </select>
              </label>

              <div className="filters-summary">
                <p className="eyebrow">Ngữ cảnh hiện tại</p>
                <strong>
                  Năm {activeYear}
                  {activePeriod ? ` · ${activePeriod.title}` : ''}
                </strong>
                <p>
                  {activeThemes.length > 0
                    ? activeThemes.join(' · ')
                    : 'Giữ mốc năm hiện tại, rồi tinh tiếp bằng bộ lọc sâu bên cạnh.'}
                </p>
                <div className="detail-meta">
                  <span>{typeLabel(filters.type)}</span>
                  {filters.region ? <span>{regionLabel(filters.region)}</span> : null}
                  <span>{layerLabel(filters.layer)}</span>
                </div>
              </div>

              <div className="filters-actions">
                <Link className="ghost-button" href={resetHref}>
                  Xóa lọc sâu
                </Link>
                <button className="primary-button" type="submit">
                  Cập nhật atlas
                </button>
              </div>

              <input name="from" type="hidden" value={from} />
              {filters.period ? <input name="period" type="hidden" value={filters.period} /> : null}
              <input name="to" type="hidden" value={to} />
              <input name="year" type="hidden" value={year} />
            </form>
          </div>
        </AtlasControlsDrawer>

        <div className="atlas-map-intro">
          <div>
            <p className="eyebrow">Không gian lịch sử</p>
            <h2>Bản đồ đang hiển thị gì ở năm {activeYear}?</h2>
            {snapshot.activeBoundaryEpoch ? (
              <p className="section-copy">
                {snapshot.activeBoundaryEpoch.title}. {snapshot.activeBoundaryEpoch.summary}
              </p>
            ) : activePeriod ? (
              <p className="section-copy">
                Bản đồ đang đặt các lớp lịch sử vào bối cảnh của {activePeriod.title}.
              </p>
            ) : (
              <p className="section-copy">Chưa có lớp nền lịch sử phù hợp cho năm đang chọn.</p>
            )}
          </div>
        </div>

        <AtlasMapShell
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
        description="Danh sách này bám theo bộ lọc atlas hiện tại để người đọc chuyển từ bản đồ sang từng hồ sơ chi tiết."
        records={visibleRecords.slice(0, 12)}
        title={`Bản ghi theo lát cắt và bộ lọc của năm ${activeYear}`}
      />
    </div>
  )
}
