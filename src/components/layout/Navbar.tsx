'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname          = usePathname();
  const [open, setOpen]   = useState(false);
  const { t, toggleLanguage } = useLanguage();

  const NAV_LINKS = [
    { label: t.nav.home,       href: '/' },
    { label: t.nav.engine,     href: '/engine' },
    { label: t.nav.solutions,  href: '/solutions' },
    { label: t.nav.science,    href: '/science' },
    { label: t.nav.enterprise, href: '/enterprise' },
  ];

  const close = () => setOpen(false);

  return (
    <>
      <header
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site">
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '68px',
            }}
          >
            {/* ── Logo ── */}
            <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src="/assets/logo.png"
                alt="PivotOrder"
                width={160}
                height={36}
                style={{ height: '36px', width: 'auto' }}
                priority
                unoptimized
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <ul
              className="hidden md:flex"
              style={{ listStyle: 'none', margin: 0, padding: 0, gap: '36px', alignItems: 'center' }}
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? 'var(--color-text-heading)' : 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        paddingBottom: '4px',
                        borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                        transition: 'color 0.2s ease, border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)';
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* ── Desktop CTA + Language toggle ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                aria-label="Switch language"
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '5px 11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                }}
              >
                {t.nav.langLabel}
              </button>

              <Link href="/engine" className="btn-primary">
                {t.nav.access} <span style={{ fontSize: '1rem' }}>→</span>
              </Link>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="flex md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '36px',
                height: '36px',
                position: 'relative',
              }}
            >
              {/* Bar 1 — rotates to top arm of X */}
              <span
                style={{
                  position: 'absolute',
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-heading)',
                  borderRadius: '2px',
                  transform: open ? 'translateY(0) rotate(45deg)' : 'translateY(-7px)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
              {/* Bar 2 — fades out */}
              <span
                style={{
                  position: 'absolute',
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-heading)',
                  borderRadius: '2px',
                  opacity: open ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              {/* Bar 3 — rotates to bottom arm of X */}
              <span
                style={{
                  position: 'absolute',
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-heading)',
                  borderRadius: '2px',
                  transform: open ? 'translateY(0) rotate(-45deg)' : 'translateY(7px)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </button>
          </nav>
        </div>

        {/* ── Mobile slide-down menu ── */}
        <div
          className="md:hidden"
          style={{
            overflow: 'hidden',
            maxHeight: open ? '480px' : '0',
            transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
            borderTop: open ? '1px solid var(--color-border)' : 'none',
            backgroundColor: 'rgba(255,255,255,0.97)',
          }}
        >
          <div style={{ padding: '8px 24px 20px' }}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '13px 0',
                    fontSize: '1rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--color-text-heading)' : 'var(--color-text-primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    gap: '10px',
                  }}
                >
                  {active && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            {/* Language toggle in mobile menu */}
            <button
              onClick={() => { toggleLanguage(); close(); }}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              {t.nav.langLabel === 'EN' ? '切换至 EN' : 'Switch to 中文'}
            </button>

            <Link
              href="/engine"
              onClick={close}
              className="btn-primary"
              style={{ marginTop: '10px', justifyContent: 'center', display: 'flex' }}
            >
              {t.nav.access} →
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
