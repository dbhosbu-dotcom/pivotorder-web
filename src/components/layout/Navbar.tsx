'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'The Engine', href: '/engine' },
  { label: 'Solutions',  href: '/solutions' },
  { label: 'Science',    href: '/science' },
  { label: 'Enterprise', href: '/enterprise' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
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
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
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

          {/* Desktop nav links */}
          <ul
            className="hidden md:flex"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: '36px',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? 'var(--color-text-heading)'
                        : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      paddingBottom: '4px',
                      borderBottom: isActive
                        ? '2px solid var(--color-accent)'
                        : '2px solid transparent',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-heading)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-secondary)';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '16px' }}>
            <Link href="/engine" className="btn-primary">
              Access Engine <span style={{ fontSize: '1rem' }}>→</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-heading)',
                  borderRadius: '2px',
                  transition: 'opacity 0.2s',
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="flex md:hidden"
            style={{
              flexDirection: 'column',
              borderTop: '1px solid var(--color-border)',
              paddingBottom: '16px',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '12px 0',
                  fontSize: '1rem',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/engine"
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{ marginTop: '16px', justifyContent: 'center' }}
            >
              Access Engine →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
