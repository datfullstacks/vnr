import { PartyHistoryGame } from '@/components/party-history-game'
import { PublicDataErrorState } from '@/components/public-data-error-state'
import { SiteShell } from '@/components/site-shell'
import { getPartyHistoryGame } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function GamePage() {
  try {
    const game = await getPartyHistoryGame()

    return (
      <SiteShell>
        <PartyHistoryGame game={game} />
      </SiteShell>
    )
  } catch (error) {
    return (
      <SiteShell>
        <PublicDataErrorState
          context="Route game cần dữ liệu câu hỏi và leaderboard live từ vnr-be để mở bảng xếp hạng thời gian thực."
          error={error}
          title="Không thể mở game lịch sử Đảng"
        />
      </SiteShell>
    )
  }
}
