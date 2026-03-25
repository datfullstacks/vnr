'use client'

import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Position } from 'geojson'
import maplibregl, {
  type LngLatBoundsLike,
  type Map,
  type MapGeoJSONFeature,
  type StyleSpecification,
} from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'

import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  OverlayRecord,
  PlaceRecord,
} from '@/lib/content-types'
import type { LayerType } from '@/lib/search-state'

type SelectedFeature = {
  accentColor: string
  feature: Feature<Geometry, GeoJsonProperties>
  href?: string
  kindLabel: string
  meta?: string
  summary: string
  title: string
}

const MAP_COLORS = {
  campaign: '#9d6b33',
  hoverLine: '#74513a',
  ink: '#1f1712',
  parchment: '#efe2c6',
  place: '#6a3824',
  red: '#8f1f1b',
  sea: '#1f4f73',
  stroke: '#f8edd8',
} as const

const VIETNAM_BOUNDS = [
  [99.6, 6.2],
  [115.8, 24.6],
] satisfies LngLatBoundsLike

const INTERACTIVE_LAYER_IDS = [
  'archipelago-points-layer',
  'historical-admin-fill',
  'historical-overlays-fill',
  'historical-overlays-line',
  'historical-overlays-point',
  'record-points-layer',
] as const

const archipelagoFeatures: FeatureCollection = {
  features: [
    {
      geometry: {
        coordinates: [112.25, 16.55],
        type: 'Point',
      },
      properties: {
        color: MAP_COLORS.sea,
        kind: 'archipelago',
        regionLabel: 'Biển Đông',
        summary:
          'Quần đảo Hoàng Sa được thêm như một lớp tham chiếu ngoài khơi để bản đồ công khai không bỏ trống phần lãnh thổ biển đảo.',
        title: 'Quần đảo Hoàng Sa',
      },
      type: 'Feature',
    },
    {
      geometry: {
        coordinates: [114.15, 10.35],
        type: 'Point',
      },
      properties: {
        color: MAP_COLORS.sea,
        kind: 'archipelago',
        regionLabel: 'Biển Đông',
        summary:
          'Quần đảo Trường Sa được hiển thị như một mốc tham chiếu ngoài khơi để giữ đầy đủ ngữ cảnh không gian biển đảo trên atlas.',
        title: 'Quần đảo Trường Sa',
      },
      type: 'Feature',
    },
  ],
  type: 'FeatureCollection',
}

const blankStyle: StyleSpecification = {
  layers: [
    {
      id: 'background',
      paint: {
        'background-color': MAP_COLORS.parchment,
      },
      type: 'background',
    },
  ],
  sources: {},
  version: 8,
}

function clearMarkers(markers: maplibregl.Marker[]) {
  markers.forEach((marker) => marker.remove())
  markers.length = 0
}

function syncTextMarkers({
  className,
  features,
  map,
  markers,
  offset = [0, 0],
  visible,
}: {
  className: string
  features: FeatureCollection
  map: Map
  markers: maplibregl.Marker[]
  offset?: [number, number]
  visible: boolean
}) {
  clearMarkers(markers)

  if (!visible) {
    return
  }

  for (const feature of features.features) {
    if (feature.geometry?.type !== 'Point') {
      continue
    }

    const title = typeof feature.properties?.title === 'string' ? feature.properties.title.trim() : ''

    if (!title) {
      continue
    }

    const element = document.createElement('div')
    element.className = `map-label ${className}`
    element.textContent = title

    const marker = new maplibregl.Marker({
      anchor: 'center',
      element,
      offset,
    })
      .setLngLat(feature.geometry.coordinates as [number, number])
      .addTo(map)

    markers.push(marker)
  }
}

