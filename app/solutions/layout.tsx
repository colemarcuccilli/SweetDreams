import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Web Development & Social Media Growth | Sweet Dreams Fort Wayne",
  description: "Professional web development and social media marketing services in Fort Wayne. Custom website design, e-commerce development, social media strategy, content creation, and audience growth for businesses and artists.",
  keywords: "web development Fort Wayne, website design Fort Wayne, social media marketing, social media growth agency, Fort Wayne web designer, custom website development, e-commerce development, social media management Fort Wayne, digital marketing Fort Wayne, brand development, content creation services",
  alternates: {
    canonical: `${SITE_URL}/solutions`,
  },
  openGraph: {
    title: "Web Development & Social Media | Sweet Dreams Fort Wayne",
    description: "Custom websites, e-commerce solutions, and social media growth strategies for Fort Wayne businesses and artists.",
    url: `${SITE_URL}/solutions`,
    type: "website",
    images: [
      {
        url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Dreams Web Development & Social Media',
      },
    ],
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
