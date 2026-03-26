import { resolveBackendUrl } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const response = await fetch(`${resolveBackendUrl()}/api/public/games/party-history-rush`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json; charset=utf-8',
    },
    status: response.status,
  })
}
