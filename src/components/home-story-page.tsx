import Link from 'next/link'

import type { ExplorerSnapshot, LeaderRecord, PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

import { AtlasMapShell } from '@/components/atlas-map-shell'
import { HistoricalNarrativeDigest, NarrativeFocus, QuizHighlights, RecordGrid } from '@/components/content-blocks'
import {
  listForType,
  resolveActiveLeader,
  resolveActivePeriod,
  resolveActiveYear,
  resolveTimelineBounds,
} from '@/components/explorer-helpers'
import { FormationOverview, LeaderContextCard, LeaderTimelineSection } from '@/components/leader-blocks'
import { TimelineController } from '@/components/timeline-controller'

function leaderTerms(leader: LeaderRecord) {
  return leader.terms?.length
    ? leader.terms
    : [{ endYear: leader.endYear, startYear: leader.startYear }]
}

function leadersForTimeSlice(leaders: LeaderRecord[], activeYear: number, activePeriod: PeriodRecord | null) {
  if (activePeriod?.periodType === 'formation' || activeYear < 1930) {
    return []
  }

  if (activePeriod) {
    const leaderBySlug = new Map(leaders.map((leader) => [leader.slug, leader]))
    const periodLeaderSlugs = [
      ...(activePeriod.featuredLeaderSlug ? [activePeriod.featuredLeaderSlug] : []),
      ...activePeriod.officialLeaderSlugs,
    ]

    const periodLeaders = periodLeaderSlugs
      .map((slug) => leaderBySlug.get(slug))
      .filter((leader): leader is LeaderRecord => Boolean(leader))
      .filter((leader, index, items) => items.findIndex((item) => item.slug === leader.slug) === index)
      .sort((left, right) => left.startYear - right.startYear)

    if (periodLeaders.length > 0) {
      return periodLeaders
    }
  }

  return leaders
    .filter((leader) =>
      leaderTerms(leader).some((term) => activeYear >= term.startYear && activeYear <= term.endYear),
    )
    .sort((left, right) => left.startYear - right.startYear)
}

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
  const sliceLeaders = leadersForTimeSlice(snapshot.leaders, activeYear, activePeriod)
  const hasExplicitSlice =
    typeof filters.year === 'number' ||
    typeof filters.from === 'number' ||
    typeof filters.to === 'number' ||
    Boolean(filters.period) ||
    Boolean(filters.leader)
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
                ? `${activeLeader.displayName ?? activeLeader.name}${activePeriod ? ` trong ${activePeriod.title}` : ''}.`
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

      <NarrativeFocus period={activePeriod} variant="compact" year={activeYear} />
      <FormationOverview periods={snapshot.periods} />
      <LeaderTimelineSection
        description={
          activePeriod?.periodType === 'formation'
            ? `Lát cắt năm ${activeYear} vẫn nằm trước thời điểm Đảng Cộng sản Việt Nam ra đời, nên trục lãnh đạo của Đảng chưa bắt đầu trên mốc này.`
            : activePeriod
              ? `Khối này chỉ hiển thị các lãnh đạo gắn với ${activePeriod.title}, thay vì hiển thị toàn bộ trục từ 1930 đến nay.`
              : `Khối này chỉ hiển thị các lãnh đạo gắn trực tiếp với lát cắt năm ${activeYear}.`
        }
        emptyLabel={`Năm ${activeYear} chưa nằm trong trục lãnh đạo của Đảng. Xem /lanh-dao để mở toàn bộ chuỗi từ 1930 đến nay.`}
        leaders={sliceLeaders}
        periods={snapshot.periods}
        title={
          activePeriod?.periodType === 'formation'
            ? 'Trục lãnh đạo của Đảng bắt đầu từ năm 1930'
            : activePeriod
              ? `Lãnh đạo gắn với ${activePeriod.title}`
              : `Lãnh đạo gắn với lát cắt năm ${activeYear}`
        }
      />

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

      <HistoricalNarrativeDigest
        campaigns={snapshot.campaigns}
        description={
          hasExplicitSlice
            ? 'Những sự kiện và chiến dịch nổi bật nhất của lát cắt đang xem, giúp đi từ bản đồ sang mạch diễn biến cụ thể.'
            : 'Đây là nhóm diễn biến nổi bật trên toàn bộ dataset hiện có, dùng để giới thiệu nhanh nhịp vận động lịch sử trước khi đi sâu vào một lát cắt cụ thể.'
        }
        events={snapshot.events}
        maxItems={8}
        title={
          hasExplicitSlice
            ? `Những bước ngoặt nổi bật quanh năm ${activeYear}`
            : 'Những bước ngoặt nổi bật trên toàn bộ trục lịch sử'
        }
      />

      <QuizHighlights
        description={
          hasExplicitSlice
            ? 'Các bộ câu hỏi ngắn gắn với đúng giai đoạn hoặc hồ sơ đang hiện trên lát cắt.'
            : 'Ở chế độ tổng quan, khối này chỉ giữ các bộ câu hỏi thật sự liên quan tới phần dữ liệu đang được hiển thị.'
        }
        quizzes={snapshot.quizzes}
        title={hasExplicitSlice ? 'Ôn tập nhanh theo lát cắt' : 'Ôn tập từ các hồ sơ đang hiển thị'}
      />

      <RecordGrid
        description={
          hasExplicitSlice
            ? 'Nhóm hồ sơ tiêu biểu để đi từ lát cắt bản đồ sang các sự kiện, chiến dịch và địa danh đáng chú ý.'
            : 'Đây là nhóm hồ sơ tiêu biểu rút ra từ toàn bộ dữ liệu hiện có, dùng như một màn giới thiệu trước khi khóa vào một mốc năm hoặc giai đoạn cụ thể.'
        }
        maxItems={6}
        records={visibleRecords}
        title={
          hasExplicitSlice
            ? `Những hồ sơ tiêu biểu trong lát cắt năm ${activeYear}`
            : 'Những hồ sơ tiêu biểu trên toàn bộ trục lịch sử'
        }
      />
    </div>
  )
}
