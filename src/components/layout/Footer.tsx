'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const COL_PRODUCT = {
    title: isZh ? '产品' : 'Product',
    links: [
      { label: isZh ? '十大支柱协议' : '10-Pillar Protocol', href: '/pillars' },
      { label: isZh ? '算力引擎' : 'The Engine', href: '/engine' },
      { label: isZh ? '干预方案' : 'Solutions', href: '/solutions' },
      { label: isZh ? '定价' : 'Pricing', href: '/pricing' },
    ],
  };

  const COL_COMPANY = {
    title: isZh ? '公司' : 'Company',
    links: [
      { label: isZh ? '关于我们' : 'About Us', href: '/about' },
      { label: isZh ? '科学依据' : 'Science', href: '/science' },
      { label: isZh ? '机构接入' : 'Enterprise', href: '/enterprise' },
      { label: isZh ? '博客' : 'Blog', href: '/blog' },
    ],
  };

  const COL_LEGAL = {
    title: isZh ? '法律' : 'Legal',
    links: [
      { label: isZh ? '隐私政策' : 'Privacy Policy', href: '/privacy' },
      { label: isZh ? '服务条款' : 'Terms of Use', href: '/terms' },
    ],
  };

  const COLUMNS = [COL_PRODUCT, COL_COMPANY, COL_LEGAL];

  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-subtle)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div className="container-site" style={{ paddingTop: '64px', paddingBottom: '48px' }}>

        {/* Top section: brand + columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) repeat(3, auto)',
          gap: '40px 48px',
          marginBottom: '48px',
          flexWrap: 'wrap',
        }}>

          {/* Brand */}
          <div>
            <Image
              src="/assets/logo.png"
              alt="PivotOrder"
              width={144}
              height={32}
              style={{ height: '32px', width: 'auto', marginBottom: '16px' }}
              unoptimized
            />
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
              lineHeight: 1.6,
            }}>
              {isZh ? '解码数据，重建代谢秩序。' : 'Decoding the Data, Restoring the Order.'}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              {isZh ? '— 独立医学算法引擎 —' : '— An Independent Medical Algorithm Engine —'}
            </p>
            <a
              href="mailto:contact@pivotorder.com"
              style={{
                fontSize: '0.825rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
              }}
            >
              contact@pivotorder.com
            </a>
          </div>

          {/* Nav columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-text-muted)', marginBottom: '16px',
              }}>
                {col.title}
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-heading)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--color-border)',
          marginBottom: '28px',
        }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0',
          }}>
            {isZh
              ? '研究起源：加拿大温哥华 · 49.2827° N, 123.1207° W'
              : 'Research Origin: Vancouver, Canada · 49.2827° N, 123.1207° W'}
          </p>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            {isZh
              ? `© 2025 PivotOrder. 保留所有权利。`
              : `© 2025 PivotOrder. All rights reserved.`}
          </p>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
