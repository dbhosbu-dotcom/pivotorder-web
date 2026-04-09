'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

/* ── Explore dropdown items ── */
function useExploreItems(isZh: boolean) {
  return [
    {
      label: isZh ? '十大支柱协议' : '10-Pillar Protocol',
      sub:   isZh ? '因果代谢系统审计框架' : 'Causal metabolic audit system',
      href:  '/pillars',
      icon:  '⬡',
    },
    {
      label: isZh ? '干预方案库' : 'Solutions',
      sub:   isZh ? '循证干预路径与生命钟靶点' : 'Evidence-based intervention pathways',
      href:  '/solutions',
      icon:  '◈',
    },
    {
      label: isZh ? '科学依据' : 'The Science',
      sub:   isZh ? '方法论支柱与推断流水线' : 'Methodological pillars & inference pipeline',
      href:  '/science',
      icon:  '◉',
    },
    {
      label: isZh ? '关于我们' : 'About',
      sub:   isZh ? '独立算法平台的起源与承诺' : 'Origin, independence & our commitments',
      href:  '/about',
      icon:  '◎',
    },
  ];
}

/* ── Dropdown component ── */
function ExploreDropdown({ isZh, pathname }: { isZh: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const items = useExploreItems(isZh);

  const EXPLORE_PATHS = ['/pillars', '/solutions', '/science', '/about'];
  const isActive = EXPLORE_PATHS.some(p => pathname === p);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', paddingBottom: '16px', marginBottom: '-16px' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.9375rem',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
          paddingBottom: '4px',
          borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
          transition: 'color 0.2s, border-color 0.2s',
          padding: '0',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
        aria-expanded={open}
      >
        {isZh ? '探索' : 'Explore'}
        {/* Chevron */}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: '50%',
          width: '320px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
          padding: '8px',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transform: open
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(-8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
          zIndex: 200,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Small triangle pointer */}
        <div style={{
          position: 'absolute', top: '-6px', left: '50%',
          transform: 'translateX(-50%)',
          width: '12px', height: '6px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '10px', height: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            transform: 'rotate(45deg) translate(1px, 1px)',
            transformOrigin: 'center',
            boxShadow: '-1px -1px 2px rgba(0,0,0,0.04)',
          }} />
        </div>

        {items.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                backgroundColor: active ? 'var(--color-accent-ultra)' : 'transparent',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-subtle)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <span style={{
                fontSize: '1.1rem', lineHeight: 1, marginTop: '2px',
                color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                flexShrink: 0,
              }}>
                {item.icon}
              </span>
              <div>
                <div style={{
                  fontSize: '0.9rem', fontWeight: 600,
                  color: active ? 'var(--color-text-heading)' : 'var(--color-text-heading)',
                  marginBottom: '2px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                }}>
                  {item.sub}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const pathname              = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpenMobile, setExploreOpenMobile] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const isZh = lang === 'zh';
  const close = () => { setMobileOpen(false); setExploreOpenMobile(false); };

  /* Top-level desktop links (excluding Explore group) */
  const TOP_LINKS = [
    { label: t.nav.engine,     href: '/engine' },
    { label: t.nav.enterprise, href: '/enterprise' },
    { label: t.nav.pricing,    href: '/pricing' },
  ];

  const EXPLORE_PATHS = ['/pillars', '/solutions', '/science', '/about'];
  const exploreItems = useExploreItems(isZh);

  return (
    <>
      <header
        className="no-print"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site">
          <nav style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: '68px',
          }}>

            {/* ── Logo ── */}
            <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src="/assets/logo.png" alt="PivotOrder"
                width={160} height={36}
                style={{ height: '36px', width: 'auto' }}
                priority unoptimized
              />
            </Link>

            {/* ── Desktop nav ── */}
            <ul className="hidden md:flex" style={{
              listStyle: 'none', margin: 0, padding: 0,
              gap: '32px', alignItems: 'center',
            }}>
              {/* Home */}
              <li>
                <Link
                  href="/"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: pathname === '/' ? 600 : 400,
                    color: pathname === '/' ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    paddingBottom: '4px',
                    borderBottom: pathname === '/' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (pathname !== '/') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
                  onMouseLeave={e => { if (pathname !== '/') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
                >
                  {t.nav.home}
                </Link>
              </li>

              {/* Engine */}
              <li>
                <Link
                  href="/engine"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: pathname === '/engine' ? 600 : 400,
                    color: pathname === '/engine' ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    paddingBottom: '4px',
                    borderBottom: pathname === '/engine' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (pathname !== '/engine') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
                  onMouseLeave={e => { if (pathname !== '/engine') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
                >
                  {t.nav.engine}
                </Link>
              </li>

              {/* Explore dropdown */}
              <li>
                <ExploreDropdown isZh={isZh} pathname={pathname} />
              </li>

              {/* Enterprise */}
              <li>
                <Link
                  href="/enterprise"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: pathname === '/enterprise' ? 600 : 400,
                    color: pathname === '/enterprise' ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    paddingBottom: '4px',
                    borderBottom: pathname === '/enterprise' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (pathname !== '/enterprise') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
                  onMouseLeave={e => { if (pathname !== '/enterprise') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
                >
                  {t.nav.enterprise}
                </Link>
              </li>

              {/* Pricing */}
              <li>
                <Link
                  href="/pricing"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: pathname === '/pricing' ? 600 : 400,
                    color: pathname === '/pricing' ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    paddingBottom: '4px',
                    borderBottom: pathname === '/pricing' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (pathname !== '/pricing') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
                  onMouseLeave={e => { if (pathname !== '/pricing') (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
                >
                  {t.nav.pricing}
                </Link>
              </li>
            </ul>

            {/* ── Desktop CTA + Language ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                aria-label="Switch language"
                style={{
                  background: 'none', border: '1px solid var(--color-border)',
                  borderRadius: '6px', padding: '5px 11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)', cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
              >
                {t.nav.langLabel}
              </button>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-heading)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {t.nav.dashboard}
                  </Link>
                  <Link
                    href="/profile"
                    title={isZh ? '我的资料' : 'My Profile'}
                    style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)',
                      fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  >
                    {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </Link>
                  <Link href="/engine" className="btn-primary">
                    {isZh ? '运行分析 →' : 'Run Analysis →'}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-heading)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    {t.nav.getStarted} <span style={{ fontSize: '1rem' }}>→</span>
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                width: '36px', height: '36px', position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--color-text-heading)', borderRadius: '2px', transform: mobileOpen ? 'translateY(0) rotate(45deg)' : 'translateY(-7px)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
              <span style={{ position: 'absolute', display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--color-text-heading)', borderRadius: '2px', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s ease' }} />
              <span style={{ position: 'absolute', display: 'block', width: '22px', height: '2px', backgroundColor: 'var(--color-text-heading)', borderRadius: '2px', transform: mobileOpen ? 'translateY(0) rotate(-45deg)' : 'translateY(7px)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
            </button>
          </nav>
        </div>

        {/* ── Mobile slide-down menu ── */}
        <div
          className="md:hidden"
          style={{
            overflow: 'hidden',
            maxHeight: mobileOpen ? '700px' : '0',
            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
            borderTop: mobileOpen ? '1px solid var(--color-border)' : 'none',
            backgroundColor: 'rgba(255,255,255,0.98)',
          }}
        >
          <div style={{ padding: '8px 24px 24px' }}>
            {/* Home */}
            <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: pathname === '/' ? 600 : 400, color: pathname === '/' ? 'var(--color-text-heading)' : 'var(--color-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}>
              {pathname === '/' && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginRight: '10px' }} />}
              {t.nav.home}
            </Link>

            {/* Engine */}
            <Link href="/engine" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: pathname === '/engine' ? 600 : 400, color: pathname === '/engine' ? 'var(--color-text-heading)' : 'var(--color-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}>
              {pathname === '/engine' && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginRight: '10px' }} />}
              {t.nav.engine}
            </Link>

            {/* Explore accordion */}
            <div style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <button
                onClick={() => setExploreOpenMobile(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '13px 0',
                  fontSize: '1rem', fontWeight: EXPLORE_PATHS.some(p => pathname === p) ? 600 : 400,
                  color: EXPLORE_PATHS.some(p => pathname === p) ? 'var(--color-text-heading)' : 'var(--color-text-primary)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {EXPLORE_PATHS.some(p => pathname === p) && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />}
                  {isZh ? '探索' : 'Explore'}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: exploreOpenMobile ? 'rotate(180deg)' : 'none', color: 'var(--color-text-muted)' }}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div style={{ overflow: 'hidden', maxHeight: exploreOpenMobile ? '400px' : '0', transition: 'max-height 0.25s ease' }}>
                <div style={{ paddingBottom: '8px' }}>
                  {exploreItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '10px 12px', marginBottom: '2px',
                        borderRadius: '10px', textDecoration: 'none',
                        backgroundColor: pathname === item.href ? 'var(--color-accent-ultra)' : 'var(--color-bg-subtle)',
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: '2px' }}>{item.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <Link href="/enterprise" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: pathname === '/enterprise' ? 600 : 400, color: pathname === '/enterprise' ? 'var(--color-text-heading)' : 'var(--color-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}>
              {pathname === '/enterprise' && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginRight: '10px' }} />}
              {t.nav.enterprise}
            </Link>

            {/* Pricing */}
            <Link href="/pricing" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: pathname === '/pricing' ? 600 : 400, color: pathname === '/pricing' ? 'var(--color-text-heading)' : 'var(--color-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}>
              {pathname === '/pricing' && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginRight: '10px' }} />}
              {t.nav.pricing}
            </Link>

            {/* Language */}
            <button
              onClick={() => { toggleLanguage(); close(); }}
              style={{
                marginTop: '12px', width: '100%', padding: '11px',
                borderRadius: '8px', border: '1px solid var(--color-border)',
                backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
              }}
            >
              {isZh ? '切换至 EN' : '切换至 中文'}
            </button>

            {/* Auth */}
            {user ? (
              <>
                <Link href="/dashboard" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none', borderTop: '1px solid var(--color-border-subtle)', marginTop: '4px' }}>
                  {t.nav.dashboard}
                </Link>
                <Link href="/profile" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none', borderTop: '1px solid var(--color-border-subtle)' }}>
                  {isZh ? '我的资料' : 'My Profile'}
                </Link>
                <button onClick={() => { logout(); close(); }} style={{ marginTop: '8px', width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {isZh ? '退出登录' : 'Sign Out'}
                </button>
                <Link href="/engine" onClick={close} className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                  {isZh ? '运行分析 →' : 'Run Analysis →'}
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={close} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none', borderTop: '1px solid var(--color-border-subtle)', marginTop: '4px' }}>
                  {t.nav.signIn}
                </Link>
                <Link href="/auth/register" onClick={close} className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                  {t.nav.getStarted} →
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