function recordFeature(
  kind: 'campaign' | 'event' | 'place',
  hrefBase: string,
  record: CampaignRecord | EventRecord | PlaceRecord,
): Feature<Geometry, GeoJsonProperties> | null {
  if (
    typeof record.modernLocation?.longitude === 'number' &&
    typeof record.modernLocation?.latitude === 'number'
  ) {
    return {
      geometry: {
        coordinates: [record.modernLocation.longitude, record.modernLocation.latitude],
        type: 'Point',
      },
      properties: {
        color:
          kind === 'event' ? MAP_COLORS.sea : kind === 'campaign' ? MAP_COLORS.campaign : MAP_COLORS.place,
        displayYear: 'displayYear' in record ? record.displayYear : undefined,
        href: `${hrefBase}/${record.slug}`,
        kind,
        periodTitle: record.period.title,
        province: record.modernLocation?.province,
        summary: record.summary,
        title: record.title,
      },
      type: 'Feature',
    }
  }

  return null
}

function emptyFeatureCollection(): FeatureCollection {
  return {
    features: [],
    type: 'FeatureCollection',
  }
}

function featureCollectionFromFeature(feature: Feature<Geometry, GeoJsonProperties> | null): FeatureCollection {
  if (!feature) {
    return emptyFeatureCollection()
  }

  return {
    features: [feature],
    type: 'FeatureCollection',
  }
}

function cloneFeature(feature: Feature<Geometry, GeoJsonProperties>): Feature<Geometry, GeoJsonProperties> {
  return {
    geometry: feature.geometry,
    properties: feature.properties ?? {},
    type: 'Feature',
  }
}

function resolveFeatureByProperty(
  collection: FeatureCollection,
  propertyKey: string,
  propertyValue: unknown,
): Feature<Geometry, GeoJsonProperties> | null {
  if (typeof propertyValue !== 'string' || !propertyValue.trim()) {
    return null
  }

  const matchedFeature = collection.features.find(
    (candidate) => candidate.properties?.[propertyKey] === propertyValue,
  ) as Feature<Geometry, GeoJsonProperties> | undefined

  return matchedFeature ? cloneFeature(matchedFeature) : null
}

function setLayerVisibility(map: Map, layerId: string, visible: boolean) {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
  }
}

function setSourceData(map: Map, sourceId: string, data: FeatureCollection) {
  const source = map.getSource(sourceId)

  if (source) {
    ;(source as maplibregl.GeoJSONSource).setData(data)
  }
}

function boundaryChangeLabel(value: unknown) {
  switch (value) {
    case 'base':
      return 'Khởi tạo'
    case 'carried':
      return 'Kế thừa'
    case 'merge':
      return 'Hợp tỉnh'
    case 'reorganized':
      return 'Tái cấu trúc'
    case 'split':
      return 'Tách tỉnh'
    default:
      return null
  }
}

function unitTypeLabel(value: unknown) {
  switch (value) {
    case 'historical_region':
      return 'Vùng lịch sử'
    case 'merged_province':
      return 'Tỉnh hợp nhất'
    case 'municipality':
      return 'Thành phố trực thuộc'
    case 'province':
      return 'Tỉnh'
    default:
      return 'Đơn vị hành chính'
  }
}

function overlayKindLabel(value: unknown) {
  switch (value) {
    case 'base':
      return 'Lớp nền lịch sử'
    case 'front':
      return 'Mặt trận'
    case 'point':
      return 'Mốc lịch sử'
    case 'region':
      return 'Vùng lịch sử'
    case 'route':
      return 'Tuyến lịch sử'
    default:
      return 'Lớp lịch sử'
  }
}

function featureKindLabel(value: unknown) {
  switch (value) {
    case 'country-reference':
      return 'Quốc gia'
    case 'event':
      return 'Sự kiện'
    case 'campaign':
      return 'Chiến dịch'
    case 'neighbor-country':
      return 'Nước láng giềng'
    case 'archipelago':
      return 'Quần đảo'
    case 'place':
      return 'Địa danh'
    case 'historical-admin-unit':
      return 'Đơn vị hành chính'
    default:
      return overlayKindLabel(value)
  }
}

