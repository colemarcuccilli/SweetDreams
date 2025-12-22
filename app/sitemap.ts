import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // All work/portfolio project pages
  const projectPages = [
    'knoxville-carnival-coverage',
    'wake-up-blind-music-video',
    'aegis-dental-trusted-dentistry',
    'fort-wayne-carnival-recap',
    'cumberland-falls-ky-nature-showcase',
    'indianapolis-childrens-museum-ferris-wheel',
    'sliced-by-sonny-commercial',
    'vintage-fest-fort-wayne',
    'snobiz-snowcone-truck-commercial',
    'vegas-dream-travel-content',
    'nissan-warsaw-dealership',
    'brookfield-zoo-ferris-wheel',
    'fort-wayne-hyperlapse-showcase',
    'dear-lover-music-video',
    'heaven-in-fort-wayne',
    'sweet-dreams-recording-studio',
  ].map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9, // Increased priority - media is core service
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    // Add all project pages
    ...projectPages,
  ]
}
