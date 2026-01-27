import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book a Call | Sweet Dreams Music & Media - Free Consultation",
  description: "Schedule a free 15-minute discovery call with Sweet Dreams Music & Media. Discuss your video production, music, or creative project needs with our Fort Wayne team.",
  keywords: "book consultation, free discovery call, video production quote, music production consultation, Fort Wayne creative agency contact",
  alternates: {
    canonical: `${SITE_URL}/book`,
  },
  openGraph: {
    title: "Book a Free Discovery Call | Sweet Dreams Music & Media",
    description: "Schedule a free 15-minute call to discuss your creative project needs.",
    url: `${SITE_URL}/book`,
    type: "website",
    images: [
      {
        url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsLogo/SweetDreams3StackBlackLogo.png",
        width: 1200,
        height: 630,
        alt: "Book a Call with Sweet Dreams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Discovery Call | Sweet Dreams",
    description: "Schedule a free 15-minute call to discuss your creative project needs.",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
