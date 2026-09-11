import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { HOME_METADATA } from '@/lib/seo';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';

/* Plus Jakarta Sans — rounded humanist geometry, closest to the PivotOrder logo wordmark */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: HOME_METADATA.title,
  description: HOME_METADATA.description,
  keywords: [
    '营养师获客',
    '咨询收费',
    '白标报告',
    'H5 测评',
    '枢序健康',
    'PivotOrder',
  ],
  openGraph: {
    title: HOME_METADATA.title,
    description: HOME_METADATA.ogDescription,
    type: 'website',
    locale: 'zh_CN',
    siteName: SITE_NAME,
    url: SITE_ORIGIN,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body
        style={{
          fontFamily:
            'var(--font-sans), "PingFang SC", "Noto Sans SC", system-ui, sans-serif',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
