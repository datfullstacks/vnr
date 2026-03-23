import { ExplorerPage } from '@/components/explorer-page'
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
      <ExplorerPage
        description="Bản đồ này đặt sự kiện, chiến dịch, địa danh và các không gian lịch sử lên cùng một mặt nền để người đọc theo dõi cách cách mạng lan rộng, chuyển hướng và hội tụ qua từng năm."
        filters={filters}
        heading="Bản đồ lịch sử nhiều lớp"
        snapshot={snapshot}
      />
    </SiteShell>
  )
}
