import { HomeStoryPage } from '@/components/home-story-page'
import { restrictHomeSearchParams } from '@/components/explorer-helpers'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getExplorerData } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  let data: Awaited<ReturnType<typeof getExplorerData>>

  try {
    data = await getExplorerData(restrictHomeSearchParams(resolvedSearchParams))
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Trang chủ cần dữ liệu từ vnr-be để dựng lát cắt thời gian, giai đoạn và lãnh đạo."
          error={error}
          title="Không thể tải dòng thời gian công khai"
        />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <HomeStoryPage filters={data.filters} snapshot={data.snapshot} />
    </SiteShell>
  )
}
