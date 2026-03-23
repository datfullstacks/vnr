import type { ExplorerRecord, ExplorerSnapshot, PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

export function listForType(snapshot: ExplorerSnapshot, type: SearchState['type']): ExplorerRecord[] {
  if (type === 'events') return snapshot.events
  if (type === 'campaigns') return snapshot.campaigns
  if (type === 'places') return snapshot.places
  return [...snapshot.events, ...snapshot.campaigns, ...snapshot.places]
}

export function resolveActiveYear(snapshot: ExplorerSnapshot, filters: SearchState) {
  return snapshot.activeYear ?? filters.year ?? snapshot.periods.at(-1)?.endYear ?? 1975
}

export function resolveTimelineBounds(snapshot: ExplorerSnapshot) {
  return {
    maxYear: Math.max(
      ...snapshot.periods.map((period) => period.endYear),
      ...snapshot.boundaryEpochs.map((epoch) => epoch.validToYear),
    ),
    minYear: Math.min(
      ...snapshot.periods.map((period) => period.startYear),
      ...snapshot.boundaryEpochs.map((epoch) => epoch.validFromYear),
    ),
  }
}

export function resolveActivePeriod(
  snapshot: ExplorerSnapshot,
  filters: SearchState,
  activeYear: number,
) {
  if (filters.period) {
    return snapshot.periods.find((period) => period.slug === filters.period) ?? null
  }

  return snapshot.periods.find((period) => period.startYear <= activeYear && period.endYear >= activeYear) ?? null
}

export function resolvePeriodForYear(periods: PeriodRecord[], year: number) {
  return periods.find((period) => period.startYear <= year && period.endYear >= year) ?? null
}

export function buildTimeSliceHref(pathname: string, year: number, periodSlug?: string) {
  const params = new URLSearchParams({
    from: String(year),
    to: String(year),
    year: String(year),
  })

  if (periodSlug) {
    params.set('period', periodSlug)
  }

  return `${pathname}?${params.toString()}`
}

export function restrictHomeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const allowedKeys = new Set(['from', 'period', 'to', 'year'])

  return Object.fromEntries(
    Object.entries(searchParams).filter(([key, value]) => allowedKeys.has(key) && value !== undefined),
  )
}
