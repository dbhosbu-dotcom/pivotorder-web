import Link from 'next/link';

const CARDS = [
  {
    step: '01',
    title: '获客',
    body: '给考证后还没客源的人。先发出 H5 测评留资页，只收集必要信息，由你人工确认沟通。客户不会自动进来。',
  },
  {
    step: '02',
    title: '收费',
    body: '第一条付费咨询怎么成交。按咨询服务报价，写清交付物和不含什么。咨询费对照工作台月费，这是公式，不是保证单数。',
  },
  {
    step: '03',
    title: '交付',
    body: '上传材料生成白标草稿。你确认后才发送，不自动私信。报告仅供健康管理参考。',
  },
] as const;

export default function StudioFunnelSection() {
  return (
    <section
      style={{
        padding: '72px 24px 88px',
        backgroundColor: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-site" style={{ maxWidth: '960px' }}>
        <p
          className="text-caption"
          style={{
            letterSpacing: '0.08em',
            marginBottom: '12px',
            color: 'var(--color-accent)',
          }}
        >
          开张三步
        </p>
        <h2
          className="text-h3"
          style={{
            color: 'var(--color-text-heading)',
            marginBottom: '12px',
          }}
        >
          获客、收费、交付
        </h2>
        <p
          style={{
            margin: '0 0 32px',
            maxWidth: '640px',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--color-text-secondary)',
          }}
        >
          证拿到了以后，先把工作室开起来。H5 留资、咨询报价、白标报告跟进，放进同一条路径。
        </p>

        <ol
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '14px',
            listStyle: 'none',
            margin: '0 0 28px',
            padding: 0,
          }}
        >
          {CARDS.map((card) => (
            <li
              key={card.step}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '22px 20px',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {card.step}
              </p>
              <h3
                style={{
                  margin: '8px 0 10px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {card.body}
              </p>
            </li>
          ))}
        </ol>

        <Link href="/solutions" style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
          看解决方案 →
        </Link>
      </div>
    </section>
  );
}
