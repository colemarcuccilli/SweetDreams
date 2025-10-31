import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Production | Sweet Dreams Studio Fort Wayne",
  description: "Professional media production services in Fort Wayne: music videos, social media content, photography, and videography. Creative media solutions for artists and brands.",
  keywords: "media production Fort Wayne, music videos, videography Fort Wayne, social media content, photography, video production Indiana, creative media services",
  openGraph: {
    title: "Media Production | Sweet Dreams Fort Wayne",
    description: "Music videos, photography, and creative media production services in Fort Wayne, Indiana.",
    url: "https://sweetdreamsmusic.com/media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Production | Sweet Dreams Studio",
    description: "Professional media production services in Fort Wayne",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
