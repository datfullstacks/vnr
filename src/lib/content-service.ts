import type {
  CampaignRecord,
  EventRecord,
  ExplorerSnapshot,
  LeaderRecord,
  PeriodRecord,
  PlaceRecord,
  QuizRecord,
} from '@/lib/content-types'
import type { SearchState } from '@/lib/search-state'

type ExplorerDataResponse = {
  filters: SearchState
  snapshot: ExplorerSnapshot
}

type PeriodDetailResponse = ExplorerSnapshot & {
  period?: PeriodRecord
}

export type LeaderDetailResponse = ExplorerSnapshot & {
  featuredPeriods: PeriodRecord[]
  leader?: LeaderRecord
  officialPeriods: PeriodRecord[]
}

function emptySnapshot(): ExplorerSnapshot {
  return {
    adminUnits: [],
    boundaryEpochs: [],
    campaigns: [],
    events: [],
    leaders: [],
    overlays: [],
    periods: [],
    places: [],
    quizzes: [],
    sources: [],
  }
}

function resolveBackendUrl() {
  const configured = process.env.VNR_BE_URL?.trim()

  if (configured) {
    return configured.replace(/\/+$/, '')
  }

  return 'http://localhost:3001'
}

function toQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'undefined') {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item)
      }

      continue
    }

    query.set(key, value)
  }

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

async function requestJson<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${resolveBackendUrl()}${path}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new Error(
      `Khong ket noi duoc vnr-be tai ${resolveBackendUrl()}. Hay khoi dong backend hoac kiem tra VNR_BE_URL.`,
    )
  }

  if (response.status === 404) {
    throw new Error('NOT_FOUND')
  }

  if (!response.ok) {
    let message = `Backend request failed: ${response.status}`

    try {
      const body = (await response.json()) as { error?: string }

      if (body.error) {
        message = body.error
      }
    } catch {
      // Ignore invalid JSON payloads and surface the HTTP status instead.
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

export async function getExplorerSnapshot() {
  return requestJson<ExplorerSnapshot>('/api/public/snapshot')
}

export async function getExplorerData(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return requestJson<ExplorerDataResponse>(`/api/public/explorer${toQueryString(searchParams)}`)
}

export async function getPeriod(slug: string) {
  try {
    return await requestJson<PeriodDetailResponse>(`/api/public/periods/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return {
        ...emptySnapshot(),
        period: undefined,
      }
    }

    throw error
  }
}

export async function getLeaders() {
  return requestJson<LeaderRecord[]>('/api/public/leaders')
}

export async function getLeader(slug: string) {
  try {
    return await requestJson<LeaderDetailResponse>(`/api/public/leaders/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return {
        ...emptySnapshot(),
        featuredPeriods: [],
        leader: undefined,
        officialPeriods: [],
      }
    }

    throw error
  }
}

export async function getEvent(slug: string) {
  try {
    return await requestJson<EventRecord>(`/api/public/events/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return undefined
    }

    throw error
  }
}

export async function getCampaign(slug: string) {
  try {
    return await requestJson<CampaignRecord>(`/api/public/campaigns/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return undefined
    }

    throw error
  }
}

export async function getPlace(slug: string) {
  try {
    return await requestJson<PlaceRecord>(`/api/public/places/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return undefined
    }

    throw error
  }
}

export async function getQuiz(slug: string) {
  try {
    return await requestJson<QuizRecord>(`/api/public/quizzes/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return undefined
    }

    throw error
  }
}
