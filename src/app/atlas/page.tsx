import { AtlasExplorerPage } from '@/components/atlas-explorer-page'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getExplorerData } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function AtlasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  let data: Awaited<ReturnType<typeof getExplorerData>>

  try {
    data = await getExplorerData(await searchParams)
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Atlas cần snapshot hiện tại từ vnr-be để dựng bộ lọc, lát cắt năm và lớp bản đồ."
          error={error}
          title="Không thể tải dữ liệu atlas"
        />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <AtlasExplorerPage filters={data.filters} snapshot={data.snapshot} />
    </SiteShell>
  )
}
