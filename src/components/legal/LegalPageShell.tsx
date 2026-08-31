import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';

export type LegalTocItem = {
  id: string;
  title: string;
};

const headingStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-text-heading)',
  marginBottom: '16px',
};

const bodyStyle: CSSProperties = {
  fontSize: '1rem',
  lineHeight: 1.8,
  color: 'var(--color-text-secondary)',
};

const listStyle: CSSProperties = {
  marginTop: '12px',
  paddingLeft: '24px',
  color: 'var(--color-text-secondary)',
  lineHeight: 1.8,
};

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: '48px' }}>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </section>
  );
}

export function LegalP({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <p style={{ ...bodyStyle, ...style }}>{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul style={listStyle}>{children}</ul>;
}

export default function LegalPageShell({
  title,
  updated,
  toc,
  children,
}: {
  title: string;
  updated: string;
  toc: LegalTocItem[];
  children: ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, #EEF1F4 100%)',
          padding: '64px 0 48px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site">
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              marginBottom: '12px',
            }}
          >
            {title}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
            最后更新时间：{updated}
          </p>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
          }}
        >
          <div style={{ maxWidth: '280px' }}>
            <div
              style={{
                position: 'sticky',
                top: '100px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '16px',
                }}
              >
                目录
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {toc.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div style={{ maxWidth: '720px' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
