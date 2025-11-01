import { MetadataRoute } from 'next'

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
    sitemap: 'https://sweetdreamsmusic.com/sitemap.xml',
  }
}
