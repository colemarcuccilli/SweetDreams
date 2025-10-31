import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Solutions | Sweet Dreams Studio Fort Wayne",
  description: "Comprehensive music production services in Fort Wayne: recording, mixing, mastering, beat production, videography, and brand development. Professional studio services for artists and creators.",
  keywords: "music production services Fort Wayne, mixing and mastering, beat production, music videos Fort Wayne, brand development, comprehensive studio services, audio post-production Indiana",
  alternates: {
    canonical: 'https://sweetdreamsmusic.com/solutions',
  },
  openGraph: {
    title: "Services | Sweet Dreams Studio Fort Wayne",
    description: "Recording, mixing, mastering, beats, videos, and brand development services in Fort Wayne, Indiana.",
    url: "https://sweetdreamsmusic.com/solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Sweet Dreams Studio",
    description: "Comprehensive music production services in Fort Wayne",
  },
  other: {
    'geo.region': 'US-IN',
    'geo.placename': 'Fort Wayne',
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
