import { ExplorerPage } from '@/components/explorer-page'
import { SiteShell } from '@/components/site-shell'
import { getExplorerData } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { filters, snapshot } = await getExplorerData(await searchParams)

  return (
    <SiteShell>
      <ExplorerPage
        description="Từ hành trình tìm đường cứu nước, sự ra đời của Đảng, Cách mạng tháng Tám, hai cuộc kháng chiến đến thống nhất đất nước: chọn một mốc năm để theo dõi lịch sử trên cùng một dòng thời gian, bản đồ và hệ hồ sơ tư liệu."
        filters={filters}
        heading="Theo dòng lịch sử Đảng trên bản đồ Việt Nam"
        snapshot={snapshot}
      />
    </SiteShell>
  )
}
