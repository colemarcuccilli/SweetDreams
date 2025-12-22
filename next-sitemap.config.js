/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Exclude auth and profile pages from sitemap
  exclude: [
    '/profile',
    '/profile/*',
    '/api/*',
    '/(auth)/*',
    '/(auth)/login',
    '/(auth)/signup',
  ],

  // robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/api', '/(auth)'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sweetdreams.us'}/sitemap.xml`,
    ],
  },

  // Custom priority and change frequency per page
  transform: async (config, path) => {
    // Priority levels based on importance
    const priorities = {
      '/': 1.0,              // Homepage - highest priority
      '/music': 0.9,         // Music production - very high
      '/media': 0.9,         // Video production - very high (core service)
      '/solutions': 0.8,     // Web dev & social media - high
    }

    const priority = priorities[path] || 0.5

    // Change frequency based on page type
    let changefreq = 'weekly'
    if (path === '/') changefreq = 'daily'
    if (path === '/music') changefreq = 'daily'  // Booking page changes often

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },

  // Additional paths to include (useful for dynamic routes)
  additionalPaths: async (config) => {
    const result = []

    // Add all work/portfolio project pages
    const projectSlugs = [
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
    ]

    projectSlugs.forEach(slug => {
      result.push({
        loc: `/work/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
}
