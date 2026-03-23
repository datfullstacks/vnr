import { HomeStoryPage } from '@/components/home-story-page'
import { restrictHomeSearchParams } from '@/components/explorer-helpers'
import { SiteShell } from '@/components/site-shell'
import { getExplorerData } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const { filters, snapshot } = await getExplorerData(restrictHomeSearchParams(resolvedSearchParams))

  return (
    <SiteShell>
      <HomeStoryPage filters={filters} snapshot={snapshot} />
    </SiteShell>
  )
}
