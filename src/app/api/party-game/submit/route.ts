import { resolveBackendUrl } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const response = await fetch(`${resolveBackendUrl()}/api/public/games/party-history-rush/submit`, {
    body: await request.text(),
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
