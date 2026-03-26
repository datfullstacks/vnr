import Link from 'next/link'

import type { ExplorerSnapshot, RecordRegion } from '@/lib/content-types'
import type { LayerType, SearchState } from '@/lib/search-state'

import { AtlasControlsDrawer } from '@/components/atlas-controls-drawer'
import { AtlasMapShell } from '@/components/atlas-map-shell'
import {
  buildTimeSliceHref,
  isFormationTimeSlice,
  leadersForTimeSlice,
  listForType,
  resolveActiveLeader,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { HistoricalNarrativeDigest, NarrativeFocus, QuizHighlights, RecordGrid } from '@/components/content-blocks'
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

function typeLabelLower(type: SearchState['type']) {
  switch (type) {
    case 'events':
      return 'sự kiện'
    case 'campaigns':
      return 'chiến dịch'
    case 'places':
      return 'địa danh'
    default:
      return 'hồ sơ lịch sử'
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
  const availableLeaders = leadersForTimeSlice(snapshot.leaders, activeYear, activePeriod)
  const isFormationSlice = isFormationTimeSlice(activeYear, activePeriod)
  const hasLeadershipGap = !isFormationSlice && availableLeaders.length === 0
  const leaderSelectLabel = isFormationSlice ? 'Lãnh đạo' : 'Lãnh đạo theo giai đoạn'
  const leaderPlaceholder =
    availableLeaders.length > 0
      ? activePeriod
        ? `Tất cả lãnh đạo của ${activePeriod.title}`
        : 'Tất cả thời kỳ lãnh đạo'
      : isFormationSlice
        ? 'Giai đoạn này Đảng chưa được thành lập'
        : `Năm ${activeYear} đang là khoảng trống lãnh đạo`
  const visibleRecords = listForType(snapshot, filters.type)
  const mapEvents = filters.type === 'all' || filters.type === 'events' ? snapshot.events : []
  const mapCampaigns = filters.type === 'all' || filters.type === 'campaigns' ? snapshot.campaigns : []
  const mapPlaces = filters.type === 'all' || filters.type === 'places' ? snapshot.places : []
  const hasExplicitSlice =
    typeof filters.year === 'number' ||
    typeof filters.from === 'number' ||
    typeof filters.to === 'number' ||
    Boolean(filters.period) ||
    Boolean(filters.leader)
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
  const recordSectionDescription =
    !hasExplicitSlice && filters.type === 'all'
      ? `Khối này đang hiển thị nhóm hồ sơ tổng quan từ toàn bộ dataset hiện có: ${snapshot.events.length} sự kiện, ${snapshot.campaigns.length} chiến dịch và ${snapshot.places.length} địa danh. Hãy khóa theo năm, giai đoạn hoặc lãnh đạo để đọc đúng một lát cắt cụ thể.`
      : filters.type === 'all'
      ? `Khối này đang hiển thị toàn bộ hồ sơ khớp với bộ lọc hiện tại: ${snapshot.events.length} sự kiện, ${snapshot.campaigns.length} chiến dịch và ${snapshot.places.length} địa danh${activePeriod ? ` trong ${activePeriod.title}` : ''}.`
      : `Khối này đang hiển thị toàn bộ ${visibleRecords.length} ${typeLabelLower(filters.type)} khớp với bộ lọc hiện tại${activePeriod ? ` trong ${activePeriod.title}` : ''}${activeLeader ? `, theo trục ${activeLeader.displayName ?? activeLeader.name}` : ''}.`
  const recordSectionTitle =
    !hasExplicitSlice && filters.type === 'all'
      ? 'Hồ sơ tiêu biểu trên toàn bộ atlas hiện có'
      : filters.type === 'all'
      ? `Hồ sơ lịch sử trong lát cắt năm ${activeYear}`
      : `Các ${typeLabelLower(filters.type)} trong lát cắt năm ${activeYear}`
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
              Lát cắt hiện tại đang đặt vào <strong>{activeLeader.displayName ?? activeLeader.name}</strong>
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
              ? `${activeLeader.displayName ?? activeLeader.name} · ${activeLeader.officeLabel}`
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
              leaders={snapshot.leaders}
              maxYear={maxYear}
              minYear={minYear}
              periods={snapshot.periods}
              variant="full"
            />

            <form className="filters-card atlas-filters-card" method="get">
              <label>
                <span>{leaderSelectLabel}</span>
                <select
                  defaultValue={filters.leader ?? ''}
                  disabled={availableLeaders.length === 0}
                  name="leader"
                >
                  <option value="">{leaderPlaceholder}</option>
                  {availableLeaders.map((leader) => (
                    <option key={leader.id} value={leader.slug}>
                      {leader.displayName ?? leader.name} · {leader.officeLabel}
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
                  {activeLeader ? <span>{activeLeader.displayName ?? activeLeader.name}</span> : null}
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
          campaigns={mapCampaigns}
          events={mapEvents}
          layer={filters.layer}
          overlays={snapshot.overlays}
          places={mapPlaces}
        />

        <LeaderContextCard leader={activeLeader} periods={snapshot.periods} />
      </section>

      <NarrativeFocus period={activePeriod} variant="compact" year={activeYear} />

      <HistoricalNarrativeDigest
        campaigns={snapshot.campaigns}
        description={
          hasExplicitSlice
            ? 'Các sự kiện và chiến dịch dưới đây là phần diễn biến then chốt đang khớp trực tiếp với bộ lọc atlas.'
            : 'Đây là lớp diễn biến tổng quan trên toàn bộ atlas hiện có. Muốn đọc đúng một lát cắt, hãy khóa theo năm, giai đoạn hoặc lãnh đạo.'
        }
        events={snapshot.events}
        maxItems={10}
        title={
          hasExplicitSlice
            ? `Diễn biến lịch sử trong lát cắt năm ${activeYear}`
            : 'Diễn biến lịch sử trên toàn bộ atlas hiện có'
        }
      />

      <QuizHighlights
        description={
          hasExplicitSlice
            ? 'Nếu lát cắt hiện tại có bộ câu hỏi liên quan, chúng sẽ xuất hiện ở đây để người xem chuyển nhanh từ trình bày sang ôn tập.'
            : 'Ở chế độ tổng quan, khối này chỉ giữ các bộ câu hỏi thực sự bám vào phần dữ liệu đang hiển thị.'
        }
        quizzes={snapshot.quizzes}
        title={hasExplicitSlice ? 'Câu hỏi ôn tập theo lát cắt' : 'Câu hỏi ôn tập từ dữ liệu đang hiển thị'}
      />

      <RecordGrid
        description={recordSectionDescription}
        records={visibleRecords}
        title={recordSectionTitle}
      />
    </div>
  )
}
