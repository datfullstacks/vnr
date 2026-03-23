import Link from 'next/link'

import type {
  CampaignRecord,
  EventRecord,
  ExplorerRecord,
  PeriodRecord,
  PlaceRecord,
  SourceRecord,
} from '@/lib/content-types'

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
  if ('content' in record) return 'Sự kiện'
  if ('outcome' in record) return 'Chiến dịch'
  return 'Địa danh'
}

function regionLabel(region?: string) {
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
      return region ?? ''
  }
}

function yearLabel(record: ExplorerRecord) {
  if ('displayYear' in record) {
    return String(record.displayYear)
  }

  return undefined
}

type FigureHighlight = {
  name: string
  role: string
}

const prominentFiguresByPeriod: Record<string, FigureHighlight[]> = {
  '1858-1918': [
    { name: 'Trương Định', role: 'Gương mặt tiêu biểu của phong trào kháng Pháp buổi đầu ở Nam Kỳ.' },
    { name: 'Phan Đình Phùng', role: 'Biểu tượng của khởi nghĩa Cần Vương và tinh thần chống xâm lược cuối thế kỷ XIX.' },
    { name: 'Phan Bội Châu', role: 'Người mở rộng tầm nhìn cứu nước đầu thế kỷ XX bằng các tổ chức và mạng lưới mới.' },
  ],
  '1919-1930': [
    { name: 'Nguyễn Ái Quốc', role: 'Người kết nối hành trình tìm đường cứu nước với con đường cách mạng vô sản.' },
    { name: 'Tôn Đức Thắng', role: 'Đại diện cho sự trưởng thành của phong trào công nhân và tinh thần quốc tế.' },
    { name: 'Phan Châu Trinh', role: 'Một tiếng nói quan trọng của khuynh hướng canh tân và thức tỉnh dân quyền.' },
  ],
  '1930-1945': [
    { name: 'Hồ Chí Minh', role: 'Lãnh tụ gắn việc thành lập Đảng với chiến lược giải phóng dân tộc.' },
    { name: 'Trường Chinh', role: 'Nhà lý luận và tổ chức quan trọng trong việc giữ vững đường lối cách mạng.' },
    { name: 'Võ Nguyên Giáp', role: 'Người góp phần tổ chức lực lượng vũ trang và chuẩn bị cho Tổng khởi nghĩa.' },
  ],
  '1945-1954': [
    { name: 'Hồ Chí Minh', role: 'Linh hồn của chính quyền cách mạng non trẻ và đường lối kháng chiến kiến quốc.' },
    { name: 'Võ Nguyên Giáp', role: 'Tư lệnh gắn với những bước ngoặt quân sự từ Việt Bắc đến Điện Biên Phủ.' },
    { name: 'Phạm Văn Đồng', role: 'Gương mặt nổi bật trên mặt trận ngoại giao, đặc biệt ở Hội nghị Genève.' },
  ],
  '1954-1965': [
    { name: 'Hồ Chí Minh', role: 'Biểu tượng đoàn kết dân tộc và định hướng chiến lược cho cả hai miền.' },
    { name: 'Lê Duẩn', role: 'Nhân vật trung tâm trong hoạch định đường lối cách mạng miền Nam.' },
    { name: 'Nguyễn Chí Thanh', role: 'Gắn với chỉ đạo chiến trường và phát triển thế trận cách mạng ở miền Nam.' },
  ],
  '1965-1973': [
    { name: 'Lê Duẩn', role: 'Một trong những người định hình quyết tâm chiến lược trong giai đoạn chiến tranh ác liệt nhất.' },
    { name: 'Võ Nguyên Giáp', role: 'Gương mặt chỉ huy quân sự tiêu biểu trên mặt trận toàn quốc.' },
    { name: 'Nguyễn Thị Bình', role: 'Tiếng nói nổi bật của mặt trận ngoại giao cách mạng tại Paris.' },
  ],
  '1973-1975': [
    { name: 'Lê Duẩn', role: 'Gắn với quyết tâm chớp thời cơ và chỉ đạo tổng tiến công chiến lược.' },
    { name: 'Văn Tiến Dũng', role: 'Người chỉ huy các chiến dịch lớn trong mùa Xuân 1975.' },
    { name: 'Phạm Hùng', role: 'Nhân vật chủ chốt trong chỉ đạo chiến trường miền Nam giai đoạn cuối.' },
  ],
  '1975-1986': [
    { name: 'Lê Duẩn', role: 'Một trong những gương mặt trung tâm của thời kỳ hậu chiến và xây dựng lại đất nước.' },
    { name: 'Trường Chinh', role: 'Đại diện cho nỗ lực điều chỉnh tư duy và chuẩn bị cho những chuyển biến mới.' },
    { name: 'Phạm Văn Đồng', role: 'Gắn với điều hành nhà nước trong giai đoạn thống nhất và khắc phục hậu quả chiến tranh.' },
  ],
}

