import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Library Management | Sweet Dreams Studio",
  description: "Admin dashboard for managing client audio files, deliverables, and studio notes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminClientLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