function selectedMeta(properties: GeoJsonProperties | null | undefined) {
  const safeProperties = properties ?? {}
  const kind = safeProperties.kind

  if (kind === 'historical-admin-unit') {
    const provinceCount = Number(safeProperties.provinceCount)
    const changeLabel = boundaryChangeLabel(safeProperties.changeType)

    return [
      unitTypeLabel(safeProperties.unitType),
      changeLabel,
      Number.isFinite(provinceCount) ? `${provinceCount} tỉnh/thành` : null,
    ]
      .filter(Boolean)
      .join(' · ')
  }

  if (kind === 'neighbor-country') {
    return ['Nước láng giềng', 'Lớp tham chiếu khu vực'].join(' · ')
  }

  if (kind === 'country-reference') {
    return ['Quốc gia', 'Lớp tham chiếu khu vực'].join(' · ')
  }

  if (kind === 'event' || kind === 'campaign' || kind === 'place' || kind === 'archipelago') {
    return [
      featureKindLabel(kind),
      Number.isFinite(Number(safeProperties.displayYear)) ? `năm ${safeProperties.displayYear}` : null,
      typeof safeProperties.province === 'string'
        ? safeProperties.province
        : typeof safeProperties.regionLabel === 'string'
          ? safeProperties.regionLabel
          : safeProperties.periodTitle,
    ]
      .filter(Boolean)
      .join(' · ')
  }

  const validFrom =
    typeof safeProperties.validFrom === 'string' ? safeProperties.validFrom.slice(0, 4) : null
  const validTo = typeof safeProperties.validTo === 'string' ? safeProperties.validTo.slice(0, 4) : null

  return [overlayKindLabel(kind), validFrom ? `${validFrom}${validTo ? `-${validTo}` : ''}` : null]
    .filter(Boolean)
    .join(' · ')
}

function normalizeFeature(feature: MapGeoJSONFeature): Feature<Geometry, GeoJsonProperties> {
  return {
    geometry: feature.geometry as Geometry,
    properties: (feature.properties ?? {}) as GeoJsonProperties,
    type: 'Feature',
  }
}

function resolvePickedFeature(
  feature: MapGeoJSONFeature,
  collections: {
    adminBoundaries: FeatureCollection
    overlays: FeatureCollection
    records: FeatureCollection
  },
): Feature<Geometry, GeoJsonProperties> {
  const properties = feature.properties ?? {}

  if (feature.layer.id === 'historical-admin-fill') {
    return resolveFeatureByProperty(collections.adminBoundaries, 'unitSlug', properties.unitSlug) ?? normalizeFeature(feature)
  }

  if (feature.layer.id.startsWith('historical-overlays')) {
    return resolveFeatureByProperty(collections.overlays, 'overlayId', properties.overlayId) ?? normalizeFeature(feature)
  }

  if (feature.layer.id === 'record-points-layer') {
    return resolveFeatureByProperty(collections.records, 'href', properties.href) ?? normalizeFeature(feature)
  }

  return normalizeFeature(feature)
}

function featureIdentity(feature: MapGeoJSONFeature) {
  return [feature.layer.id, feature.properties?.unitSlug, feature.properties?.href, feature.properties?.title]
    .filter(Boolean)
    .join(':')
}

function extendBounds(
  position: Position,
  bounds: { maxLat: number; maxLng: number; minLat: number; minLng: number },
) {
  const longitude = Number(position[0])
  const latitude = Number(position[1])

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return
  }

  bounds.minLng = Math.min(bounds.minLng, longitude)
  bounds.maxLng = Math.max(bounds.maxLng, longitude)
  bounds.minLat = Math.min(bounds.minLat, latitude)
  bounds.maxLat = Math.max(bounds.maxLat, latitude)
}

function collectGeometryBounds(geometry: Geometry) {
  const bounds = {
    maxLat: Number.NEGATIVE_INFINITY,
    maxLng: Number.NEGATIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    minLng: Number.POSITIVE_INFINITY,
  }

  const visit = (current: Geometry) => {
    switch (current.type) {
      case 'Point':
        extendBounds(current.coordinates, bounds)
        return
      case 'MultiPoint':
      case 'LineString':
        current.coordinates.forEach((position) => extendBounds(position, bounds))
        return
      case 'MultiLineString':
      case 'Polygon':
        current.coordinates.forEach((ring) => ring.forEach((position) => extendBounds(position, bounds)))
        return
      case 'MultiPolygon':
        current.coordinates.forEach((polygon) =>
          polygon.forEach((ring) => ring.forEach((position) => extendBounds(position, bounds))),
        )
        return
      case 'GeometryCollection':
        current.geometries.forEach(visit)
        return
    }
  }

  visit(geometry)

  if (
    !Number.isFinite(bounds.minLng) ||
    !Number.isFinite(bounds.maxLng) ||
    !Number.isFinite(bounds.minLat) ||
    !Number.isFinite(bounds.maxLat)
  ) {
    return null
  }

  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ] satisfies LngLatBoundsLike
}

