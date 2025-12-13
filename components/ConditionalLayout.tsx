'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Nav and Footer on Dream Suite pages
  const isDreamSuite = pathname?.startsWith('/suite') || pathname?.startsWith('/profile/suite');

  if (isDreamSuite) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
