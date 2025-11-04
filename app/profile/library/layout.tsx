import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Library | Sweet Dreams Studio",
  description: "Access your audio files, project deliverables, and studio notes from Sweet Dreams Music Studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
