'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - 18 - i);

const REGIONS_EN = ['Mainland China', 'Hong Kong / Macau / Taiwan', 'North America', 'Europe', 'Southeast Asia', 'Other'];
const REGIONS_ZH = ['中国大陆', '香港 / 澳门 / 台湾', '北美', '欧洲', '东南亚', '其他'];

export default function RegisterPage() {
  const { lang } = useLanguage();
  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    birthYear: CURRENT_YEAR - 35,
    gender: 'Other' as 'Male' | 'Female' | 'Other',
    region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(form);
    if (res.ok) {
      router.push('/engine');
    } else {
      const raw = res.error ?? '|Registration failed.';
      const parts = raw.split('|');
      setError(lang === 'zh' ? (parts[0] || parts[1]) : (parts[1] || parts[0]));
      setLoading(false);
    }
  };

  const isZh = lang === 'zh';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        backgroundColor: 'var(--color-bg-subtle)',
        alignItems: 'stretch',
      }}
    >
      {/* ── Left panel ── */}
      <div
        className="hidden md:flex"
        style={{
          width: '42%',
          backgroundColor: 'var(--color-bg-dark)',
          padding: '64px 56px',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '32px' }}>
            {isZh ? '十大代谢支柱协议' : 'THE 10-PILLAR METABOLIC PROTOCOL'}
          </p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '24px' }}>
            {isZh
              ? <>免费解读你的<br /><span style={{ color: 'var(--color-accent)' }}>第一份体检报告</span></>
              : <>Decode Your<br /><span style={{ color: 'var(--color-accent)' }}>First Report. Free.</span></>}
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            {isZh
              ? '创建账户，上传体检报告，获得完整的十大代谢支柱分析——首次完全免费。算法严格独立，不推荐任何具体产品。'
              : 'Create your account, upload your report, and receive a full 10-Pillar metabolic analysis — first time completely free. Algorithm is strictly independent, no product recommendations.'}
          </p>
        </div>

        {/* Tier comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: isZh ? '免费版' : 'Free', detail: isZh ? '3次完整分析 · 十大支柱报告' : '3 full analyses · 10-Pillar report', active: true },
            { label: isZh ? '专业版 ¥29/月起' : 'Pro from ¥29/mo', detail: isZh ? '无限次分析 · 历史追踪 · 趋势图' : 'Unlimited analyses · history · trends', active: false },
            { label: isZh ? '企业版' : 'Enterprise', detail: isZh ? 'API 接入 · 白标部署' : 'API access · white-label deployment', active: false },
          ].map((tier, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: tier.active ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                border: tier.active ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontWeight: 600, color: tier.active ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{tier.label}</span>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)' }}>{tier.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
            {isZh ? '创建你的账户' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: '36px' }}>
            {isZh ? '首次分析完全免费' : 'First analysis completely free'}
          </p>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.875rem', color: '#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Field label={isZh ? '姓名' : 'Full Name'} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={isZh ? '你的姓名' : 'Your name'}
                required
                style={inputStyle}
              />
            </Field>

            <Field label={isZh ? '邮箱' : 'Email'} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={isZh ? 'your@email.com' : 'your@email.com'}
                required
                style={inputStyle}
              />
            </Field>

            <Field label={isZh ? '密码（最少8位）' : 'Password (min 8 characters)'} required>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={8}
                style={inputStyle}
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label={isZh ? '出生年份' : 'Birth Year'} required>
                <select
                  value={form.birthYear}
                  onChange={(e) => setForm({ ...form, birthYear: Number(e.target.value) })}
                  required
                  style={inputStyle}
                >
                  {BIRTH_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </Field>

              <Field label={isZh ? '生物性别' : 'Biological Sex'} required>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                  required
                  style={inputStyle}
                >
                  <option value="Male">{isZh ? '男性' : 'Male'}</option>
                  <option value="Female">{isZh ? '女性' : 'Female'}</option>
                  <option value="Other">{isZh ? '其他' : 'Other'}</option>
                </select>
              </Field>
            </div>

            <Field label={isZh ? '所在地区' : 'Region'}>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                style={inputStyle}
              >
                <option value="">{isZh ? '选择地区（可选）' : 'Select region (optional)'}</option>
                {(isZh ? REGIONS_ZH : REGIONS_EN).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '8px',
                backgroundColor: loading ? 'var(--color-accent-dim)' : 'var(--color-accent)',
                color: 'var(--color-bg-dark)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s, transform 0.1s',
                marginTop: '4px',
              }}
            >
              {loading
                ? (isZh ? '创建账户中…' : 'Creating account…')
                : (isZh ? '创建账户并获取免费解读 →' : 'Create Account & Get Free Analysis →')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {isZh ? '已有账户？' : 'Already have an account? '}
            <Link href="/auth/login" style={{ color: 'var(--color-text-heading)', fontWeight: 600, textDecoration: 'none' }}>
              {isZh ? '点击登录 →' : 'Sign in →'}
            </Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            🔒 {isZh ? '数据本地处理 · 零个人健康信息传输 · PIPL & PIPEDA 合规' : 'Local processing · Zero PHI transmitted · PIPL & PIPEDA compliant'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)', marginBottom: '6px' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  backgroundColor: '#FFFFFF',
  fontSize: '0.9375rem',
  color: 'var(--color-text-heading)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
