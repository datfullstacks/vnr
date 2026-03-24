import type { MetadataRoute } from 'next'

import { getExplorerSnapshot } from '@/lib/content-service'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL?.trim() || 'http://localhost:3000'

  let snapshot

  try {
    snapshot = await getExplorerSnapshot()
  } catch {
    return [
      { url: `${siteUrl}/` },
      { url: `${siteUrl}/atlas` },
      { url: `${siteUrl}/lanh-dao` },
    ]
  }

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/atlas` },
    { url: `${siteUrl}/lanh-dao` },
    ...snapshot.leaders.map((leader) => ({
      url: `${siteUrl}/lanh-dao/${leader.slug}`,
    })),
    ...snapshot.periods.map((period) => ({
      url: `${siteUrl}/giai-doan/${period.slug}`,
    })),
    ...snapshot.events.map((event) => ({
      url: `${siteUrl}/su-kien/${event.slug}`,
    })),
    ...snapshot.campaigns.map((campaign) => ({
      url: `${siteUrl}/chien-dich/${campaign.slug}`,
    })),
    ...snapshot.places.map((place) => ({
      url: `${siteUrl}/dia-danh/${place.slug}`,
    })),
    ...snapshot.quizzes.map((quiz) => ({
      url: `${siteUrl}/quiz/${quiz.slug}`,
    })),
  ]
}
