import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Sweet Dreams Studio Fort Wayne",
  description: "Music production tips, recording techniques, industry insights, and studio news from Fort Wayne's premier recording studio. Learn from professional audio engineers and producers.",
  keywords: "music production blog, recording tips, audio engineering, mixing tutorials, Fort Wayne music scene, studio tips, production techniques, music industry news",
  openGraph: {
    title: "Blog | Sweet Dreams Studio Fort Wayne",
    description: "Music production insights, recording tips, and industry news from Fort Wayne's premier studio.",
    url: "https://sweetdreamsmusic.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Sweet Dreams Studio",
    description: "Music production insights and recording tips from Fort Wayne",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
