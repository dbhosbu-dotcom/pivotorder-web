'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isZh = lang === 'zh';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (res.ok) {
      router.push('/engine');
    } else {
      setError(res.error ?? 'Login failed.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-subtle)',
        padding: '48px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '48px 40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* DNA badge */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: 'var(--color-accent-dim)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid var(--color-accent)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 8 5 8 9C8 13 12 16 12 16C12 16 16 13 16 9C16 5 12 2 12 2Z" stroke="#D4A500" strokeWidth="1.5"/>
                <path d="M12 16C12 16 8 19 8 21M12 16C12 16 16 19 16 21" stroke="#D4A500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="7" x2="15" y2="7" stroke="#D4A500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="11" x2="15" y2="11" stroke="#D4A500" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
              {isZh ? '欢迎回来' : 'Welcome back.'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              {isZh ? '登录以继续你的生物学追踪' : 'Sign in to continue tracking your biology'}
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.875rem', color: '#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)', marginBottom: '6px' }}>
                {isZh ? '邮箱' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isZh ? 'your@email.com' : 'your@email.com'}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-heading)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)', marginBottom: '6px' }}>
                {isZh ? '密码' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-heading)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 24px',
                borderRadius: '8px',
                backgroundColor: loading ? 'var(--color-accent-dim)' : 'var(--color-accent)',
                color: 'var(--color-bg-dark)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)'; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)'; }}
            >
              {loading ? (isZh ? '登录中…' : 'Signing in…') : (isZh ? '登录 →' : 'Sign In →')}
            </button>
          </form>

          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {isZh ? '还没有账户？' : "Don't have an account?"}
            </p>
            <Link
              href="/auth/register"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {isZh ? '注册——首次分析免费 →' : 'Register — First Analysis Free →'}
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          🔒 {isZh ? '数据本地处理 · PIPL & PIPEDA 合规' : 'Local processing · PIPL & PIPEDA compliant'}
        </p>
      </div>
    </div>
  );
}
