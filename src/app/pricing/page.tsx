'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type Cycle = 'monthly' | 'halfyear' | 'yearly';

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
      <svg width="100" height="100" viewBox="0 0 21 21" style={{ display: 'block' }}>
        <rect x="0" y="0" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="1" y="1" width="5" height="5" fill="white" rx="0.5" />
        <rect x="2" y="2" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
        <rect x="14" y="0" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="15" y="1" width="5" height="5" fill="white" rx="0.5" />
        <rect x="16" y="2" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
        <rect x="0" y="14" width="7" height="7" fill={isWechat ? '#07C160' : '#1677FF'} rx="1" />
        <rect x="1" y="15" width="5" height="5" fill="white" rx="0.5" />
        <rect x="2" y="16" width="3" height="3" fill={isWechat ? '#07C160' : '#1677FF'} rx="0.3" />
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

const PRO_CYCLES: Record<Cycle, { price: string; period: string; periodEn: string; total: string; totalEn: string; save: string; saveEn: string }> = {
  monthly:  { price: '¥29',  period: '/月',   periodEn: '/month',     total: '¥29/月',   totalEn: '¥29/mo',     save: '',           saveEn: '' },
  halfyear: { price: '¥59',  period: '/半年', periodEn: '/6 months',  total: '¥59 半年', totalEn: '¥59/6 mo',   save: '省 ¥115',    saveEn: 'Save ¥115' },
  yearly:   { price: '¥99',  period: '/年',   periodEn: '/year',      total: '¥99/年',   totalEn: '¥99/year',   save: '省 ¥249',    saveEn: 'Save ¥249' },
};

interface PlanFeature {
  text: string;
  included: boolean;
}

