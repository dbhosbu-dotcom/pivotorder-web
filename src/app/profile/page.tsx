'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, type SavedAnalysis } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

/* ═══════════════════════════════════════════════════════════════════════
   Profile — 个人设置 + 历史报告查看
═══════════════════════════════════════════════════════════════════════ */

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '32px', height: '32px', border: '2px solid #E5E7EB', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isZh = lang === 'zh';

  const initialTab = searchParams.get('tab') === 'reports' ? 'reports' : 'settings';
  const [activeTab, setActiveTab] = useState<'settings' | 'reports'>(initialTab);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* Settings form state */
  const [name,      setName]      = useState('');
  const [birthYear, setBirthYear] = useState(1990);
  const [gender,    setGender]    = useState<'Male' | 'Female' | 'Other'>('Other');
  const [region,    setRegion]    = useState('');
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
    if (user) {
      setName(user.name);
      setBirthYear(user.birthYear);
      setGender(user.gender);
      setRegion(user.region);
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
  const FREE_QUOTA = 3;
  const remaining = user.plan === 'free' ? Math.max(0, FREE_QUOTA - user.freeAnalysesUsed) : null;

  function handleSave() {
    updateProfile({ name, birthYear, gender, region });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const genderLabel = (g: string) => {
    if (isZh) {
      if (g === 'Male') return '男性';
      if (g === 'Female') return '女性';
      return '其他';
    }
    return g;
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', backgroundColor: 'var(--color-bg-subtle)' }}>
      <div
        className="container-site profile-layout"
        style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}
      >
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
                width: '72px', height: '72px', borderRadius: '50%',
                backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)',
                fontSize: '1.375rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              {isZh ? `${age} 岁 · ${genderLabel(user.gender)}` : `${age} yrs · ${user.gender}`}
            </p>
          </div>

          {/* Quota badge */}
          {user.plan === 'free' && (
            <div style={{
              backgroundColor: remaining! > 0 ? 'rgba(255,215,0,0.08)' : 'var(--color-bg-subtle)',
              border: `1px solid ${remaining! > 0 ? 'rgba(255,215,0,0.3)' : 'var(--color-border)'}`,
              borderRadius: '10px', padding: '14px', marginBottom: '20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: remaining! > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)', letterSpacing: '0.04em', marginBottom: '4px' }}>
                {isZh ? '免费版' : 'FREE TIER'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                {isZh
                  ? remaining! > 0 ? `剩余 ${remaining} 次免费分析` : '免费次数已全部用完'
                  : remaining! > 0 ? `${remaining} free analyses left` : 'Free quota exhausted'}
              </p>
            </div>
          )}

          {/* Nav actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/engine" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
              {isZh ? '运行新分析 →' : 'Run New Analysis →'}
            </Link>
            <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              {isZh ? '账户中心' : 'Dashboard'}
            </Link>
            <button
              onClick={logout}
              style={{
                width: '100%', padding: '9px', borderRadius: '8px',
                backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
                fontSize: '0.875rem', border: '1px solid var(--color-border)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.borderColor = '#FCA5A5'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
            >
              {isZh ? '退出登录' : 'Sign Out'}
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main>
          {/* Page title */}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '24px' }}>
            {isZh ? '我的资料' : 'My Profile'}
          </h1>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0,
            backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)',
            borderRadius: '12px', padding: '4px', marginBottom: '28px', width: 'fit-content',
          }}>
            {(['settings', 'reports'] as const).map((tab) => {
              const labels = {
                settings: isZh ? '个人设置' : 'Settings',
                reports:  isZh ? '历史报告' : 'Reports',
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: activeTab === tab ? 600 : 400,
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

          {/* ── Tab: Settings ── */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '32px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '28px' }}>
                {isZh ? '基本信息' : 'Basic Information'}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                {/* Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    {isZh ? '姓名' : 'Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Birth Year */}
                <div>
                  <label style={labelStyle}>
                    {isZh ? '出生年份' : 'Birth Year'}
                  </label>
                  <input
                    type="number"
                    min={1920} max={new Date().getFullYear() - 18}
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label style={labelStyle}>
                    {isZh ? '生物性别' : 'Biological Sex'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as typeof gender)}
                    style={inputStyle}
                  >
                    <option value="Male">{isZh ? '男性' : 'Male'}</option>
                    <option value="Female">{isZh ? '女性' : 'Female'}</option>
                    <option value="Other">{isZh ? '其他 / 不愿透露' : 'Other / Prefer not to say'}</option>
                  </select>
                </div>

                {/* Region */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    {isZh ? '所在地区' : 'Region'}
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder={isZh ? '如：上海' : 'e.g. Shanghai'}
                    style={inputStyle}
                  />
                </div>

                {/* Email (read-only) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ ...labelStyle, color: 'var(--color-text-muted)' }}>
                    {isZh ? '邮箱（不可修改）' : 'Email (read-only)'}
                  </label>
                  <input type="email" value={user.email} readOnly style={{ ...inputStyle, backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', cursor: 'default' }} />
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '11px 32px', borderRadius: '8px',
                    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)',
                    fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {isZh ? '保存更改' : 'Save Changes'}
                </button>
                {saved && (
                  <span style={{ fontSize: '0.875rem', color: '#22C55E', fontWeight: 500 }}>
                    ✓ {isZh ? '已保存' : 'Saved'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Tab: Reports ── */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {isZh ? '历史分析报告' : 'Analysis Reports'} ({user.analyses.length})
                </h2>
                <Link href="/engine" style={{ fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                  + {isZh ? '新建分析' : 'New Analysis'}
                </Link>
              </div>

              {user.analyses.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF', border: '1px dashed var(--color-border)',
                  borderRadius: '12px', padding: '56px 24px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.4 }}>🧬</div>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                    {isZh ? '暂无分析报告。上传体检报告后结果将自动保存在这里。' : 'No reports yet. Your analyses will be saved here automatically.'}
                  </p>
                  <Link href="/engine" className="btn-primary">
                    {isZh ? '立即上传报告 →' : 'Upload Report →'}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {user.analyses.map((a) => (
                    <ReportCard
                      key={a.id}
                      analysis={a}
                      isZh={isZh}
                      expanded={expandedId === a.id}
                      onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr !important; }
          .profile-layout aside { position: static !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Shared field styles ───────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  backgroundColor: '#FFFFFF',
  color: 'var(--color-text-heading)',
  fontSize: '0.9375rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

/* ── ReportCard ─────────────────────────────────────────────────────── */
function ReportCard({
  analysis,
  isZh,
  expanded,
  onToggle,
}: {
  analysis: SavedAnalysis;
  isZh: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const delta = analysis.delta;
  const deltaColor = delta < 0 ? '#22C55E' : delta > 2 ? '#EF4444' : '#F59E0B';

  const riskLabel = (r: string) => {
    if (r === 'high')   return isZh ? '高风险' : 'High Risk';
    if (r === 'medium') return isZh ? '需关注' : 'Watch';
    return isZh ? '正常' : 'Normal';
  };
  const riskColor = (r: string) => r === 'high' ? '#EF4444' : r === 'medium' ? '#F59E0B' : '#22C55E';

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Card header — always visible */}
      <div
        onClick={onToggle}
        style={{
          padding: '20px 24px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Date + type */}
        <div style={{ minWidth: '110px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
            {analysis.date}
          </p>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--color-text-muted)' }}>
            {analysis.type === 'mock' ? (isZh ? '演示数据' : 'Demo') : (isZh ? '体检报告' : 'Report')}
          </span>
        </div>

        {/* Bio age */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 2px', letterSpacing: '0.02em' }}>
            {isZh ? '生物年龄' : 'Bio Age'}
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)', margin: 0 }}>
            {analysis.biologicalAge.toFixed(1)}
          </p>
        </div>

        {/* Delta */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 2px', letterSpacing: '0.02em' }}>
            {isZh ? '年龄落差' : 'Delta'}
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: deltaColor, margin: 0 }}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)} {isZh ? '岁' : 'yrs'}
          </p>
        </div>

        {/* Top flags */}
        {analysis.topFlags.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 6px', letterSpacing: '0.02em' }}>
              {isZh ? '触发标记' : 'Flags'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {analysis.topFlags.map((f, i) => (
                <span key={i} style={{ fontSize: '0.8125rem', fontFamily: '"JetBrains Mono", monospace', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '2px 7px', color: 'var(--color-text-secondary)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <div style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '1rem', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          ▾
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-subtle)' }}>

          {/* Pillar summary */}
          {analysis.pillarSummary && analysis.pillarSummary.length > 0 && (
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                {isZh ? '十大支柱风险概览' : '10-Pillar Risk Summary'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.pillarSummary.map((p) => (
                  <div key={p.caseId} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 10px', borderRadius: '6px',
                    backgroundColor: '#FFFFFF', border: `1px solid ${riskColor(p.risk)}40`,
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: riskColor(p.risk), flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                      {isZh ? p.nameZh : p.nameEn}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: riskColor(p.risk), fontWeight: 600 }}>
                      {riskLabel(p.risk)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimization plan */}
          {analysis.optimizationItems && analysis.optimizationItems.length > 0 && (
            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                {isZh ? '干预优化方案' : 'Intervention Plan'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.optimizationItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                      border: '1px solid rgba(255,215,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)',
                    }}>
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>
                        {isZh ? item.categoryZh : item.category}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                        {isZh ? item.recommendationZh : item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no detail */}
          {(!analysis.pillarSummary || analysis.pillarSummary.length === 0) &&
           (!analysis.optimizationItems || analysis.optimizationItems.length === 0) && (
            <div style={{ padding: '20px 24px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {isZh ? '此次分析无详细记录。' : 'No detailed records for this analysis.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
