import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PivotOrder — Decoding the Data, Restoring the Order',
  description:
    'PivotOrder is an independent medical algorithm engine for multi-omic biological age analysis and digital twin modeling. Pure compute. No product bias.',
  keywords: [
    'biological age',
    'multi-omic analysis',
    'epigenetic clock',
    'precision medicine',
    'digital twin',
    'PivotOrder',
  ],
  openGraph: {
    title: 'PivotOrder — Decoding the Data, Restoring the Order',
    description:
      'An absolutely neutral, independent medical algorithm engine. No product binding. Pure compute.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        style={{
          fontFamily:
            'var(--font-inter), "PingFang SC", "Noto Sans SC", system-ui, sans-serif',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
