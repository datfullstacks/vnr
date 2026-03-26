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
  const restrictedSearchParams = restrictHomeSearchParams(resolvedSearchParams)
  const hasExplicitSlice = Object.keys(restrictedSearchParams).length > 0
  let data: Awaited<ReturnType<typeof getExplorerData>>

  try {
    data = await getExplorerData(restrictedSearchParams)

    if (!hasExplicitSlice && typeof data.snapshot.activeYear === 'number') {
      const activeYear = String(data.snapshot.activeYear)
      data = await getExplorerData({
        from: activeYear,
        to: activeYear,
        year: activeYear,
      })
    }
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
