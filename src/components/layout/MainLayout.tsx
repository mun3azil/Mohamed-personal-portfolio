'use client';

import Header from './Header';
import Footer from './Footer';
import { useLocale } from '@/providers/Providers';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { locale } = useLocale();

  return (
    <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
