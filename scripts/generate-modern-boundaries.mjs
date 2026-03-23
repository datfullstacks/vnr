import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = path.join(root, 'vietnam.svg')
const outputDir = path.join(root, 'public', 'data')
const outputPath = path.join(outputDir, 'modern-boundaries.geojson')

const svg = fs.readFileSync(svgPath, 'utf8')

const widthMatch = svg.match(/width="([^"]+)"/)
const heightMatch = svg.match(/height="([^"]+)"/)
const geoMatch = svg.match(/mapsvg:geoViewBox="([^"]+)"/)

if (!widthMatch || !heightMatch || !geoMatch) {
  throw new Error('Could not read SVG width, height, or geoViewBox.')
}

const width = Number.parseFloat(widthMatch[1])
const height = Number.parseFloat(heightMatch[1])
const [minLon, maxLat, maxLon, minLat] = geoMatch[1].split(/\s+/).map(Number)
const lonSpan = maxLon - minLon
const latSpan = maxLat - minLat

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLonLat(x, y) {
  return [minLon + (x / width) * lonSpan, maxLat - (y / height) * latSpan]
}

function parsePath(d) {
  const tokens = d.replace(/,/g, ' ').match(/[mz]|-?\d*\.?\d+/gi)

  if (!tokens) {
    return []
  }

  let index = 0
  let currentX = 0
  let currentY = 0
  const rings = []
  let ring = []

  while (index < tokens.length) {
    const token = tokens[index++]

    if (token.toLowerCase() === 'm') {
      if (ring.length > 2) {
        rings.push(ring)
      }

      const dx = Number.parseFloat(tokens[index++])
      const dy = Number.parseFloat(tokens[index++])
      currentX += dx
      currentY += dy
      ring = [[currentX, currentY]]

      while (index < tokens.length && !/[mz]/i.test(tokens[index])) {
        const lineDx = Number.parseFloat(tokens[index++])
        const lineDy = Number.parseFloat(tokens[index++])
        currentX += lineDx
        currentY += lineDy
        ring.push([currentX, currentY])
      }
    }

    if (token.toLowerCase() === 'z' && ring.length > 2) {
      rings.push(ring)
      ring = []
    }
  }

  if (ring.length > 2) {
    rings.push(ring)
  }

  return rings
}

function closeRing(ring) {
  const first = ring[0]
  const last = ring[ring.length - 1]

  if (!first || !last) {
    return ring
  }

  if (first[0] === last[0] && first[1] === last[1]) {
    return ring
  }

  return [...ring, first]
}

function bboxForRing(ring) {
  return ring.reduce(
    (bbox, [x, y]) => ({
      minX: Math.min(bbox.minX, x),
      minY: Math.min(bbox.minY, y),
      maxX: Math.max(bbox.maxX, x),
      maxY: Math.max(bbox.maxY, y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  )
}

const pathMatches = [...svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*title="([^"]+)"[^>]*id="([^"]+)"[^>]*\/>/g)]

const features = pathMatches.map((match) => {
  const [, d, title, id] = match
  const rings = parsePath(d)
  const coordinates = rings.map((ring) => [closeRing(ring).map(([x, y]) => toLonLat(x, y))])

  const bbox = bboxForRing(rings.flat())
  const [centerLon, centerLat] = toLonLat((bbox.minX + bbox.maxX) / 2, (bbox.minY + bbox.maxY) / 2)

  return {
    type: 'Feature',
    properties: {
      id,
      title,
      slug: slugify(title),
      center: [centerLon, centerLat],
    },
    geometry: {
      type: coordinates.length === 1 ? 'Polygon' : 'MultiPolygon',
      coordinates: coordinates.length === 1 ? coordinates[0] : coordinates,
    },
  }
})

const featureCollection = {
  type: 'FeatureCollection',
  name: 'modern_boundaries',
  metadata: {
    generatedFrom: 'vietnam.svg',
    generatedAt: new Date().toISOString(),
  },
  features,
}

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(featureCollection, null, 2)}\n`, 'utf8')

console.log(`Wrote ${features.length} features to ${outputPath}`)