function mergeLngLatBounds(
  baseBounds: LngLatBoundsLike | null,
  nextBounds: LngLatBoundsLike | null,
): LngLatBoundsLike | null {
  if (!baseBounds) {
    return nextBounds
  }

  if (!nextBounds) {
    return baseBounds
  }

  const [[baseMinLng, baseMinLat], [baseMaxLng, baseMaxLat]] = baseBounds as [
    [number, number],
    [number, number],
  ]
  const [[nextMinLng, nextMinLat], [nextMaxLng, nextMaxLat]] = nextBounds as [
    [number, number],
    [number, number],
  ]

  return [
    [Math.min(baseMinLng, nextMinLng), Math.min(baseMinLat, nextMinLat)],
    [Math.max(baseMaxLng, nextMaxLng), Math.max(baseMaxLat, nextMaxLat)],
  ] satisfies LngLatBoundsLike
}

function collectFeatureCollectionBounds(collection: FeatureCollection) {
  return collection.features.reduce<LngLatBoundsLike | null>((combinedBounds, feature) => {
    if (!feature.geometry) {
      return combinedBounds
    }

    return mergeLngLatBounds(combinedBounds, collectGeometryBounds(feature.geometry))
  }, null)
}

function focusFeature(map: Map, feature: Feature<Geometry, GeoJsonProperties>) {
  if (feature.geometry.type === 'Point') {
    map.easeTo({
      center: feature.geometry.coordinates as [number, number],
      duration: 700,
      zoom: Math.max(map.getZoom(), 6.4),
    })
    return
  }

  const bounds = collectGeometryBounds(feature.geometry)

  if (!bounds) {
    return
  }

  map.fitBounds(bounds, {
    duration: 700,
    maxZoom: 7.2,
    padding: 54,
  })
}

function resetMapView(map: Map, bounds: LngLatBoundsLike = VIETNAM_BOUNDS, animated = true) {
  map.fitBounds(bounds, {
    duration: animated ? 700 : 0,
    maxZoom: 5.8,
    padding: 48,
  })
}

function pickFeature(map: Map, point: maplibregl.Point) {
  return (
    map
      .queryRenderedFeatures(point, {
        layers: [...INTERACTIVE_LAYER_IDS],
      })
      .at(0) ?? null
  )
}

function ensureInteractionLayers(map: Map, sourceId: string, prefix: string, mode: 'hover' | 'selected') {
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      data: emptyFeatureCollection(),
      type: 'geojson',
    })
  }

  if (!map.getLayer(`${prefix}-fill`)) {
    map.addLayer({
      filter: ['==', ['geometry-type'], 'Polygon'],
      id: `${prefix}-fill`,
      paint: {
        'fill-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
        'fill-opacity': mode === 'selected' ? 0.18 : 0.1,
      },
      source: sourceId,
      type: 'fill',
    })
  }

  if (!map.getLayer(`${prefix}-line`)) {
    map.addLayer({
      filter: ['!=', ['geometry-type'], 'Point'],
      id: `${prefix}-line`,
      paint: {
        'line-color': mode === 'selected' ? MAP_COLORS.ink : MAP_COLORS.hoverLine,
        'line-opacity': mode === 'selected' ? 0.95 : 0.75,
        'line-width': mode === 'selected' ? 3 : 2,
      },
      source: sourceId,
      type: 'line',
    })
  }

  if (!map.getLayer(`${prefix}-point`)) {
    map.addLayer({
      filter: ['==', ['geometry-type'], 'Point'],
      id: `${prefix}-point`,
      paint: {
        'circle-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
        'circle-radius': mode === 'selected' ? 10 : 8,
        'circle-stroke-color': MAP_COLORS.stroke,
        'circle-stroke-width': mode === 'selected' ? 3 : 2,
      },
      source: sourceId,
      type: 'circle',
    })
  }
}

