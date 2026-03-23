'use client'

import { startTransition, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

export function TimelineController({
  filters,
  maxYear,
  minYear,
  periods,
}: {
  filters: SearchState
  maxYear: number
  minYear: number
  periods: PeriodRecord[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [year, setYear] = useState(filters.year ?? filters.to ?? maxYear)

  function pushState(next: { period?: string; year?: number }) {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof next.year === 'number') {
      params.set('from', String(next.year))
      params.set('to', String(next.year))
      params.set('year', String(next.year))
    } else {
      params.delete('from')
      params.delete('to')
      params.delete('year')
    }

    if (typeof next.period === 'string') {
      if (next.period) {
        params.set('period', next.period)
      } else {
        params.delete('period')
      }
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <section className="timeline-card">
      <div className="timeline-header">
        <div>
          <p className="eyebrow">Dẫn tuyến thời gian</p>
          <h2>Kéo theo năm để nhìn thấy bước chuyển của cách mạng trên cùng một trục bản đồ và tư liệu</h2>
          <p className="timeline-copy">
            Mỗi mốc năm sẽ làm đổi bối cảnh lịch sử trên bản đồ, đồng thời gọi ra những bản ghi tiêu biểu
            của giai đoạn tương ứng.
          </p>
        </div>
        <button
          className="ghost-button"
          onClick={() => {
            setYear(maxYear)
            pushState({ period: '', year: maxYear })
          }}
          type="button"
        >
          Về năm gần nhất
        </button>
      </div>

      <div className="timeline-range-grid">
        <label>
          <span>Lát cắt đang xem: {year}</span>
          <input
            max={maxYear}
            min={minYear}
            onChange={(event) => setYear(Number(event.target.value))}
            type="range"
            value={year}
          />
        </label>

        <button
          className="primary-button"
          onClick={() => pushState({ year })}
          type="button"
        >
          Cập nhật bản đồ và bản ghi
        </button>
      </div>

      <div className="period-rail" role="list">
        {periods.map((period) => {
          const active = filters.period === period.slug

          return (
            <button
              className={active ? 'period-chip active' : 'period-chip'}
              key={period.id}
              onClick={() =>
                pushState({
                  period: active ? '' : period.slug,
                  year: active ? year : Math.min(Math.max(year, period.startYear), period.endYear),
                })
              }
              style={{ '--chip-accent': period.accentColor } as React.CSSProperties}
              type="button"
            >
              <strong>{period.title}</strong>
              <span>
                {period.startYear} - {period.endYear}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
