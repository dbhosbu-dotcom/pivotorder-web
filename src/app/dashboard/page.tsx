'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, type SavedAnalysis } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'history' | 'trend' | 'subscription'>('history');
  const isZh = lang === 'zh';

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const age = new Date().getFullYear() - user.birthYear;
  const FREE_QUOTA   = 3;
  const hasRemaining = user.plan !== 'free' || user.freeAnalysesUsed < FREE_QUOTA;
  const remaining    = user.plan === 'free' ? Math.max(0, FREE_QUOTA - user.freeAnalysesUsed) : null;

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: 'var(--color-bg-subtle)' }}>
      <div className="container-site" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <aside
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '28px 24px',
            position: 'sticky',
            top: '88px',
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-bg-dark)',
                fontSize: '1.25rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              {initials}
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '4px' }}>
              {user.name}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{user.email}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {isZh ? `${age} 岁 · ${user.gender === 'Male' ? '男' : user.gender === 'Female' ? '女' : '其他'}` : `${age} yrs · ${user.gender}`}
            </p>
          </div>

          {/* Subscription status */}
          <div
            style={{
              backgroundColor: user.plan === 'free' ? 'var(--color-bg-subtle)' : 'rgba(255,215,0,0.08)',
              border: user.plan === 'free' ? '1px solid var(--color-border)' : '1px solid rgba(255,215,0,0.3)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: user.plan === 'free' ? 'var(--color-text-muted)' : 'var(--color-accent)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              {user.plan === 'free' ? (isZh ? '免费版' : 'FREE TIER') : user.plan.toUpperCase()}
            </span>
            {user.plan === 'free' && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                {remaining! > 0
                  ? (isZh ? `剩余 ${remaining} 次免费分析` : `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} left`)
                  : (isZh ? '免费次数已全部用完' : 'Free quota exhausted')}
              </p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <StatBox label={isZh ? '分析次数' : 'Analyses'} value={user.analyses.length.toString()} />
            <StatBox label={isZh ? '方案' : 'Plan'} value={user.plan === 'free' ? (isZh ? '免费' : 'Free') : 'Pro'} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hasRemaining ? (
              <Link href="/engine" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                {isZh ? '运行新分析 →' : 'Run New Analysis →'}
              </Link>
            ) : (
              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-bg-dark)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveTab('subscription')}
              >
                {isZh ? '升级至专业版 →' : 'Upgrade to Pro →'}
              </button>
            )}
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isZh ? '退出登录' : 'Sign Out'}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px',
              width: 'fit-content',
            }}
          >
            {(['history', 'trend', 'subscription'] as const).map((tab) => {
              const labels: Record<string, string> = {
                history: isZh ? '历史记录' : 'History',
                trend: isZh ? '趋势分析' : 'Trends',
                subscription: isZh ? '订阅管理' : 'Subscription',
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: activeTab === tab ? 600 : 400,
                    backgroundColor: activeTab === tab ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === tab ? 'var(--color-bg-dark)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Tab: History */}
          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {isZh ? '历史分析记录' : 'Analysis History'}
                </h2>
                <Link href="/engine" style={{ fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                  {isZh ? '+ 新建分析' : '+ New Analysis'}
                </Link>
              </div>

              {user.analyses.length === 0 ? (
                <EmptyState
                  isZh={isZh}
                  message={isZh ? '暂无检测记录。上传第一份体检报告后结果将显示在这里。' : 'No records yet. Upload your first report to get started.'}
                  actionLabel={isZh ? '立即上传报告 →' : 'Upload Report →'}
                  actionHref="/engine"
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {user.analyses.map((a) => (
                    <AnalysisCard key={a.id} analysis={a} isZh={isZh} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Trend */}
          {activeTab === 'trend' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '24px' }}>
                {isZh ? '生物年龄趋势' : 'Biological Age Trend'}
              </h2>

              {user.analyses.length < 2 ? (
                <EmptyState
                  isZh={isZh}
                  message={isZh ? '累积至少 2 次检测后，生物年龄趋势图将自动呈现。' : 'At least 2 analyses are needed to display the trend chart.'}
                  actionLabel={isZh ? '上传新报告 →' : 'Upload Report →'}
                  actionHref="/engine"
                />
              ) : (
                <TrendChart analyses={user.analyses} isZh={isZh} />
              )}
            </div>
          )}

          {/* Tab: Subscription */}
          {activeTab === 'subscription' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '24px' }}>
                {isZh ? '订阅管理' : 'Subscription Management'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {[
                  {
                    name: isZh ? '免费版' : 'Free',
                    price: '¥0',
                    features: isZh ? ['3次完整分析', '十大支柱报告', '基础干预建议'] : ['3 full analyses', '10-Pillar report', 'Basic recommendations'],
                    current: user.plan === 'free',
                    cta: isZh ? '当前方案' : 'Current Plan',
                    action: null,
                  },
                  {
                    name: isZh ? '专业版' : 'Pro',
                    price: '¥99/mo',
                    features: isZh ? ['无限次分析', '历史记录追踪', '趋势分析图', '优先级干预排序'] : ['Unlimited analyses', 'History tracking', 'Trend charts', 'Priority intervention ranking'],
                    current: user.plan === 'pro',
                    cta: isZh ? '升级至专业版' : 'Upgrade to Pro',
                    action: () => alert(isZh ? '在线支付即将开放，敬请期待！' : 'Payment coming soon — stay tuned!'),
                  },
                  {
                    name: isZh ? '企业版' : 'Enterprise',
                    price: isZh ? '联系我们' : 'Contact Us',
                    features: isZh ? ['API 接入', '白标部署', '机构授权', '定制化分析'] : ['API access', 'White-label deployment', 'Institutional license', 'Custom analysis'],
                    current: user.plan === 'enterprise',
                    cta: isZh ? '咨询企业方案' : 'Inquire Enterprise',
                    action: () => router.push('/enterprise'),
                  },
                ].map((tier, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: tier.current ? 'rgba(255,215,0,0.06)' : '#FFFFFF',
                      border: tier.current ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '24px 20px',
                      position: 'relative',
                    }}
                  >
                    {tier.current && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)', fontSize: '0.6875rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {isZh ? '当前方案' : 'Current'}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '4px' }}>{tier.name}</h3>
                    <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '16px' }}>{tier.price}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tier.features.map((f, j) => (
                        <li key={j} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--color-online)', flexShrink: 0 }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={tier.action ?? undefined}
                      disabled={tier.current}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        backgroundColor: tier.current ? 'var(--color-bg-subtle)' : 'var(--color-accent)',
                        color: tier.current ? 'var(--color-text-muted)' : 'var(--color-bg-dark)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: tier.current ? 'default' : 'pointer',
                      }}
                    >
                      {tier.current ? (isZh ? '当前方案' : 'Current Plan') : tier.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container-site > div { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Subcomponents ──────────────────────────────────────────────── */

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-subtle)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
      <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>{value}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{label}</p>
    </div>
  );
}

function EmptyState({ isZh, message, actionLabel, actionHref }: { isZh: boolean; message: string; actionLabel: string; actionHref: string }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px dashed var(--color-border)', borderRadius: '12px', padding: '56px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.4 }}>🧬</div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>{message}</p>
      <Link href={actionHref} className="btn-primary">{actionLabel}</Link>
    </div>
  );
}

