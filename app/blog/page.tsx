import type { Metadata } from "next";
import Link from "next/link";
import styles from "./blog.module.css";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog | Sweet Dreams - Creative Media Tips & Industry Insights",
  description: "Expert insights on music production, videography, web development, and social media growth. Tips and tutorials from Fort Wayne's premier creative media agency.",
  keywords: "music production blog, recording tips, video production tutorials, social media marketing tips, web development blog, Fort Wayne creative agency, videography tips, content creation guide, digital marketing insights",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Sweet Dreams Creative Media",
    description: "Tips and insights on music production, videography, web development, and social media growth from Fort Wayne's creative experts.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Creative Media Blog',
      },
    ],
  },
};

// Blog posts data - will be populated with actual blog posts
const blogPosts = [
  {
    slug: "mastering-for-spotify-vs-soundcloud-2025",
    title: "Mastering for Spotify vs. SoundCloud: What You Actually Need to Know in 2025",
    excerpt: "Stop guessing how to master for streaming platforms. Learn the exact loudness targets, codec requirements, and quality standards for Spotify and SoundCloud in 2025.",
    date: "2025-02-12",
    category: "Mastering",
    readTime: "10 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00545.webp",
    published: true,
  },
  {
    slug: "subtractive-eq-guide",
    title: "The Art of Subtractive EQ: How to Make Your Mixes Cleaner by Removing Frequencies",
    excerpt: "The secret to professional mixes isn't adding more—it's removing the right frequencies. Master the art of subtractive EQ and transform muddy mixes into clarity.",
    date: "2025-02-08",
    category: "Mixing",
    readTime: "9 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00488.webp",
    published: true,
  },
  {
    slug: "ultimate-vocal-recording-checklist",
    title: "The Ultimate Vocal Recording Checklist: 9 Steps to a Perfect Take",
    excerpt: "Master the art of vocal recording with our comprehensive 9-step checklist. From room prep to final takes, learn the professional techniques used at Sweet Dreams Studio.",
    date: "2025-01-20",
    category: "Recording",
    readTime: "10 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00530.webp",
    published: true,
  },
  {
    slug: "analog-warmth-vs-digital-clarity",
    title: "Analog Warmth vs. Digital Clarity: Which Is Right for Your Next Project?",
    excerpt: "Explore the eternal debate between analog warmth and digital precision. Discover which approach will elevate your music to the next level.",
    date: "2025-01-18",
    category: "Audio Engineering",
    readTime: "8 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0538.webp",
    published: true,
  },
  {
    slug: "5-common-mixing-mistakes",
    title: "5 Common Mixing Mistakes That Are Making Your Songs Sound Amateur",
    excerpt: "Stop sabotaging your mixes! Learn the five critical mistakes that separate amateur productions from professional-sounding tracks.",
    date: "2025-01-16",
    category: "Mixing",
    readTime: "9 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00501.webp",
    published: true,
  },
  {
    slug: "acoustic-treatment-guide",
    title: "A Beginner's Guide to Acoustic Treatment: Why Your Room Is the Most Important Instrument",
    excerpt: "Your room affects every sound you record and mix. Learn how to transform any space into a better-sounding environment with acoustic treatment basics.",
    date: "2025-01-14",
    category: "Studio Tips",
    readTime: "11 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/_DSC0617.webp",
    published: true,
  },
  {
    slug: "getting-started-in-music-production",
    title: "Getting Started in Music Production: A Beginner's Guide",
    excerpt: "Everything you need to know to begin your journey in music production, from essential gear to fundamental techniques.",
    date: "2025-01-15",
    category: "Production",
    readTime: "8 min read",
    image: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/general/studio/DSC00496.webp",
    published: false,
  },
];

export default function BlogPage() {
  // Filter to only show published posts
  const publishedPosts = blogPosts.filter(post => post.published);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>BLOG</h1>
          <p className={styles.heroSubtitle}>
            Music Production Tips, Recording Techniques & Industry Insights
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          {publishedPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Coming Soon</p>
              <p className={styles.emptySubtext}>
                We're working on bringing you valuable content about music production,
                recording techniques, and industry insights. Check back soon!
              </p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {publishedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postImage}>
                    <img src={post.image} alt={post.title} />
                    <div className={styles.postCategory}>{post.category}</div>
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.postDate}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={styles.postReadTime}>{post.readTime}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.readMore}>
                      Read Article →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.categoriesTitle}>EXPLORE BY CATEGORY</h2>
          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <h3>Production</h3>
              <p>Music production tips and workflows</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Audio Engineering</h3>
              <p>Mixing, mastering, and sound design</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Local Music</h3>
              <p>Fort Wayne music scene insights</p>
            </div>
            <div className={styles.categoryCard}>
              <h3>Studio Tips</h3>
              <p>Recording studio best practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO RECORD?</h2>
          <p className={styles.ctaText}>
            Book your session at Fort Wayne's premier recording studio
          </p>
          <Link href="/music" className={styles.ctaButton}>
            BOOK NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
