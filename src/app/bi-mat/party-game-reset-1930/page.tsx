import { PartyGameResetPanel } from '@/components/party-game-reset-panel'
import { SiteShell } from '@/components/site-shell'

export const dynamic = 'force-dynamic'

export default function PartyGameResetPage() {
  return (
    <SiteShell>
      <div className="page-stack">
        <PartyGameResetPanel />
      </div>
    </SiteShell>
  )
}
