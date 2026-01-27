import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Sweet Dreams Music & Media - Fort Wayne Creative Agency",
  description: "Learn about Sweet Dreams Music & Media, Fort Wayne's premier creative agency. Founded by Jay Valleo, we specialize in video production, music, and digital media services.",
  keywords: "about Sweet Dreams, Fort Wayne creative agency, Jay Valleo, video production company, music production studio, Fort Wayne media",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us | Sweet Dreams Music & Media",
    description: "Fort Wayne's premier creative agency specializing in video production, music, and digital media services.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Sweet Dreams Music & Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Sweet Dreams Music & Media",
    description: "Fort Wayne's premier creative agency specializing in video production, music, and digital media.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
