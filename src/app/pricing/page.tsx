'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function QRPlaceholder({ brand }: { brand: 'wechat' | 'alipay' }) {
  const isWechat = brand === 'wechat';
  return (
    <div style={{
      width: '140px', height: '140px',
      border: '2px solid var(--color-border)',
      borderRadius: '12px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#FAFAFA',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Simulated QR grid */}
      <svg width="100" height="100" viewBox="0 0 21 21" style={{ display: 'block' }}>
        {/* Finder top-left */}
        <rect x="0" y="0" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="1" y="1" width="5" height="5" fill="white" rx="0.5" />
        <rect x="2" y="2" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
        {/* Finder top-right */}
        <rect x="14" y="0" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="15" y="1" width="5" height="5" fill="white" rx="0.5" />
        <rect x="16" y="2" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
        {/* Finder bottom-left */}
        <rect x="0" y="14" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="1" y="15" width="5" height="5" fill="white" rx="0.5" />
        <rect x="2" y="16" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
        {/* Data modules */}
        {[
          [8,0],[10,0],[12,0],[9,1],[11,1],[8,2],[12,2],[10,3],[11,3],[9,4],[12,4],
          [0,8],[2,8],[4,8],[1,9],[3,9],[0,10],[4,10],[2,11],[3,11],[1,12],[4,12],
          [8,8],[10,8],[12,8],[14,8],[16,8],[18,8],[20,8],
          [9,9],[11,9],[13,9],[15,9],[17,9],[19,9],
          [8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],
          [9,11],[13,11],[17,11],[19,11],
          [8,12],[10,12],[14,12],[16,12],[20,12],
          [9,14],[11,14],[13,14],[15,14],[17,14],[19,14],
          [8,16],[12,16],[14,16],[18,16],[20,16],
          [10,18],[12,18],[16,18],[20,18],
          [8,20],[10,20],[14,20],[16,20],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" fill={isWechat ? '#07C160' : '#1677FF'} />
        ))}
      </svg>
      <div style={{
        position: 'absolute', bottom: '8px',
        fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
        color: isWechat ? '#07C160' : '#1677FF',
      }}>
        {isWechat ? '微信支付' : '支付宝'}
      </div>
      {/* Placeholder banner */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', color: 'var(--color-text-secondary)',
        textAlign: 'center', lineHeight: 1.5, padding: '8px',
        backdropFilter: 'blur(2px)',
      }}>
        二维码<br />即将上线
      </div>
    </div>
  );
}

interface PlanFeature {
  text: string;
  included: boolean;
}

