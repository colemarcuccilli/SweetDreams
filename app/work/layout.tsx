import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Work | Sweet Dreams Music & Media - Video Production Portfolio",
  description: "Explore our portfolio of commercials, brand films, music videos, and event coverage. See why Fort Wayne businesses trust Sweet Dreams for professional video production.",
  keywords: "video production portfolio, commercial production, brand films, music videos, event videography, Fort Wayne video production examples",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Our Work | Sweet Dreams Music & Media Portfolio",
    description: "Explore our portfolio of commercials, brand films, music videos, and event coverage.",
    url: `${SITE_URL}/work`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Sweet Dreams Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Sweet Dreams Portfolio",
    description: "Explore our portfolio of commercials, brand films, music videos, and event coverage.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