export default function PricingPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [cycle, setCycle] = useState<Cycle>('yearly');
  const [showPayModal, setShowPayModal] = useState(false);

  const cycleInfo = PRO_CYCLES[cycle];

  const CYCLE_TABS = isZh
    ? [
        { key: 'monthly'  as Cycle, label: '按月',  sub: '¥29/月' },
        { key: 'halfyear' as Cycle, label: '半年',  sub: '¥59', badge: '省 ¥115' },
        { key: 'yearly'   as Cycle, label: '按年',  sub: '¥99', badge: '最划算' },
      ]
    : [
        { key: 'monthly'  as Cycle, label: 'Monthly',   sub: '¥29/mo' },
        { key: 'halfyear' as Cycle, label: '6 Months',  sub: '¥59', badge: 'Save ¥115' },
        { key: 'yearly'   as Cycle, label: 'Annual',    sub: '¥99', badge: 'Best Value' },
      ];

  const FREE_FEATURES: PlanFeature[] = isZh ? [
    { text: '3 次完整体检报告解读', included: true },
    { text: '十大代谢支柱分析', included: true },
    { text: '生物年龄评估', included: true },
    { text: '干预方案（前 3 次）', included: true },
    { text: 'PDF 报告导出', included: true },
    { text: '历史趋势追踪', included: false },
    { text: '无限次分析', included: false },
    { text: 'API 接入', included: false },
  ] : [
    { text: '3 full report analyses', included: true },
    { text: '10-Pillar metabolic audit', included: true },
    { text: 'Biological age assessment', included: true },
    { text: 'Intervention plan (first 3)', included: true },
    { text: 'PDF report export', included: true },
    { text: 'History trend tracking', included: false },
    { text: 'Unlimited analyses', included: false },
    { text: 'API access', included: false },
  ];

  const PRO_FEATURES: PlanFeature[] = isZh ? [
    { text: '无限次体检报告解读', included: true },
    { text: '十大代谢支柱分析', included: true },
    { text: '生物年龄 + 趋势图', included: true },
    { text: '个性化干预方案', included: true },
    { text: 'PDF 报告导出', included: true },
    { text: '历史趋势追踪 & 对比', included: true },
    { text: '优先算法更新', included: true },
    { text: 'API 接入', included: false },
  ] : [
    { text: 'Unlimited report analyses', included: true },
    { text: '10-Pillar metabolic audit', included: true },
    { text: 'Biological age + trend chart', included: true },
    { text: 'Personalized intervention plan', included: true },
    { text: 'PDF report export', included: true },
    { text: 'History trend tracking & comparison', included: true },
    { text: 'Priority algorithm updates', included: true },
    { text: 'API access', included: false },
  ];

  const ENT_FEATURES: PlanFeature[] = isZh ? [
    { text: 'API 批量接入', included: true },
    { text: '私有化部署', included: true },
    { text: '白标定制报告', included: true },
    { text: 'SLA 服务保障', included: true },
    { text: '专属数据仪表盘', included: true },
    { text: '科研合作协议', included: true },
    { text: '临床数据回流', included: true },
    { text: '无限席位', included: true },
  ] : [
    { text: 'Bulk API access', included: true },
    { text: 'Private deployment', included: true },
    { text: 'White-label reports', included: true },
    { text: 'SLA guarantee', included: true },
    { text: 'Dedicated data dashboard', included: true },
    { text: 'Research collaboration agreement', included: true },
    { text: 'Clinical data pipeline', included: true },
    { text: 'Unlimited seats', included: true },
  ];

  function FeatureList({ features, highlight }: { features: PlanFeature[]; highlight?: boolean }) {
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {features.map((f, j) => (
          <li key={j} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '0.875rem',
            color: f.included
              ? (highlight ? 'rgba(255,255,255,0.9)' : 'var(--color-text-primary)')
              : (highlight ? 'rgba(255,255,255,0.22)' : 'var(--color-text-muted)'),
            textDecoration: f.included ? 'none' : 'line-through',
          }}>
            <span style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: f.included
                ? (highlight ? 'rgba(255,215,0,0.18)' : 'rgba(34,197,94,0.1)')
                : 'transparent',
              border: f.included ? 'none' : `1px solid ${highlight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px',
              color: highlight ? 'var(--color-accent)' : '#22c55e',
            }}>
              {f.included ? '✓' : ''}
            </span>
            {f.text}
          </li>
        ))}
      </ul>
    );
  }

  const ctaStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '14px 0',
    borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', border: 'none', textAlign: 'center',
    textDecoration: 'none',
    backgroundColor: 'var(--color-accent)', color: '#000',
    transition: 'transform 0.15s, box-shadow 0.15s',
  };

  const ctaOutlineStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '14px 0',
    borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
    border: '1.5px solid var(--color-border)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-heading)',
    transition: 'border-color 0.15s',
  };

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '56px', textAlign: 'center' }}>
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
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {isZh
              ? '前 3 次解读完全免费，无需绑卡。选择适合自己的周期，随时可以取消。'
              : 'First 3 analyses free—no credit card required. Choose your billing cycle, cancel anytime.'}
          </p>
        </motion.div>
      </section>

      {/* Billing cycle selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <div style={{
          display: 'inline-flex', gap: '6px',
          backgroundColor: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px', padding: '6px',
        }}>
          {CYCLE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCycle(tab.key)}
              style={{
                position: 'relative',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: cycle === tab.key ? '#fff' : 'transparent',
                boxShadow: cycle === tab.key ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              }}
            >
              <span style={{
                fontSize: '0.875rem', fontWeight: 700,
                color: cycle === tab.key ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
              }}>
                {tab.label}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: cycle === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: 600,
              }}>
                {tab.sub}
              </span>
              {tab.badge && (
                <span style={{
                  position: 'absolute', top: '-10px', right: '-8px',
                  backgroundColor: tab.key === 'yearly' ? 'var(--color-accent)' : '#10b981',
                  color: tab.key === 'yearly' ? '#000' : '#fff',
                  fontSize: '9px', fontWeight: 800, letterSpacing: '0.04em',
                  padding: '2px 7px', borderRadius: '20px',
                  whiteSpace: 'nowrap',
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <section style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}>

          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            style={{
              borderRadius: '20px',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              padding: '36px 32px',
            }}
          >
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                {isZh ? '免费版' : 'Free'}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-text-heading)' }}>¥0</span>
              <span style={{ fontSize: '0.9rem', marginLeft: '6px', color: 'var(--color-text-muted)' }}>
                {isZh ? '永久' : 'forever'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {isZh ? '开始了解你的生物学数据' : 'Start understanding your biological data'}
            </p>
            <FeatureList features={FREE_FEATURES} />
            <Link href="/auth/register" style={ctaOutlineStyle}>
              {isZh ? '免费开始' : 'Get Started Free'}
            </Link>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              borderRadius: '20px',
              border: '2px solid var(--color-accent)',
              backgroundColor: 'var(--color-bg-dark)',
              padding: '36px 32px',
              position: 'relative',
              boxShadow: '0 8px 40px rgba(255,215,0,0.12)',
            }}
          >
            <div style={{
              position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-accent)', color: '#000',
              fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em',
              padding: '4px 16px', borderRadius: '40px', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {isZh ? '推荐选择' : 'RECOMMENDED'}
            </div>

            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                {isZh ? '专业版' : 'Pro'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '4px' }}>
              <div>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {cycleInfo.price}
                </span>
                <span style={{ fontSize: '0.9rem', marginLeft: '4px', color: 'rgba(255,255,255,0.45)' }}>
                  {isZh ? cycleInfo.period : cycleInfo.periodEn}
                </span>
              </div>
              {cycleInfo.save && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cycle}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      backgroundColor: 'rgba(255,215,0,0.15)',
                      color: 'var(--color-accent)',
                      fontSize: '11px', fontWeight: 800,
                      padding: '3px 10px', borderRadius: '20px',
                      border: '1px solid rgba(255,215,0,0.25)',
                      marginBottom: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isZh ? cycleInfo.save : cycleInfo.saveEn}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>

            {/* Per-month equivalent */}
            {cycle !== 'monthly' && (
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
                {cycle === 'halfyear'
                  ? (isZh ? '≈ ¥9.8/月' : '≈ ¥9.8/month')
                  : (isZh ? '≈ ¥8.25/月' : '≈ ¥8.25/month')}
              </p>
            )}

            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '24px' }}>
              {isZh ? '持续追踪，主动管理你的代谢健康' : 'Continuously track and manage your metabolic health'}
            </p>
            <FeatureList features={PRO_FEATURES} highlight />
            <button
              onClick={() => setShowPayModal(true)}
              style={ctaStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(255,215,0,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {isZh ? '立即升级 →' : 'Upgrade Now →'}
            </button>
          </motion.div>

          {/* Enterprise plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              borderRadius: '20px',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              padding: '36px 32px',
            }}
          >
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                {isZh ? '企业版' : 'Enterprise'}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-text-heading)' }}>
                {isZh ? '定制' : 'Custom'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {isZh ? '为机构、研究团队和健康管理平台定制' : 'For clinics, research teams & health platforms'}
            </p>
            <FeatureList features={ENT_FEATURES} />
            <Link href="/enterprise" style={ctaOutlineStyle}>
              {isZh ? '联系我们' : 'Contact Us'}
            </Link>
          </motion.div>
        </div>

        {/* Comparison note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '40px', textAlign: 'center',
            fontSize: '0.825rem', color: 'var(--color-text-muted)',
          }}
        >
          {isZh
            ? '专业版可随时取消，不设最低合约期。半年及年付一次性结清，到期后停止续费不再扣款。'
            : 'Pro can be cancelled anytime. Half-year and annual are one-time payments; no further charges after expiry.'}
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '80px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {(isZh ? [
            { icon: '🔒', title: '数据安全', body: '报告数据仅用于分析，不用于商业训练或第三方共享。' },
            { icon: '🔬', title: '独立算法', body: '与任何药品、保健品厂商无利益关联，结果客观中立。' },
            { icon: '💳', title: '随时取消', body: '月付可随时取消。半年/年付到期自动停止，不自动续费。' },
            { icon: '📊', title: '持续更新', body: '算法随最新研究持续迭代，订阅用户自动获得版本升级。' },
          ] : [
            { icon: '🔒', title: 'Data Security', body: 'Report data used for analysis only—never for commercial training or third-party sharing.' },
            { icon: '🔬', title: 'Independent Algorithm', body: 'No ties to pharmaceutical or supplement companies. Objective, unbiased results.' },
            { icon: '💳', title: 'Cancel Anytime', body: 'Monthly plan cancellable anytime. Half-year/annual stop automatically at expiry—no auto-renewal.' },
            { icon: '📊', title: 'Continuous Updates', body: 'Algorithm iterates with latest research. Subscribers auto-receive upgrades.' },
          ]).map((item, i) => (
            <div key={i} style={{
              padding: '24px', borderRadius: '14px',
              border: '1px solid var(--color-border-subtle)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '6px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
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
                {isZh
                  ? `专业版 · ${isZh ? cycleInfo.total : cycleInfo.totalEn}`
                  : `Pro · ${cycleInfo.totalEn}`}
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
                {isZh ? '选择支付方式' : 'Choose Payment Method'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '36px', lineHeight: 1.6 }}>
                {isZh
                  ? '扫描下方二维码完成支付，支付成功后账户自动升级。'
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

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
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
