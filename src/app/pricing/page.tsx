'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { workbenchRegisterUrl } from '@/lib/site';

const STUDIO_PLANS = [
  {
    name: '独立档',
    nameEn: 'Indie',
    price: '¥99',
    blurb: '一个人开张：H5 留资页、线索跟进、白标草稿，确认后发送。',
    blurbEn: 'Solo studio: H5 lead page, follow-up, white-label draft — send after you confirm.',
    features: [
      'H5 测评留资页（不是自动私信）',
      '线索工作台与人工跟进',
      '白标健康管理参考草稿',
      '发送前确认门',
    ],
    featuresEn: [
      'H5 lead-capture page (not auto-DM)',
      'Lead workbench with human follow-up',
      'White-label health-management draft',
      'Confirm-before-send gate',
    ],
    featured: false,
  },
  {
    name: '专业档',
    nameEn: 'Pro studio',
    price: '¥299',
    blurb: '多测评与品牌模板，适合开始按咨询费拆服务包的工作室。',
    blurbEn: 'More assessments and brand templates for studios packaging consult fees.',
    features: [
      '独立档全部能力',
      '多条 H5 / 问卷入口',
      '品牌模板与署名套件',
      '报价路径与跟进草稿',
    ],
    featuresEn: [
      'Everything in Indie',
      'Multiple H5 / questionnaire entries',
      'Brand templates and signature kit',
      'Pricing path and follow-up drafts',
    ],
    featured: true,
  },
  {
    name: '机构档',
    nameEn: 'Organization',
    price: '¥899',
    blurb: '多工位协作与品牌套件，给已经在带团队的工作室。',
    blurbEn: 'Multi-seat collaboration and brand kit for studios that already run a team.',
    features: [
      '专业档全部能力',
      '多工位与权限',
      '批量白标草稿',
      '对账与开通协助',
    ],
    featuresEn: [
      'Everything in Pro studio',
      'Multi-seat permissions',
      'Batch white-label drafts',
      'Onboarding assistance',
    ],
    featured: false,
  },
] as const;

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
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent-ultra)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '40px',
              padding: '5px 14px',
              marginBottom: '24px',
            }}
          >
            {isZh ? '工作室定价' : 'STUDIO PRICING'}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            {isZh ? '先开工作室，再谈获客与收费' : 'Open the studio first, then acquire and charge'}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {isZh
              ? '独立档 ¥99 / 专业档 ¥299 / 机构档 ¥899。对照获客公式是演示，不保证成交单数。H5 只是留资页。'
              : 'Indie ¥99 / Pro studio ¥299 / Organization ¥899. The lead formula is a demo, not a promised close rate. H5 is lead capture only.'}
          </p>
        </motion.div>
      </section>

      <section style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                  position: 'relative',
                  boxShadow: highlight ? '0 8px 40px rgba(255,215,0,0.12)' : 'none',
                }}
              >
                {highlight ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-accent)',
                      color: '#000',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      padding: '4px 16px',
                      borderRadius: '40px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isZh ? '对照独立档之上' : 'NEXT STEP'}
                  </div>
                ) : null}

                <div style={{ marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {isZh ? plan.name : plan.nameEn}
                  </span>
                </div>
                <div style={{ marginBottom: '10px' }}>
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
                    {isZh ? '/月' : '/mo'}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: highlight ? 'rgba(255,255,255,0.55)' : 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                  }}
                >
                  {isZh ? plan.blurb : plan.blurbEn}
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '11px',
                  }}
                >
                  {(isZh ? plan.features : plan.featuresEn).map((feature) => (
                    <li
                      key={feature}
                      style={{
                        fontSize: '0.875rem',
                        color: highlight ? 'rgba(255,255,255,0.9)' : 'var(--color-text-primary)',
                      }}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
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
                  {isZh ? '免费搭建工作室' : 'Open a studio free'}
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div
          style={{
            borderRadius: '16px',
            border: '1px dashed var(--color-border)',
            backgroundColor: 'var(--color-bg-subtle)',
            padding: '24px 28px',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '8px',
            }}
          >
            {isZh ? '个人体验（非开张方案）' : 'Personal readout (not a studio plan)'}
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-heading)', marginBottom: '8px' }}>
            {isZh ? 'C 端读报告从 ¥29/月起，已从主推档位移出。' : 'Consumer readout from ¥29/mo is no longer the primary offer.'}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '14px' }}>
            {isZh
              ? '这是给自己看健康管理参考的入口，不是营养师获客/收费工作台。主 CTA 请用上方「免费搭建工作室」。'
              : 'This is a personal health-management reference, not the nutritionist acquire/charge workbench. Use Open a studio free above.'}
          </p>
          <Link
            href="/upload"
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              textDecoration: 'underline',
            }}
          >
            {isZh ? '了解个人读报告' : 'Personal readout details'}
          </Link>
        </div>
      </section>
    </main>
  );
}
