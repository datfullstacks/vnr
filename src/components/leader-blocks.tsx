import Image from 'next/image'
import Link from 'next/link'

import type { CampaignRecord, EventRecord, ExplorerRecord, LeaderRecord, PeriodRecord, PlaceRecord } from '@/lib/content-types'

type FormationChapter = {
  summary: string
  timeLabel: string
  title: string
}

const formationChapters: FormationChapter[] = [
  {
    summary: 'Thực dân Pháp mở đầu quá trình xâm lược, kéo theo các cuộc kháng chiến buổi đầu và biến động lớn trong trật tự cũ.',
    timeLabel: '1858-1884',
    title: 'Xâm lược và kháng chiến buổi đầu',
  },
  {
    summary: 'Phong trào Cần Vương và các xu hướng cứu nước cuối thế kỷ XIX cho thấy nhu cầu tìm một con đường mới.',
    timeLabel: '1885-1918',
    title: 'Khủng hoảng quốc gia và các xu hướng cứu nước',
  },
  {
    summary: 'Sau Chiến tranh thế giới thứ nhất, lực lượng xã hội và các tổ chức chính trị mới phát triển nhanh, tạo nền cho cách mạng.',
    timeLabel: '1919-1925',
    title: 'Chuyển biến xã hội và lực lượng mới',
  },
  {
    summary: 'Nguyễn Ái Quốc cùng các tổ chức tiền thân chuẩn bị trực tiếp cho mốc thành lập Đảng năm 1930.',
    timeLabel: '1925-1930',
    title: 'Từ tổ chức tiền thân đến thành lập Đảng',
  },
]

function leaderDisplayName(leader: LeaderRecord) {
  return leader.displayName ?? leader.name
}

function formatLeaderYears(leader: LeaderRecord) {
  return leader.tenureLabel ?? `${leader.startYear} - ${leader.endYear >= new Date().getFullYear() ? 'nay' : leader.endYear}`
}

function latestLeaderYear(leader: LeaderRecord) {
  if (!leader.terms?.length) {
    return leader.endYear
  }

  return leader.terms.reduce((maxYear, term) => Math.max(maxYear, term.endYear), leader.endYear)
}

function leaderAtlasHref(leader: LeaderRecord) {
  const params = new URLSearchParams({
    leader: leader.slug,
    year: String(latestLeaderYear(leader)),
  })

  return `/atlas?${params.toString()}`
}

function hrefForRecord(record: ExplorerRecord) {
  if ('content' in record) {
    return `/su-kien/${record.slug}`
  }

  if ('outcome' in record) {
    return `/chien-dich/${record.slug}`
  }

  return `/dia-danh/${record.slug}`
}

function kindLabel(record: ExplorerRecord) {
  if ('content' in record) {
    return 'Sự kiện'
  }

  if ('outcome' in record) {
    return 'Chiến dịch'
  }

  return 'Địa danh'
}

function periodsForLeader(periods: PeriodRecord[], leader: LeaderRecord) {
  return periods.filter(
    (period) =>
      period.featuredLeaderSlug === leader.slug || period.officialLeaderSlugs.includes(leader.slug),
  )
}

function uniqueLeaders(leaders: LeaderRecord[]) {
  return leaders.filter((leader, index) => leaders.findIndex((item) => item.slug === leader.slug) === index)
}

function summarizePeriods(periods: PeriodRecord[]) {
  if (periods.length === 0) {
    return 'Chưa gắn giai đoạn'
  }

  if (periods.length === 1) {
    return periods[0].title
  }

  return `${periods[0].title} và ${periods.length - 1} giai đoạn khác`
}

function leaderInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function LeaderPortrait({
  leader,
  variant = 'card',
}: {
  leader: LeaderRecord
  variant?: 'card' | 'hero'
}) {
  const className = variant === 'hero' ? 'leader-portrait leader-portrait-hero' : 'leader-portrait'

  return (
    <div className={className}>
      {leader.portraitUrl ? (
        <Image
          alt={`Chân dung ${leaderDisplayName(leader)}`}
          className="leader-portrait-image"
          fill
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          sizes={variant === 'hero' ? '(max-width: 1024px) 220px, 260px' : '(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 280px'}
          src={leader.portraitUrl}
          unoptimized={leader.portraitUrl.endsWith('.gif')}
        />
      ) : (
        <div aria-hidden="true" className="leader-portrait-fallback">
          {leaderInitials(leader.name)}
        </div>
      )}
    </div>
  )
}

