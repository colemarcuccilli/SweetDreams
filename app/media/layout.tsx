import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Videography & Media Production | Sweet Dreams Fort Wayne",
  description: "Professional videography and media production in Fort Wayne: music videos, commercial video production, event videography, social media content. High-quality video services for businesses and artists.",
  keywords: "Fort Wayne videographer, videography services Fort Wayne, music video production, commercial video production, event videography, video production Fort Wayne, media production Indiana, professional videographer, Fort Wayne video services, social media video content, business video production",
  alternates: {
    canonical: `${SITE_URL}/media`,
  },
  openGraph: {
    title: "Professional Videography | Sweet Dreams Fort Wayne",
    description: "High-quality videography services: music videos, commercials, events, and social media content. Fort Wayne's premier video production agency.",
    url: `${SITE_URL}/media`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Media Production',
      },
    ],
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
