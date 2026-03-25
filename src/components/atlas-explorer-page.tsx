import Link from 'next/link'

import type { ExplorerSnapshot, RecordRegion } from '@/lib/content-types'
import type { LayerType, SearchState } from '@/lib/search-state'

import { AtlasControlsDrawer } from '@/components/atlas-controls-drawer'
import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  buildTimeSliceHref,
  listForType,
  resolveActiveLeader,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { RecordGrid } from '@/components/content-blocks'
import { LeaderContextCard } from '@/components/leader-blocks'
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

export function AtlasExplorerPage({
  filters,
  snapshot,
}: {
  filters: SearchState
  snapshot: ExplorerSnapshot
}) {
  const activeYear = resolveActiveYear(snapshot, filters)
  const activePeriod = resolveActivePeriod(snapshot, filters, activeYear)
  const activeLeader = resolveActiveLeader(snapshot, filters, activeYear, activePeriod)
  const visibleRecords = listForType(snapshot, filters.type)
  const { maxYear, minYear } = resolveTimelineBounds(snapshot)
  const activeThemes = activePeriod?.keyThemes.slice(0, 3) ?? []
  const drawerKey = [
    activeYear,
    filters.leader ?? '',
    filters.period ?? '',
    filters.q ?? '',
    filters.type,
    filters.region ?? '',
    filters.layer,
  ].join(':')
  const from = filters.from ?? ''
  const homeParams = new URLSearchParams({
    from: String(activeYear),
    to: String(activeYear),
    year: String(activeYear),
  })

  if (filters.period) {
    homeParams.set('period', filters.period)
  }

  if (filters.leader) {
    homeParams.set('leader', filters.leader)
  }

  const homeHref = `/?${homeParams.toString()}`
  const resetHref = buildAtlasResetHref(activeYear)
  const toggleSummary = activePeriod
    ? `${activePeriod.title} · ${visibleRecords.length} bản ghi`
    : `Năm ${activeYear} · ${visibleRecords.length} bản ghi`
  const to = filters.to ?? ''
  const year = filters.year ?? activeYear

  return (
    <div className="page-stack atlas-page-stack">
      <section className="hero-panel atlas-hero">
        <div className="atlas-hero-copy">
          <p className="eyebrow">Atlas trình chiếu</p>
          <h1>Atlas nhiều lớp của lịch sử cách mạng Việt Nam</h1>
          <p>Chọn lãnh đạo, mốc năm và lớp tư liệu để trình bày chuyển động lịch sử trực tiếp trên bản đồ.</p>
          {activeLeader ? (
            <p className="hero-context">
              Lát cắt hiện tại đang đặt vào <strong>{activeLeader.name}</strong>
              {activePeriod ? (
                <>
                  {' '}
                  trong <strong>{activePeriod.title}</strong>.
                </>
              ) : (
                '.'
              )}
            </p>
          ) : activePeriod ? (
            <p className="hero-context">
              Năm <strong>{activeYear}</strong> đang nằm trong <strong>{activePeriod.title}</strong>.
            </p>
          ) : null}
        </div>

        <div className="hero-stats">
          <span className="hero-stat-label">Lát cắt hiện tại</span>
          <strong>{activeYear}</strong>
          <span>{visibleRecords.length} bản ghi theo bộ lọc hiện tại</span>
          <small>
            {activeLeader
              ? `${activeLeader.name} · ${activeLeader.officeLabel}`
              : activeThemes.length > 0
                ? activeThemes.join(' · ')
                : `${typeLabel(filters.type)} · ${layerLabel(filters.layer)}`}
          </small>
        </div>
      </section>

      <section className="content-section atlas-workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Điều hướng bản đồ</p>
            <h2>Chọn lãnh đạo, mốc năm và lớp tư liệu trước khi đọc bản đồ</h2>
            <p className="section-copy">
              Atlas ưu tiên theo thứ tự: lãnh đạo, năm, loại bản ghi, vùng và lớp hiển thị.
            </p>
          </div>

          <Link className="ghost-button" href={homeHref}>
            Về lát cắt kể chuyện
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
              <label>
                <span>Lãnh đạo</span>
                <select defaultValue={filters.leader ?? ''} name="leader">
                  <option value="">Tất cả thời kỳ lãnh đạo</option>
                  {snapshot.leaders.map((leader) => (
                    <option key={leader.id} value={leader.slug}>
                      {leader.name} · {leader.officeLabel}
                    </option>
                  ))}
                </select>
              </label>

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
                <strong>
                  Năm {activeYear}
                  {activePeriod ? ` · ${activePeriod.title}` : ''}
                </strong>
                <div className="detail-meta">
                  {activeLeader ? <span>{activeLeader.name}</span> : null}
                  <span>{typeLabel(filters.type)}</span>
                  {filters.region ? <span>{regionLabel(filters.region)}</span> : null}
                  <span>{layerLabel(filters.layer)}</span>
                </div>
              </div>

              <div className="filters-actions">
                <Link className="ghost-button" href={resetHref}>
                  Xóa bộ lọc
                </Link>
                <button className="primary-button" type="submit">
                  Áp dụng
                </button>
              </div>

              <input name="from" type="hidden" value={from} />
              {filters.period ? <input name="period" type="hidden" value={filters.period} /> : null}
              <input name="to" type="hidden" value={to} />
              <input name="year" type="hidden" value={year} />
            </form>
          </div>
        </AtlasControlsDrawer>

        <AtlasMapShell
          activeYear={activeYear}
          boundaryEpoch={snapshot.activeBoundaryEpoch ?? null}
          campaigns={snapshot.campaigns}
          events={snapshot.events}
          layer={filters.layer}
          overlays={snapshot.overlays}
          places={snapshot.places}
        />

        <LeaderContextCard leader={activeLeader} periods={snapshot.periods} />
      </section>

      <RecordGrid
        description="Từ bản đồ, đi tiếp sang những hồ sơ khớp với lát cắt hiện tại để giữ mạch thuyết trình ngắn và rõ."
        maxItems={8}
        records={visibleRecords}
        title={`Bản ghi theo lát cắt của năm ${activeYear}`}
      />
    </div>
  )
}
