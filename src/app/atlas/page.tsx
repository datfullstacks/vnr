import { AtlasExplorerPage } from '@/components/atlas-explorer-page'
import { SiteShell } from '@/components/site-shell'
import { getExplorerData } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function AtlasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { filters, snapshot } = await getExplorerData(await searchParams)

  return (
    <SiteShell>
      <AtlasExplorerPage filters={filters} snapshot={snapshot} />
    </SiteShell>
  )
}
