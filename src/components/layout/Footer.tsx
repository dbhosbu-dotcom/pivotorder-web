import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Home',                   href: '/' },
  { label: 'The Engine',             href: '/engine' },
  { label: 'Solutions',              href: '/solutions' },
  { label: 'Science & Intelligence', href: '/science' },
  { label: 'For Enterprise',         href: '/enterprise' },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-site" style={{ paddingTop: '64px', paddingBottom: '48px' }}>

        {/* Logo + tagline */}
        <div style={{ marginBottom: '40px' }}>
          <Image
            src="/assets/logo.png"
            alt="PivotOrder"
            width={144}
            height={32}
            style={{ height: '32px', width: 'auto', marginBottom: '16px' }}
            unoptimized
          />
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}
          >
            Decoding the Data, Restoring the Order.
          </p>
          <p
            className="text-caption"
            style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            — An Independent Medical Algorithm Engine —
          </p>
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 24px',
            marginBottom: '40px',
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-border)',
            marginBottom: '28px',
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p
            className="text-caption"
            style={{ textTransform: 'none', letterSpacing: 0 }}
          >
            Research Origin: Vancouver, Canada &nbsp;·&nbsp; 49.2827° N, 123.1207° W
          </p>

          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span
              className="text-caption"
              style={{ textTransform: 'none', letterSpacing: 0 }}
            >
              © 2025 PivotOrder. All rights reserved.
            </span>
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <Link key={item} href="#" className="footer-legal-link">
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
