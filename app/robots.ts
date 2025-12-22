import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/api/*', '/admin/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/api/*', '/admin/*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/profile', '/profile/*', '/api/*', '/admin/*'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
