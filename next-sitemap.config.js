/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sweetdreamsmusic.com',
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
      'https://sweetdreamsmusic.com/sitemap.xml',
    ],
  },

  // Custom priority and change frequency per page
  transform: async (config, path) => {
    // Priority levels based on importance
    const priorities = {
      '/': 1.0,              // Homepage - highest priority
      '/music': 0.9,         // Main booking page - very high
      '/solutions': 0.8,     // Services page - high
      '/media': 0.8,         // Media page - high
      '/blog': 0.7,          // Blog index (when created)
    }

    // Blog posts will get 0.6 priority
    const priority = path.startsWith('/blog/') && path !== '/blog'
      ? 0.6
      : (priorities[path] || 0.5)

    // Change frequency based on page type
    let changefreq = 'weekly'
    if (path === '/') changefreq = 'daily'
    if (path === '/music') changefreq = 'daily'  // Booking page changes often
    if (path.startsWith('/blog/')) changefreq = 'monthly'  // Blog posts are stable

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

    // Add any dynamic blog paths here when blog is created
    // Example:
    // const blogPosts = await getBlogPosts()
    // blogPosts.forEach(post => {
    //   result.push({
    //     loc: `/blog/${post.slug}`,
    //     changefreq: 'monthly',
    //     priority: 0.6,
    //     lastmod: post.updatedAt,
    //   })
    // })

    return result
  },
}