function buildSelectedFeature(feature: Feature<Geometry, GeoJsonProperties>): SelectedFeature {
  const properties = feature.properties ?? {}

  return {
    accentColor: typeof properties.color === 'string' ? properties.color : MAP_COLORS.red,
    feature,
    href: typeof properties.href === 'string' ? properties.href : undefined,
    kindLabel: featureKindLabel(properties.kind),
    meta: selectedMeta(properties),
    summary:
      typeof properties.summary === 'string' && properties.summary.trim()
        ? properties.summary
        : 'Chưa có mô tả ngắn cho đối tượng này.',
    title:
      typeof properties.title === 'string' && properties.title.trim()
        ? properties.title
        : 'Chi tiết bản đồ',
  }
}

export function AtlasMap({
  activeYear,
  boundaryEpoch,
  campaigns,
  events,
  layer,
  overlays,
  places,
}: {
  activeYear: number
  boundaryEpoch: BoundaryEpochRecord | null
  campaigns: CampaignRecord[]
  events: EventRecord[]
  layer: LayerType
  overlays: OverlayRecord[]
  places: PlaceRecord[]
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const adminBoundaryFeaturesRef = useRef<FeatureCollection>(emptyFeatureCollection())
  const defaultViewBoundsRef = useRef<LngLatBoundsLike>(VIETNAM_BOUNDS)
  const overlayFeaturesRef = useRef<FeatureCollection>(emptyFeatureCollection())
  const recordFeaturesRef = useRef<FeatureCollection>(emptyFeatureCollection())
  const archipelagoLabelMarkersRef = useRef<maplibregl.Marker[]>([])
  const adminLabelMarkersRef = useRef<maplibregl.Marker[]>([])
  const hoveredFeatureKeyRef = useRef('')
  const autoFitEpochKeyRef = useRef<string | null>(null)
  const [selected, setSelected] = useState<SelectedFeature | null>(null)

  const dataSignature = [
    activeYear,
    boundaryEpoch?.slug ?? 'none',
    layer,
    events.map((record) => record.id).join(','),
    campaigns.map((record) => record.id).join(','),
    overlays.map((overlay) => overlay.id).join(','),
    places.map((record) => record.id).join(','),
  ].join('|')

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const map = new maplibregl.Map({
      center: [106.3, 16.1],
      container: containerRef.current,
      fitBoundsOptions: { padding: 36 },
      maxBounds: [
        [98.5, 4.5],
        [118.5, 25.2],
      ] satisfies LngLatBoundsLike,
      style: blankStyle,
      zoom: 4.35,
    })
    const archipelagoLabelMarkers = archipelagoLabelMarkersRef.current
    const adminLabelMarkers = adminLabelMarkersRef.current

    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      resetMapView(map, defaultViewBoundsRef.current, false)
    })

    mapRef.current = map

    return () => {
      clearMarkers(archipelagoLabelMarkers)
      clearMarkers(adminLabelMarkers)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const container = containerRef.current

    if (!map || !container) {
      return
    }

    let frame = 0

    const resizeMap = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        map.resize()
      })
    }

    resizeMap()

    const observer = new ResizeObserver(() => {
      resizeMap()
    })

    observer.observe(container)
    window.addEventListener('resize', resizeMap)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resizeMap)
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    hoveredFeatureKeyRef.current = ''
    setSourceData(map, 'hover-feature', emptyFeatureCollection())
    setSourceData(map, 'selected-feature', emptyFeatureCollection())

    const frame = requestAnimationFrame(() => {
      setSelected(null)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [dataSignature])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    let cancelled = false

    async function syncMap() {
      const activeMap = mapRef.current

      if (!activeMap) {
        return
      }

      if (!activeMap.isStyleLoaded()) {
        activeMap.once('load', () => {
          void syncMap()
        })
        return
      }

      if (cancelled || !mapRef.current) {
        return
      }

      const adminBoundaryFeatures = boundaryEpoch?.boundaryFeatures ?? emptyFeatureCollection()
      const adminLabelFeatures = boundaryEpoch?.labelFeatures ?? emptyFeatureCollection()
      const overlayFeatures: FeatureCollection = {
        features: overlays.map((overlay) => ({
          geometry: overlay.historicalGeometry as unknown as Geometry,
          properties: {
            color: overlay.color,
            href: overlay.relatedCampaign
              ? `/chien-dich/${overlay.relatedCampaign}`
              : overlay.relatedEvent
                ? `/su-kien/${overlay.relatedEvent}`
                : undefined,
            kind: overlay.layerKind,
            overlayId: overlay.id,
            opacity: overlay.opacity,
            summary: overlay.summary,
            title: overlay.title,
            validFrom: overlay.validFrom,
            validTo: overlay.validTo,
          },
          type: 'Feature',
        })),
        type: 'FeatureCollection',
      }

      const recordFeatures: FeatureCollection = {
        features: [
          ...events
            .map((record) => recordFeature('event', '/su-kien', record))
            .filter(Boolean),
          ...campaigns
            .map((record) => recordFeature('campaign', '/chien-dich', record))
            .filter(Boolean),
          ...places
            .map((record) => recordFeature('place', '/dia-danh', record))
            .filter(Boolean),
        ] as Feature<Geometry, GeoJsonProperties>[],
        type: 'FeatureCollection',
      }

      adminBoundaryFeaturesRef.current = adminBoundaryFeatures
      overlayFeaturesRef.current = overlayFeatures
      recordFeaturesRef.current = recordFeatures
      defaultViewBoundsRef.current =
        mergeLngLatBounds(collectFeatureCollectionBounds(adminBoundaryFeatures), collectFeatureCollectionBounds(archipelagoFeatures)) ??
        VIETNAM_BOUNDS

      if (activeMap.getSource('archipelago-reference')) {
        ;(activeMap.getSource('archipelago-reference') as maplibregl.GeoJSONSource).setData(
          archipelagoFeatures,
        )
      } else {
        activeMap.addSource('archipelago-reference', {
          data: archipelagoFeatures,
          type: 'geojson',
        })
        activeMap.addLayer({
          id: 'archipelago-points-layer',
          paint: {
            'circle-color': MAP_COLORS.sea,
            'circle-radius': 7,
            'circle-stroke-color': MAP_COLORS.stroke,
            'circle-stroke-width': 2,
          },
          source: 'archipelago-reference',
          type: 'circle',
        })
      }

      if (activeMap.getSource('historical-admin-boundaries')) {
        ;(activeMap.getSource('historical-admin-boundaries') as maplibregl.GeoJSONSource).setData(
          adminBoundaryFeatures,
        )
      } else {
        activeMap.addSource('historical-admin-boundaries', {
          data: adminBoundaryFeatures,
          type: 'geojson',
        })
        activeMap.addLayer({
          id: 'historical-admin-fill',
          paint: {
            'fill-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
            'fill-opacity': 0.28,
          },
          source: 'historical-admin-boundaries',
          type: 'fill',
        })
      }

      if (activeMap.getSource('historical-overlays')) {
        ;(activeMap.getSource('historical-overlays') as maplibregl.GeoJSONSource).setData(overlayFeatures)
      } else {
        activeMap.addSource('historical-overlays', { data: overlayFeatures, type: 'geojson' })
        activeMap.addLayer({
          filter: ['==', ['geometry-type'], 'Polygon'],
          id: 'historical-overlays-fill',
          paint: {
            'fill-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
            'fill-opacity': ['coalesce', ['get', 'opacity'], 0.22],
          },
          source: 'historical-overlays',
          type: 'fill',
        })
        activeMap.addLayer({
          filter: ['==', ['geometry-type'], 'LineString'],
          id: 'historical-overlays-line',
          paint: {
            'line-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
            'line-width': 3,
          },
          source: 'historical-overlays',
          type: 'line',
        })
        activeMap.addLayer({
          filter: ['==', ['geometry-type'], 'Point'],
          id: 'historical-overlays-point',
          paint: {
            'circle-color': ['coalesce', ['get', 'color'], MAP_COLORS.red],
            'circle-radius': 7,
            'circle-stroke-color': MAP_COLORS.stroke,
            'circle-stroke-width': 2,
          },
          source: 'historical-overlays',
          type: 'circle',
        })
      }

      if (activeMap.getSource('record-points')) {
        ;(activeMap.getSource('record-points') as maplibregl.GeoJSONSource).setData(recordFeatures)
      } else {
        activeMap.addSource('record-points', { data: recordFeatures, type: 'geojson' })
        activeMap.addLayer({
          id: 'record-points-layer',
          paint: {
            'circle-color': [
              'match',
              ['get', 'kind'],
              'event',
              MAP_COLORS.sea,
              'campaign',
              MAP_COLORS.campaign,
              MAP_COLORS.place,
            ],
            'circle-radius': 6,
            'circle-stroke-color': MAP_COLORS.stroke,
            'circle-stroke-width': 2,
          },
          source: 'record-points',
          type: 'circle',
        })
      }

      ensureInteractionLayers(activeMap, 'hover-feature', 'hover-feature', 'hover')
      ensureInteractionLayers(activeMap, 'selected-feature', 'selected-feature', 'selected')

      const showBoundaries = layer === 'all' || layer === 'boundaries' || layer === 'historical'
      const showHistorical = layer === 'all' || layer === 'historical'
      const showRecords = layer === 'all' || layer === 'records'

      syncTextMarkers({
        className: 'map-label-archipelago',
        features: archipelagoFeatures,
        map: activeMap,
        markers: archipelagoLabelMarkersRef.current,
        offset: [0, 18],
        visible: showBoundaries,
      })
      syncTextMarkers({
        className: 'map-label-admin',
        features: adminLabelFeatures,
        map: activeMap,
        markers: adminLabelMarkersRef.current,
        visible: showBoundaries,
      })

      setLayerVisibility(activeMap, 'archipelago-points-layer', showBoundaries)
      setLayerVisibility(activeMap, 'historical-admin-fill', showBoundaries)
      setLayerVisibility(activeMap, 'historical-overlays-fill', showHistorical)
      setLayerVisibility(activeMap, 'historical-overlays-line', showHistorical)
      setLayerVisibility(activeMap, 'historical-overlays-point', showHistorical)
      setLayerVisibility(activeMap, 'record-points-layer', showRecords)

      const nextAutoFitKey = `${boundaryEpoch?.slug ?? 'none'}:${activeYear}`

      if (autoFitEpochKeyRef.current !== nextAutoFitKey) {
        autoFitEpochKeyRef.current = nextAutoFitKey
        resetMapView(activeMap, defaultViewBoundsRef.current, false)
      }
    }

    let hoverFrame = 0
    let pendingHoverPoint: maplibregl.Point | null = null

    function flushHoverState() {
      hoverFrame = 0

      const activeMap = mapRef.current

      if (!activeMap) {
        return
      }

      const feature = pendingHoverPoint ? pickFeature(activeMap, pendingHoverPoint) : null
      const nextKey = feature ? featureIdentity(feature) : ''

      if (nextKey === hoveredFeatureKeyRef.current) {
        return
      }

      hoveredFeatureKeyRef.current = nextKey
      activeMap.getCanvas().style.cursor = feature ? 'pointer' : ''
      const resolvedFeature = feature
        ? resolvePickedFeature(feature, {
            adminBoundaries: adminBoundaryFeaturesRef.current,
            overlays: overlayFeaturesRef.current,
            records: recordFeaturesRef.current,
          })
        : null

      setSourceData(activeMap, 'hover-feature', featureCollectionFromFeature(resolvedFeature))
    }

    function handleMouseMove(event: maplibregl.MapMouseEvent) {
      pendingHoverPoint = event.point

      if (!hoverFrame) {
        hoverFrame = requestAnimationFrame(flushHoverState)
      }
    }

    function handleMouseLeave() {
      const activeMap = mapRef.current

      if (!activeMap) {
        return
      }

      pendingHoverPoint = null
      cancelAnimationFrame(hoverFrame)
      hoverFrame = 0
      hoveredFeatureKeyRef.current = ''
      activeMap.getCanvas().style.cursor = ''
      setSourceData(activeMap, 'hover-feature', emptyFeatureCollection())
    }

    function handleClick(event: maplibregl.MapMouseEvent) {
      const activeMap = mapRef.current

      if (!activeMap) {
        return
      }

      const feature = pickFeature(activeMap, event.point)

      if (!feature?.properties || !feature.geometry) {
        setSelected(null)
        setSourceData(activeMap, 'selected-feature', emptyFeatureCollection())
        return
      }

      const normalizedFeature = resolvePickedFeature(feature, {
        adminBoundaries: adminBoundaryFeaturesRef.current,
        overlays: overlayFeaturesRef.current,
        records: recordFeaturesRef.current,
      })

      setSourceData(activeMap, 'selected-feature', featureCollectionFromFeature(normalizedFeature))
      setSelected(buildSelectedFeature(normalizedFeature))
      focusFeature(activeMap, normalizedFeature)
    }

    map.on('mousemove', handleMouseMove)
    map.on('click', handleClick)
    map.getCanvasContainer().addEventListener('mouseleave', handleMouseLeave)
    void syncMap()

    return () => {
      cancelled = true
      cancelAnimationFrame(hoverFrame)
      map.off('mousemove', handleMouseMove)
      map.off('click', handleClick)
      map.getCanvasContainer().removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [activeYear, boundaryEpoch, campaigns, events, layer, overlays, places])

  function clearSelection() {
    const map = mapRef.current

    if (!map) {
      return
    }

    setSelected(null)
    setSourceData(map, 'selected-feature', emptyFeatureCollection())
  }

  function resetView() {
    const map = mapRef.current

    if (!map) {
      return
    }

    resetMapView(map, defaultViewBoundsRef.current)
  }

  return (
    <div className="map-shell">
      <div className="map-stage">
        <div className="map-canvas" ref={containerRef} />
      </div>
      <aside className="map-aside">
        <section className="map-panel">
          <p className="eyebrow">Chú giải bản đồ</p>
          <ul className="legend-list">
            <li>
              <span className="legend-swatch historical" />
              Địa giới và lớp lịch sử năm {activeYear}
            </li>
            <li>
              <span className="legend-swatch event" />
              Sự kiện lịch sử
            </li>
            <li>
              <span className="legend-swatch campaign" />
              Chiến dịch
            </li>
            <li>
              <span className="legend-swatch place" />
              Địa danh
            </li>
            <li>
              <span className="legend-swatch archipelago" />
              Hoàng Sa, Trường Sa và tham chiếu biển đảo
            </li>
          </ul>
        </section>

        <div className="map-actions">
          <button className="ghost-button" onClick={resetView} type="button">
            Về khung mặc định
          </button>
          {selected ? (
            <button className="ghost-button" onClick={clearSelection} type="button">
              Bỏ chọn
            </button>
          ) : null}
        </div>

        {selected ? (
          <section
            className="map-selection map-selection-active"
            style={{ '--selection-accent': selected.accentColor } as React.CSSProperties}
          >
            <p className="eyebrow">Hồ sơ đang chọn</p>
            <h3>{selected.title}</h3>
            <strong className="map-selection-kind">{selected.kindLabel}</strong>
            {selected.meta ? <small>{selected.meta}</small> : null}
            <p>{selected.summary}</p>
            {selected.href ? (
              <a className="inline-link" href={selected.href}>
                Mở hồ sơ chi tiết
              </a>
            ) : null}
          </section>
        ) : (
          <section className="map-selection map-selection-idle">
            <p className="eyebrow">Tương tác nhanh</p>
            <p className="map-hint">
              Rê chuột để xem highlight, nhấp vào một đơn vị hành chính, lớp lịch sử hoặc bản ghi điểm
              để tập trung khung nhìn và đọc mô tả ngắn.
            </p>
          </section>
        )}
      </aside>
    </div>
  )
}


