import type { MetadataRoute } from 'next'

import { getExplorerSnapshot } from '@/lib/content-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getExplorerSnapshot()

  return [
    { url: 'http://localhost:3000/' },
    { url: 'http://localhost:3000/atlas' },
    ...snapshot.periods.map((period) => ({
      url: `http://localhost:3000/giai-doan/${period.slug}`,
    })),
    ...snapshot.events.map((event) => ({
      url: `http://localhost:3000/su-kien/${event.slug}`,
    })),
    ...snapshot.campaigns.map((campaign) => ({
      url: `http://localhost:3000/chien-dich/${campaign.slug}`,
    })),
    ...snapshot.places.map((place) => ({
      url: `http://localhost:3000/dia-danh/${place.slug}`,
    })),
    ...snapshot.quizzes.map((quiz) => ({
      url: `http://localhost:3000/quiz/${quiz.slug}`,
    })),
  ]
}
