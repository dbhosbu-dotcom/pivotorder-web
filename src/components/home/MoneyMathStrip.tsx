import Link from 'next/link';

export default function MoneyMathStrip() {
  return (
    <section
      aria-label="咨询费公式演示"
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-subtle)',
        padding: '36px 24px',
      }}
    >
      <div className="container-site" style={{ maxWidth: '860px' }}>
        <p
          className="text-caption"
          style={{
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '10px',
          }}
        >
          钱怎么算 · 公式演示
        </p>
        <p
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            marginBottom: '18px',
          }}
        >
          咨询费 × 月成交单数
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px 14px',
            marginBottom: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 2.4vw, 1.375rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
          }}
        >
          <span>200元</span>
          <span style={{ color: 'var(--color-text-muted)' }}>×</span>
          <span>5单</span>
          <span style={{ color: 'var(--color-text-muted)' }}>=</span>
          <span style={{ color: 'var(--color-accent)', backgroundColor: '#111827', padding: '4px 10px', borderRadius: '8px' }}>
            1000元
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            对照独立档 ¥99/月
          </span>
        </div>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: '640px',
            marginBottom: '8px',
          }}
        >
          公式演示，不是保证接到 5 单。H5 只是留资页，线索跟进与发送须你确认。
        </p>
        <Link
          href="/pricing"
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            textDecoration: 'none',
          }}
        >
          看工作室档位 ¥99 / ¥299 / ¥899 →
        </Link>
      </div>
    </section>
  );
}