function figuresForPeriod(period: PeriodRecord) {
  return prominentFiguresByPeriod[period.slug] ?? []
}

export function NarrativeFocus({
  period,
  year,
}: {
  period: PeriodRecord | null
  year: number
}) {
  if (!period) {
    return null
  }

  const figures = figuresForPeriod(period)

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Mạch lịch sử</p>
          <h2>Năm {year} đang nằm trong chặng nào của lịch sử Đảng?</h2>
          <p className="section-copy">{period.summary}</p>
        </div>
      </div>

      <div className="narrative-grid">
        <article
          className="period-panel"
          style={{ '--period-accent': period.accentColor } as React.CSSProperties}
        >
          <span>
            {period.startYear} - {period.endYear}
          </span>
          <h3>{period.title}</h3>
          <p>{period.overview}</p>
          <div className="detail-meta">
            {period.keyThemes.map((theme) => (
              <span key={theme}>{theme}</span>
            ))}
          </div>
        </article>

        <div className="figure-grid">
          {figures.map((figure) => (
            <article className="record-card" key={figure.name}>
              <span className="record-kind">Nhân vật nổi bật</span>
              <h3>{figure.name}</h3>
              <p>{figure.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RecordGrid({
  description,
  emptyLabel = 'Không có bản ghi phù hợp.',
  records,
  title,
}: {
  description?: string
  emptyLabel?: string
  records: ExplorerRecord[]
  title: string
}) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Bản ghi</p>
          <h2>{title}</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      </div>

      {records.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <div className="record-grid">
          {records.map((record) => (
            <Link className="record-card" href={hrefForRecord(record)} key={record.id}>
              <span className="record-kind">{kindLabel(record)}</span>
              <h3>{record.title}</h3>
              <p>{record.summary}</p>
              <div className="record-meta">
                {yearLabel(record) ? <span>{yearLabel(record)}</span> : null}
                <span>{record.period.title}</span>
                <span>{regionLabel(record.region)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export function SourceList({
  description,
  sources,
  title = 'Tư liệu và nguồn đối chiếu',
}: {
  description?: string
  sources: SourceRecord[]
  title?: string
}) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nguồn</p>
          <h2>{title}</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      </div>
      <ol className="source-list">
        {sources.map((source) => (
          <li key={source.id}>
            <strong>{source.title}</strong>
            <p>{source.bibliography}</p>
            <small>
              {source.author ? `${source.author}. ` : ''}
              {source.publisher ? `${source.publisher}. ` : ''}
              {source.year}. {source.license}.
            </small>
            {source.url ? (
              <a className="inline-link" href={source.url} rel="noreferrer" target="_blank">
                Mở liên kết nguồn
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function PeriodHighlights({
  description,
  periods,
}: {
  description?: string
  periods: PeriodRecord[]
}) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Giai đoạn</p>
          <h2>Những chặng lớn của lịch sử Đảng trên bản đồ Việt Nam</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      </div>
      <div className="period-stack">
        {periods.map((period) => (
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
            <div className="detail-meta">
              {period.keyThemes.map((theme) => (
                <span key={theme}>{theme}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function DetailMeta({
  period,
  region,
  timeLabel,
}: {
  period: PeriodRecord
  region?: string
  timeLabel?: string
}) {
  return (
    <div className="detail-meta">
      <span>{period.title}</span>
      {timeLabel ? <span>{timeLabel}</span> : null}
      {region ? <span>{regionLabel(region)}</span> : null}
    </div>
  )
}

export function RelatedLinks({
  campaigns,
  description,
  events,
  places,
  title = 'Bản ghi liên quan',
}: {
  campaigns?: CampaignRecord[]
  description?: string
  events?: EventRecord[]
  places?: PlaceRecord[]
  title?: string
}) {
  const all = [...(events ?? []), ...(campaigns ?? []), ...(places ?? [])]

  if (all.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Liên quan</p>
          <h2>{title}</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      </div>
      <div className="record-grid">
        {all.map((record) => (
          <Link className="record-card" href={hrefForRecord(record)} key={record.id}>
            <span className="record-kind">{kindLabel(record)}</span>
            <h3>{record.title}</h3>
            <p>{record.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
