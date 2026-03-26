import type { ExplorerRecord, ExplorerSnapshot, LeaderRecord, PeriodRecord } from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

function leaderTerms(leader: LeaderRecord) {
  return leader.terms?.length
    ? leader.terms
    : [{ endYear: leader.endYear, startYear: leader.startYear }]
}

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

export function leadersForTimeSlice(
  leaders: LeaderRecord[],
  activeYear: number,
  activePeriod: PeriodRecord | null,
) {
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

export function resolveActiveLeader(
  snapshot: ExplorerSnapshot,
  filters: SearchState,
  activeYear: number,
  activePeriod?: PeriodRecord | null,
) {
  if (filters.leader) {
    return snapshot.leaders.find((leader) => leader.slug === filters.leader) ?? null
  }

  if (snapshot.activeLeader) {
    return snapshot.activeLeader
  }

  if (activePeriod?.featuredLeaderSlug) {
    return snapshot.leaders.find((leader) => leader.slug === activePeriod.featuredLeaderSlug) ?? null
  }

  if (activePeriod?.officialLeaderSlugs.length) {
    const periodLeaders = activePeriod.officialLeaderSlugs
      .map((slug) => snapshot.leaders.find((leader) => leader.slug === slug))
      .filter((leader): leader is LeaderRecord => Boolean(leader))
      .sort((left, right) => right.startYear - left.startYear)

    return periodLeaders.find((leader) => activeYear >= leader.startYear && activeYear <= leader.endYear) ?? periodLeaders[0] ?? null
  }

  if (activePeriod?.periodType === 'formation') {
    return null
  }

  const matchingLeaders = snapshot.leaders
    .filter((leader) => activeYear >= leader.startYear && activeYear <= leader.endYear)
    .sort((left, right) => right.startYear - left.startYear)

  return matchingLeaders[0] ?? null
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
  const allowedKeys = new Set(['from', 'leader', 'period', 'to', 'year'])

  return Object.fromEntries(
    Object.entries(searchParams).filter(([key, value]) => allowedKeys.has(key) && value !== undefined),
  )
}
