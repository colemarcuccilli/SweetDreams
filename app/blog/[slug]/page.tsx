import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./blogPost.module.css";

type Props = {
  params: { slug: string };
};

// This will be replaced with actual blog post data later
// For now, all blog post URLs will redirect or show "coming soon"
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Blog Post | Sweet Dreams Studio Fort Wayne",
    description: "Music production insights from Sweet Dreams Studio in Fort Wayne, Indiana.",
    openGraph: {
      title: "Blog | Sweet Dreams Studio",
      description: "Music production insights from Fort Wayne's premier studio.",
      url: `https://sweetdreamsmusic.com/blog/${params.slug}`,
      type: "article",
    },
  };
}

export default function BlogPost({ params }: Props) {
  // For now, redirect to main blog page
  // Later, this will fetch and display actual blog post content
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Blog Post Coming Soon</h1>
            <p>
              We're currently building our blog. This post will be available soon!
            </p>
            <Link href="/blog" className={styles.backButton}>
              ← Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
