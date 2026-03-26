import { resolveBackendUrl } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const response = await fetch(`${resolveBackendUrl()}/api/public/games/party-history-rush/stream`, {
    cache: 'no-store',
    headers: {
      Accept: 'text/event-stream',
    },
  })

  if (!response.ok || !response.body) {
    return new Response('Không mở được leaderboard realtime.', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      status: response.status || 502,
    })
  }

  return new Response(response.body, {
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
    },
    status: response.status,
  })
}