export default function PricingPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPayModal, setShowPayModal] = useState(false);

  const PLANS = isZh ? [
    {
      tier: 'free',
      badge: '免费版',
      price: '¥0',
      period: '永久',
      tagline: '开始了解你的生物学数据',
      highlight: false,
      features: [
        { text: '3 次完整体检报告解读', included: true },
        { text: '十大代谢支柱分析', included: true },
        { text: '生物年龄评估', included: true },
        { text: '干预方案（前 3 次）', included: true },
        { text: 'PDF 报告导出', included: true },
        { text: '历史趋势追踪', included: false },
        { text: '无限次分析', included: false },
        { text: 'API 接入', included: false },
      ] as PlanFeature[],
      cta: '免费开始',
      ctaHref: '/auth/register',
      ctaStyle: 'outline',
    },
    {
      tier: 'pro',
      badge: '专业版',
      price: billingCycle === 'yearly' ? '¥79' : '¥99',
      period: billingCycle === 'yearly' ? '/月（年付）' : '/月',
      tagline: '持续追踪，主动管理你的代谢健康',
      highlight: true,
      features: [
        { text: '无限次体检报告解读', included: true },
        { text: '十大代谢支柱分析', included: true },
        { text: '生物年龄评估 + 趋势图', included: true },
        { text: '个性化干预方案', included: true },
        { text: 'PDF 报告导出', included: true },
        { text: '历史趋势追踪 & 对比', included: true },
        { text: '优先算法更新', included: true },
        { text: 'API 接入', included: false },
      ] as PlanFeature[],
      cta: '立即升级',
      ctaHref: '#pay',
      ctaStyle: 'solid',
    },
    {
      tier: 'enterprise',
      badge: '企业版',
      price: '定制',
      period: '联系洽谈',
      tagline: '为机构、研究团队和健康管理平台定制',
      highlight: false,
      features: [
        { text: 'API 批量接入', included: true },
        { text: '私有化部署', included: true },
        { text: '白标定制报告', included: true },
        { text: 'SLA 服务保障', included: true },
        { text: '专属数据仪表盘', included: true },
        { text: '科研合作协议', included: true },
        { text: '临床数据回流', included: true },
        { text: '无限席位', included: true },
      ] as PlanFeature[],
      cta: '联系我们',
      ctaHref: '/enterprise',
      ctaStyle: 'outline',
    },
  ] : [
    {
      tier: 'free',
      badge: 'Free',
      price: '$0',
      period: 'forever',
      tagline: 'Start understanding your biological data',
      highlight: false,
      features: [
        { text: '3 full report analyses', included: true },
        { text: '10-Pillar metabolic audit', included: true },
        { text: 'Biological age assessment', included: true },
        { text: 'Intervention plan (first 3)', included: true },
        { text: 'PDF report export', included: true },
        { text: 'History trend tracking', included: false },
        { text: 'Unlimited analyses', included: false },
        { text: 'API access', included: false },
      ] as PlanFeature[],
      cta: 'Get Started Free',
      ctaHref: '/auth/register',
      ctaStyle: 'outline',
    },
    {
      tier: 'pro',
      badge: 'Pro',
      price: billingCycle === 'yearly' ? '$11' : '$14',
      period: billingCycle === 'yearly' ? '/mo (annual)' : '/month',
      tagline: 'Continuously track and manage your metabolic health',
      highlight: true,
      features: [
        { text: 'Unlimited report analyses', included: true },
        { text: '10-Pillar metabolic audit', included: true },
        { text: 'Biological age + trend chart', included: true },
        { text: 'Personalized intervention plan', included: true },
        { text: 'PDF report export', included: true },
        { text: 'History trend tracking & comparison', included: true },
        { text: 'Priority algorithm updates', included: true },
        { text: 'API access', included: false },
      ] as PlanFeature[],
      cta: 'Upgrade Now',
      ctaHref: '#pay',
      ctaStyle: 'solid',
    },
    {
      tier: 'enterprise',
      badge: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      tagline: 'For clinics, research teams & health platforms',
      highlight: false,
      features: [
        { text: 'Bulk API access', included: true },
        { text: 'Private deployment', included: true },
        { text: 'White-label reports', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'Dedicated data dashboard', included: true },
        { text: 'Research collaboration agreement', included: true },
        { text: 'Clinical data pipeline', included: true },
        { text: 'Unlimited seats', included: true },
      ] as PlanFeature[],
      cta: 'Contact Us',
      ctaHref: '/enterprise',
      ctaStyle: 'outline',
    },
  ];

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}
        >
          <span style={{
            display: 'inline-block', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-ultra)',
            border: '1px solid rgba(255,215,0,0.3)', borderRadius: '40px',
            padding: '5px 14px', marginBottom: '24px',
          }}>
            {isZh ? '透明定价' : 'TRANSPARENT PRICING'}
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
            color: 'var(--color-text-heading)', lineHeight: 1.15, marginBottom: '16px',
          }}>
            {isZh ? '简单、透明的定价' : 'Simple, Transparent Pricing'}
          </h1>
          <p style={{
            fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7,
          }}>
            {isZh
              ? '前 3 次体检解读完全免费，无需绑定信用卡。升级专业版，开启持续代谢健康追踪。'
              : 'First 3 report analyses are completely free—no credit card required. Upgrade to Pro for continuous metabolic health tracking.'}
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                borderRadius: '20px',
                border: plan.highlight
                  ? '2px solid var(--color-accent)'
                  : '1.5px solid var(--color-border)',
                backgroundColor: plan.highlight ? 'var(--color-bg-dark)' : 'var(--color-bg)',
                padding: '36px 32px',
                position: 'relative',
                boxShadow: plan.highlight ? '0 8px 40px rgba(255,215,0,0.12)' : 'none',
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-accent)', color: '#000',
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em',
                  padding: '4px 16px', borderRadius: '40px', textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {isZh ? '推荐选择' : 'RECOMMENDED'}
                </div>
              )}

              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: plan.highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                }}>
                  {plan.badge}
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  fontSize: '3rem', fontWeight: 900,
                  color: plan.highlight ? '#FFFFFF' : 'var(--color-text-heading)',
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '0.9rem', marginLeft: '6px',
                  color: plan.highlight ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)',
                }}>
                  {plan.period}
                </span>
              </div>

              <p style={{
                fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px',
                color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'var(--color-text-secondary)',
              }}>
                {plan.tagline}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '0.875rem',
                    color: f.included
                      ? (plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--color-text-primary)')
                      : (plan.highlight ? 'rgba(255,255,255,0.25)' : 'var(--color-text-muted)'),
                    textDecoration: f.included ? 'none' : 'line-through',
                  }}>
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: f.included
                        ? (plan.highlight ? 'rgba(255,215,0,0.2)' : 'rgba(34,197,94,0.1)')
                        : 'transparent',
                      border: f.included ? 'none' : '1px solid rgba(0,0,0,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px',
                    }}>
                      {f.included ? (plan.highlight ? '✦' : '✓') : ''}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.ctaHref === '#pay' ? (
                <button
                  onClick={() => setShowPayModal(true)}
                  style={{
                    display: 'block', width: '100%', padding: '14px 0',
                    borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', border: 'none',
                    backgroundColor: 'var(--color-accent)',
                    color: '#000',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(255,215,0,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.ctaHref}
                  style={{
                    display: 'block', width: '100%', padding: '14px 0',
                    borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                    border: plan.ctaStyle === 'outline' ? '1.5px solid var(--color-border)' : 'none',
                    backgroundColor: plan.ctaStyle === 'solid' ? 'var(--color-accent)' : 'transparent',
                    color: plan.ctaStyle === 'solid' ? '#000' : (plan.highlight ? '#fff' : 'var(--color-text-heading)'),
                  }}
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ / Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            marginTop: '80px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {(isZh ? [
            { icon: '🔒', title: '数据安全', body: '所有报告数据仅用于分析，不用于商业训练。严格遵守数据隐私规定。' },
            { icon: '🔬', title: '独立算法', body: 'PivotOrder 算法与任何药品、保健品厂商无关联，确保结果客观中立。' },
            { icon: '💳', title: '随时取消', body: '专业版订阅无最低合约期，可在任意时间取消，按月结算。' },
            { icon: '📊', title: '持续迭代', body: '算法模型定期以最新发表文献更新，订阅用户自动获得版本升级。' },
          ] : [
            { icon: '🔒', title: 'Data Security', body: 'All report data is used for analysis only—never for commercial training. Strict privacy compliance.' },
            { icon: '🔬', title: 'Independent Algorithm', body: 'PivotOrder has no ties to any drug or supplement companies, ensuring objective, unbiased results.' },
            { icon: '💳', title: 'Cancel Anytime', body: 'No minimum contract. Cancel your Pro subscription anytime, billed monthly.' },
            { icon: '📊', title: 'Continuous Updates', body: 'Algorithm models update regularly with new published research. Subscribers auto-receive upgrades.' },
          ]).map((item, i) => (
            <div key={i} style={{
              padding: '28px 24px', borderRadius: '16px',
              border: '1px solid var(--color-border-subtle)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPayModal(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: '24px',
                padding: '48px 40px',
                maxWidth: '480px', width: '100%',
                border: '1px solid var(--color-border)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'var(--color-accent-ultra)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '40px', padding: '5px 16px',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                color: 'var(--color-accent)', marginBottom: '20px',
              }}>
                {isZh ? '专业版 · ¥99/月' : 'Pro Plan · ¥99/month'}
              </div>

              <h2 style={{
                fontSize: '1.5rem', fontWeight: 800,
                color: 'var(--color-text-heading)', marginBottom: '8px',
              }}>
                {isZh ? '选择支付方式' : 'Choose Payment Method'}
              </h2>
              <p style={{
                fontSize: '0.875rem', color: 'var(--color-text-secondary)',
                marginBottom: '36px', lineHeight: 1.6,
              }}>
                {isZh
                  ? '扫描下方二维码完成支付。支付成功后账户自动升级，无需等待审核。'
                  : 'Scan the QR code below to complete payment. Account upgrades automatically after successful payment.'}
              </p>

              <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <QRPlaceholder brand="wechat" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {isZh ? '微信扫码支付' : 'WeChat Pay'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <QRPlaceholder brand="alipay" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {isZh ? '支付宝扫码支付' : 'Alipay'}
                  </span>
                </div>
              </div>

              <p style={{
                fontSize: '0.75rem', color: 'var(--color-text-muted)',
                marginBottom: '24px', lineHeight: 1.6,
              }}>
                {isZh
                  ? '支付系统即将上线。如需提前开通，请联系：contact@pivotorder.com'
                  : 'Payment system launching soon. To activate early, contact: contact@pivotorder.com'}
              </p>

              <button
                onClick={() => setShowPayModal(false)}
                style={{
                  padding: '10px 32px', borderRadius: '8px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {isZh ? '关闭' : 'Close'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