export function LeaderQuickFacts({
  campaigns,
  events,
  featuredPeriods,
  leader,
  officialPeriods,
  places,
}: {
  campaigns: CampaignRecord[]
  events: EventRecord[]
  featuredPeriods: PeriodRecord[]
  leader: LeaderRecord
  officialPeriods: PeriodRecord[]
  places: PlaceRecord[]
}) {
  const facts = [
    { label: 'Chức danh', value: leader.officeLabel },
    { label: 'Nhiệm kỳ', value: formatLeaderYears(leader) },
    {
      label: 'Giai đoạn nổi bật',
      value: featuredPeriods.length > 0 ? summarizePeriods(featuredPeriods) : 'Không có nhấn nổi bật riêng',
    },
    {
      label: 'Giai đoạn chính thức',
      value: officialPeriods.length > 0 ? summarizePeriods(officialPeriods) : 'Chưa có gắn chính thức',
    },
    { label: 'Sự kiện và chiến dịch', value: `${events.length + campaigns.length} hồ sơ` },
    { label: 'Địa danh liên quan', value: `${places.length} địa danh` },
  ]

  const periodTags = [...featuredPeriods, ...officialPeriods].filter(
    (period, index, periods) => periods.findIndex((item) => item.slug === period.slug) === index,
  )

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Hồ sơ nhanh</p>
          <h2>Thông tin cốt lõi của chân dung này</h2>
          <p className="section-copy">
            Khối này gom các dữ kiện cốt lõi để người xem nắm nhanh vị trí lịch sử của lãnh đạo trước khi đi vào bản đồ và hồ sơ liên quan.
          </p>
        </div>
      </div>

      <div className="fact-grid">
        {facts.map((fact) => (
          <article className="fact-card" key={fact.label}>
            <span className="record-kind">{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </div>

      {periodTags.length > 0 ? (
        <div className="detail-meta leader-period-list">
          {periodTags.map((period) => (
            <span key={period.slug}>{period.title}</span>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function renderLeaderGrid(
  leaders: LeaderRecord[],
  periods: PeriodRecord[],
  emptyLabel: string,
  titleLabel: string,
) {
  if (leaders.length === 0) {
    return <p className="empty-state">{emptyLabel}</p>
  }

  return (
    <div className="leader-grid leader-grid-compact">
      {leaders.map((leader) => {
        const relatedPeriods = periodsForLeader(periods, leader)

        return (
        <article
          className={leader.isFeaturedChairmanHighlight ? 'leader-card leader-card-featured' : 'leader-card'}
          key={`${titleLabel}:${leader.id}`}
        >
          <LeaderPortrait leader={leader} />
          <span className="record-kind">{titleLabel}</span>
          <h3>{leaderDisplayName(leader)}</h3>
          <p className="leader-years">
            {leader.officeLabel} · {formatLeaderYears(leader)}
          </p>
          <p>{leader.summary}</p>
          <div className="detail-meta">
            <span>{leader.officeType === 'party-chairman' ? 'Điểm nhấn đặc biệt' : 'Trục Tổng Bí thư'}</span>
            <span>{summarizePeriods(relatedPeriods)}</span>
          </div>
          <Link className="inline-link" href={`/lanh-dao/${leader.slug}`}>
            Mở hồ sơ lãnh đạo
          </Link>
        </article>
        )
      })}
    </div>
  )
}

export function FormationOverview({
  periods,
}: {
  periods: PeriodRecord[]
}) {
  const visiblePeriods = periods
    .filter((period) => period.periodType === 'formation')
    .sort((left, right) => left.displayOrder - right.displayOrder)

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tiền đề hình thành Đảng</p>
          <h2>1858-1930: Từ khủng hoảng quốc gia đến sự ra đời của Đảng Cộng sản Việt Nam</h2>
          <p className="section-copy">
            Đây là lớp nhập đề của site, đi theo tiến trình tạo nên tiền đề tư tưởng, tổ chức và xã hội
            cho sự ra đời của Đảng.
          </p>
        </div>
      </div>

      <div className="formation-grid">
        {formationChapters.map((chapter) => (
          <article className="record-card formation-card" key={chapter.timeLabel}>
            <span className="record-kind">{chapter.timeLabel}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.summary}</p>
          </article>
        ))}
      </div>

      <div className="period-stack period-stack-compact">
        {visiblePeriods.map((period) => (
          <Link
            className="period-panel"
            href={`/giai-doan/${period.slug}`}
            key={period.id}
            style={{ '--period-accent': period.accentColor } as React.CSSProperties}
          >
            <span>
              {period.startYear} - {period.endYear}
            </span>
            <h3>{period.title}</h3>
            <p>{period.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function LeaderTimelineSection({
  description,
  leaders,
  periods = [],
  title = 'Các thời kỳ lãnh đạo từ 1930 đến nay',
}: {
  description?: string
  leaders: LeaderRecord[]
  periods?: PeriodRecord[]
  title?: string
}) {
  const featuredLeaders = leaders.filter((leader) => leader.isFeaturedChairmanHighlight)
  const timelineLeaders = leaders.filter((leader) => !leader.isFeaturedChairmanHighlight)

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Lãnh đạo</p>
          <h2>{title}</h2>
          <p className="section-copy">
            {description ??
              'Từ 1930 đến nay, trục đọc chính của site đi theo các đồng chí giữ vai trò lãnh đạo trung tâm của Đảng, với Hồ Chí Minh được nhấn riêng ở vị trí Chủ tịch Đảng.'}
          </p>
        </div>
        <Link className="ghost-button" href="/lanh-dao">
          Xem toàn bộ lãnh đạo
        </Link>
      </div>

      {featuredLeaders.length > 0 ? (
        <div className="leader-grid leader-grid-featured">
          {featuredLeaders.map((leader) => {
            const relatedPeriods = periodsForLeader(periods, leader)

            return (
            <article
              className={leader.isFeaturedChairmanHighlight ? 'leader-card leader-card-featured' : 'leader-card'}
              key={leader.id}
            >
              <LeaderPortrait leader={leader} />
              <div className="leader-card-header">
                <span className="record-kind">{leader.officeLabel}</span>
                <span className="leader-badge">Hồ Chí Minh</span>
              </div>
              <h3>{leaderDisplayName(leader)}</h3>
              <p className="leader-years">{formatLeaderYears(leader)}</p>
              <p>{leader.summary}</p>
              <div className="detail-meta">
                <span>Điểm nhấn đặc biệt</span>
                <span>{summarizePeriods(relatedPeriods)}</span>
              </div>
              <div className="leader-actions">
                <Link className="ghost-button" href={`/lanh-dao/${leader.slug}`}>
                  Hồ sơ lãnh đạo
                </Link>
                <Link className="inline-link" href={leaderAtlasHref(leader)}>
                  Mở lát cắt trên bản đồ
                </Link>
              </div>
            </article>
            )
          })}
        </div>
      ) : null}

      <div className="leader-grid leader-grid-compact">
        {timelineLeaders.map((leader) => {
          const relatedPeriods = periodsForLeader(periods, leader)

          return (
          <article
            className={leader.isFeaturedChairmanHighlight ? 'leader-card leader-card-featured' : 'leader-card'}
            key={leader.id}
          >
            <LeaderPortrait leader={leader} />
            <div className="leader-card-header">
              <span className="record-kind">{leader.officeLabel}</span>
              {leader.isFeaturedChairmanHighlight ? <span className="leader-badge">Chủ tịch Đảng</span> : null}
            </div>
            <h3>{leaderDisplayName(leader)}</h3>
            <p className="leader-years">{formatLeaderYears(leader)}</p>
            <p>{leader.summary}</p>
            <div className="detail-meta">
              <span>{leader.officeType === 'party-chairman' ? 'Điểm nhấn đặc biệt' : 'Trục Tổng Bí thư'}</span>
              <span>{leader.terms?.length && leader.terms.length > 1 ? `${leader.terms.length} nhiệm kỳ` : leader.startYear}</span>
              <span>{summarizePeriods(relatedPeriods)}</span>
            </div>
            <div className="leader-actions">
              <Link className="ghost-button" href={`/lanh-dao/${leader.slug}`}>
                Hồ sơ lãnh đạo
              </Link>
              <Link className="inline-link" href={leaderAtlasHref(leader)}>
                Mở lát cắt trên bản đồ
              </Link>
            </div>
          </article>
          )
        })}
      </div>
    </section>
  )
}

export function LeaderContextCard({
  leader,
  periods,
  title = 'Lãnh đạo trung tâm',
}: {
  leader: LeaderRecord | null
  periods?: PeriodRecord[]
  title?: string
}) {
  if (!leader) {
    return null
  }

  const relatedPeriodTitles = periodsForLeader(periods ?? [], leader)
    .slice(0, 3)
    .map((period) => period.title)

  return (
    <article className={leader.isFeaturedChairmanHighlight ? 'leader-card leader-card-featured' : 'leader-card'}>
      <LeaderPortrait leader={leader} />
      <div className="leader-card-header">
        <span className="record-kind">{title}</span>
        {leader.isFeaturedChairmanHighlight ? <span className="leader-badge">Chủ tịch Đảng</span> : null}
      </div>
      <h3>{leaderDisplayName(leader)}</h3>
      <p className="leader-years">
        {leader.officeLabel} · {formatLeaderYears(leader)}
      </p>
      <p>{leader.overview}</p>
      {relatedPeriodTitles.length > 0 ? (
        <div className="detail-meta">
          {relatedPeriodTitles.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      <div className="leader-actions">
        <Link className="ghost-button" href={`/lanh-dao/${leader.slug}`}>
          Trang lãnh đạo
        </Link>
        <Link className="inline-link" href={leaderAtlasHref(leader)}>
          Lọc trên atlas
        </Link>
      </div>
    </article>
  )
}

export function PeriodLeaderSummary({
  leaders,
  period,
}: {
  leaders: LeaderRecord[]
  period: PeriodRecord
}) {
  const featuredLeader = period.featuredLeaderSlug
    ? leaders.find((leader) => leader.slug === period.featuredLeaderSlug) ?? null
    : null
  const officialLeaders = uniqueLeaders(
    period.officialLeaderSlugs
      .map((slug) => leaders.find((leader) => leader.slug === slug))
      .filter((leader): leader is LeaderRecord => Boolean(leader)),
  )

  if (!featuredLeader && officialLeaders.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Lãnh đạo</p>
          <h2>Lãnh đạo gắn với giai đoạn này</h2>
          <p className="section-copy">
            {period.leadershipLabel ??
              'Trang giai đoạn tách rõ lãnh đạo được nhấn nổi bật trên UI và những đồng chí giữ cương vị chính thức trong cùng chặng lịch sử.'}
          </p>
        </div>
      </div>

      {featuredLeader ? (
        <div className="leader-grid leader-grid-compact">
          <LeaderContextCard leader={featuredLeader} periods={[period]} title="Lãnh đạo nổi bật của giai đoạn" />
        </div>
      ) : null}

      <div className="section-heading">
        <div>
          <p className="eyebrow">Cương vị chính thức</p>
          <h2>Những đồng chí giữ vai trò chính thức trong giai đoạn này</h2>
        </div>
      </div>

      {renderLeaderGrid(
        officialLeaders,
        [period],
        'Giai đoạn này không có leader Đảng được gắn chính thức trong dữ liệu hiện tại.',
        'Cương vị chính thức',
      )}
    </section>
  )
}

export function RecordsByYear({
  campaigns,
  events,
  title = 'Mốc năm tiêu biểu trong giai đoạn',
}: {
  campaigns: CampaignRecord[]
  events: EventRecord[]
  title?: string
}) {
  const grouped = new Map<number, ExplorerRecord[]>()

  for (const record of [...events, ...campaigns].sort((left, right) => left.displayYear - right.displayYear)) {
    const bucket = grouped.get(record.displayYear) ?? []
    bucket.push(record)
    grouped.set(record.displayYear, bucket)
  }

  const years = [...grouped.keys()].sort((left, right) => left - right)

  if (years.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Mốc năm tiêu biểu</p>
          <h2>{title}</h2>
          <p className="section-copy">
            Thay vì một danh sách dài, phần này gom sự kiện và chiến dịch theo từng năm để người xem bám
            nhanh nhịp chuyển của giai đoạn.
          </p>
        </div>
      </div>
      <div className="year-stack">
        {years.map((year) => (
          <article className="year-group" key={year}>
            <div className="year-heading">
              <span className="hero-stat-label">Năm</span>
              <strong>{year}</strong>
            </div>
            <div className="record-grid">
              {grouped.get(year)?.map((record) => (
                <Link className="record-card" href={hrefForRecord(record)} key={record.id}>
                  <span className="record-kind">{kindLabel(record)}</span>
                  <h3>{record.title}</h3>
                  <p>{record.summary}</p>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