function AnalysisCard({ analysis, isZh }: { analysis: SavedAnalysis; isZh: boolean }) {
  const delta = analysis.delta;
  const deltaColor = delta < 0 ? '#22C55E' : delta > 2 ? '#EF4444' : '#F59E0B';

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Date + type */}
      <div style={{ minWidth: '120px' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{analysis.date}</p>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--color-text-muted)' }}>
          {analysis.type === 'mock' ? (isZh ? '演示数据' : 'Demo') : (isZh ? '体检报告' : 'Report')}
        </span>
      </div>

      {/* Bio age */}
      <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em' }}>
          {isZh ? '生物年龄' : 'Bio Age'}
        </p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)', margin: 0 }}>
          {analysis.biologicalAge.toFixed(1)}
        </p>
      </div>

      {/* Delta */}
      <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em' }}>
          {isZh ? '落差' : 'Delta'}
        </p>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: deltaColor, margin: 0 }}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} {isZh ? '岁' : 'yrs'}
        </p>
      </div>

      {/* Flags */}
      {analysis.topFlags.length > 0 && (
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 6px', letterSpacing: '0.02em' }}>
            {isZh ? '主要标记' : 'Top Flags'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {analysis.topFlags.map((f, i) => (
              <span key={i} style={{ fontSize: '0.8125rem', fontFamily: '"JetBrains Mono", monospace', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '2px 8px', color: 'var(--color-text-secondary)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrendChart({ analyses, isZh }: { analyses: SavedAnalysis[]; isZh: boolean }) {
  const sorted = [...analyses].sort((a, b) => a.date.localeCompare(b.date));
  const maxAge = Math.max(...sorted.map((a) => a.chronologicalAge));
  const minAge = Math.min(...sorted.map((a) => a.biologicalAge)) - 2;
  const range = maxAge - minAge;

  const W = 600; const H = 200; const PAD = 40;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const toY = (age: number) => PAD + chartH - ((age - minAge) / range) * chartH;
  const toX = (i: number) => PAD + (i / (sorted.length - 1)) * chartW;

  const bioPoints = sorted.map((a, i) => ({ x: toX(i), y: toY(a.biologicalAge), age: a.biologicalAge, date: a.date }));
  const bioPath = bioPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '28px', overflowX: 'auto' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: '340px' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i} x1={PAD} y1={PAD + t * chartH} x2={W - PAD} y2={PAD + t * chartH}
            stroke="#F1F3F5" strokeWidth="1" />
        ))}

        {/* Biological age line */}
        <path d={bioPath} fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Fill under line */}
        <path d={`${bioPath} L ${toX(sorted.length - 1)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`}
          fill="rgba(255,215,0,0.08)" />

        {/* Data points */}
        {bioPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#FFD700" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#4A4A4A" fontFamily="JetBrains Mono, monospace">
              {p.age.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {sorted.map((a, i) => (
          <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#B0B4BC" fontFamily="JetBrains Mono, monospace">
            {a.date.slice(5)}
          </text>
        ))}

        {/* Legend */}
        <circle cx={W - PAD - 60} cy={18} r="4" fill="#FFD700" />
        <text x={W - PAD - 52} y={22} fontSize="10" fill="#4A4A4A">
          {isZh ? '生物年龄' : 'Bio Age'}
        </text>
      </svg>
    </div>
  );
}
