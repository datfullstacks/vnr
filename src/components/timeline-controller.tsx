'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import type { LeaderRecord, PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

import { resolvePeriodForYear } from '@/components/explorer-helpers'

function leaderTerms(leader: LeaderRecord) {
  return leader.terms?.length
    ? leader.terms
    : [{ endYear: leader.endYear, label: leader.tenureLabel ?? leader.officeLabel, startYear: leader.startYear }]
}

function leaderCoversYear(leader: LeaderRecord, year: number) {
  return leaderTerms(leader).some((term) => year >= term.startYear && year <= term.endYear)
}

export function TimelineController({
  filters,
  leaders,
  maxYear,
  minYear,
  periods,
  variant = 'full',
}: {
  filters: SearchState
  leaders: LeaderRecord[]
  maxYear: number
  minYear: number
  periods: PeriodRecord[]
  variant?: 'compact' | 'full'
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentYear = filters.year ?? filters.to ?? maxYear
  const [year, setYear] = useState(currentYear)
  const visiblePeriod =
    (filters.period ? periods.find((period) => period.slug === filters.period) : null) ??
    resolvePeriodForYear(periods, year)

  useEffect(() => {
    setYear(currentYear)
  }, [currentYear])

  function resolveCompatiblePeriodSlug(nextYear: number) {
    if (!filters.period) {
      return ''
    }

    const selectedPeriod = periods.find((period) => period.slug === filters.period)

    if (!selectedPeriod) {
      return ''
    }

    return nextYear >= selectedPeriod.startYear && nextYear <= selectedPeriod.endYear
      ? selectedPeriod.slug
      : ''
  }

  function resolveCompatibleLeaderSlug(nextYear: number) {
    if (!filters.leader) {
      return ''
    }

    const selectedLeader = leaders.find((leader) => leader.slug === filters.leader)

    if (!selectedLeader) {
      return ''
    }

    return leaderCoversYear(selectedLeader, nextYear) ? selectedLeader.slug : ''
  }

  function pushState(next: { leader?: string; period?: string; year?: number }) {
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

    if (typeof next.leader === 'string') {
      if (next.leader) {
        params.set('leader', next.leader)
      } else {
        params.delete('leader')
      }
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    window.location.assign(nextUrl)
  }

  function commitYear(nextYear: number) {
    pushState({
      leader: resolveCompatibleLeaderSlug(nextYear),
      period: resolveCompatiblePeriodSlug(nextYear),
      year: nextYear,
    })
  }

  if (variant === 'compact') {
    return (
      <section className="timeline-card timeline-card-inline">
        <p className="eyebrow">Lát cắt đang xem</p>
        <h2>Năm {year}</h2>
        <p className="timeline-copy">
          {visiblePeriod ? visiblePeriod.title : 'Chọn một năm để mở đúng bối cảnh lịch sử tương ứng.'}
        </p>

        <div className="timeline-range-grid timeline-range-grid-compact">
          <label>
            <span>Trượt để đổi năm</span>
            <input
              max={maxYear}
              min={minYear}
              onChange={(event) => setYear(Number(event.target.value))}
              onKeyUp={(event) => commitYear(Number(event.currentTarget.value))}
              onMouseUp={(event) => commitYear(Number(event.currentTarget.value))}
              onTouchEnd={(event) => commitYear(Number(event.currentTarget.value))}
              type="range"
              value={year}
            />
            <small>
              Từ {minYear} đến {maxYear}
            </small>
          </label>
        </div>

        <div className="timeline-actions timeline-actions-inline">
          <button
            className="ghost-button"
            onClick={() => {
              setYear(maxYear)
              commitYear(maxYear)
            }}
            type="button"
          >
            Năm mới nhất
          </button>
          <button
            className="ghost-button timeline-apply-button"
            onClick={() => commitYear(year)}
            type="button"
          >
            Chuyển sang năm {year}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="timeline-card timeline-card-atlas">
      <div className="timeline-header">
        <div>
          <p className="eyebrow">Mốc năm và giai đoạn</p>
          <h2>Chọn mốc năm của atlas</h2>
          <p className="timeline-copy">Kéo theo năm hoặc chạm nhanh vào một giai đoạn.</p>
        </div>
        <div className="timeline-actions">
          <button
            className="ghost-button"
            onClick={() => {
              setYear(maxYear)
              commitYear(maxYear)
            }}
            type="button"
          >
            Năm mới nhất
          </button>
          <button className="primary-button" onClick={() => commitYear(year)} type="button">
            Xem năm {year}
          </button>
        </div>
      </div>

      <div className="timeline-range-grid">
        <label>
          <span>
            Năm đang xem: <strong>{year}</strong>
          </span>
          <input
            max={maxYear}
            min={minYear}
            onChange={(event) => setYear(Number(event.target.value))}
            onKeyUp={(event) => commitYear(Number(event.currentTarget.value))}
            onMouseUp={(event) => commitYear(Number(event.currentTarget.value))}
            onTouchEnd={(event) => commitYear(Number(event.currentTarget.value))}
            type="range"
            value={year}
          />
          <small>
            Từ {minYear} đến {maxYear}
          </small>
        </label>
      </div>

      <div className="period-rail" role="list">
        {periods.map((period) => {
          const active = filters.period === period.slug

          return (
            <button
              className={active ? 'period-chip active' : 'period-chip'}
              key={period.id}
              onClick={() => {
                const nextYear = active
                  ? year
                  : Math.min(Math.max(year, period.startYear), period.endYear)

                pushState({
                  leader: resolveCompatibleLeaderSlug(nextYear),
                  period: active ? '' : period.slug,
                  year: nextYear,
                })
              }}
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
