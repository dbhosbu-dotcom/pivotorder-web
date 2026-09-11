'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { workbenchRegisterUrl } from '@/lib/site';

const STUDIO_PLANS = [
  { name: '独立', nameEn: 'Indie', price: '¥99', featured: false },
  { name: '工作室', nameEn: 'Studio', price: '¥299', featured: true },
  { name: '机构', nameEn: 'Organization', price: '¥899', featured: false },
] as const;

const FORMULA =
  '咨询费 × 月成交单数。演示 200 元 × 5 单 = 1000 元，对照独立档 99 元/月。这是公式，不是保证接到 5 单。H5 只是留资页，客户不会自动进来。';

export default function PricingPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ paddingTop: '120px', paddingBottom: '48px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            一条咨询费，对照工作台月费
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {FORMULA}
          </p>
        </motion.div>
      </section>

      <section style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {STUDIO_PLANS.map((plan, index) => {
            const highlight = plan.featured;
            return (
              <motion.div
                key={plan.price}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                style={{
                  borderRadius: '20px',
                  border: highlight ? '2px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                  backgroundColor: highlight ? 'var(--color-bg-dark)' : 'var(--color-bg)',
                  padding: '36px 32px',
                  boxShadow: highlight ? '0 8px 40px rgba(255,215,0,0.12)' : 'none',
                }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {isZh ? plan.name : plan.nameEn}
                  </span>
                </div>
                <div style={{ marginBottom: '28px' }}>
                  <span
                    style={{
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: highlight ? '#FFFFFF' : 'var(--color-text-heading)',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      marginLeft: '6px',
                      color: highlight ? 'rgba(255,255,255,0.45)' : 'var(--color-text-muted)',
                    }}
                  >
                    /月
                  </span>
                </div>
                <a
                  href={workbenchRegisterUrl}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 0',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    backgroundColor: 'var(--color-accent)',
                    color: '#000',
                  }}
                >
                  免费搭建工作室
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          也可先体验解读质量，不是工作室主生意。
        </p>
      </footer>
    </main>
  );
}
