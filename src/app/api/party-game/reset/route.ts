import { resolveBackendUrl } from '@/lib/content-service'

const RESET_TOKEN = process.env.PARTY_GAME_RESET_TOKEN?.trim() || 'vnr-party-reset-1930'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = await fetch(`${resolveBackendUrl()}/api/public/games/party-history-rush/reset`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-party-game-reset-token': RESET_TOKEN,
    },
    method: 'POST',
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json; charset=utf-8',
    },
    status: response.status,
  })
}
