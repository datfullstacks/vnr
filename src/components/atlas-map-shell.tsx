'use client'

import dynamic from 'next/dynamic'

import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  OverlayRecord,
  PlaceRecord,
} from '@/lib/content-types'
import type { LayerType } from '@/lib/search-state'

const AtlasMapClient = dynamic(
  () => import('@/components/atlas-map').then((module) => module.AtlasMap),
  {
    loading: () => (
      <div aria-busy="true" className="map-shell map-shell-loading">
        <div className="map-stage">
          <div className="map-loading">
            <div className="map-loading-bar" />
            <p>Đang chuẩn bị bản đồ trình chiếu...</p>
          </div>
        </div>
        <aside className="map-aside">
          <p className="eyebrow">Chú giải bản đồ</p>
          <div className="map-loading-copy">
            Bản đồ sẽ xuất hiện ngay khi phần điều hướng sẵn sàng, để người xem thao tác nhanh trong lúc trình bày.
          </div>
        </aside>
      </div>
    ),
    ssr: false,
  },
)

export function AtlasMapShell(props: {
  activeYear: number
  boundaryEpoch: BoundaryEpochRecord | null
  campaigns: CampaignRecord[]
  events: EventRecord[]
  layer: LayerType
  overlays: OverlayRecord[]
  places: PlaceRecord[]
}) {
  return <AtlasMapClient key={`${props.activeYear}:${props.boundaryEpoch?.slug ?? 'none'}`} {...props} />
}
