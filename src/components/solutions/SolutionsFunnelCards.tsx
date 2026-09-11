import Link from 'next/link';

const CARDS = [
  {
    step: '01',
    title: '获客',
    subtitle: 'H5 测评留资',
    body: '把内容流量变成可跟进线索。发布测评或问卷，只收集必要信息，由你在 48 小时内人工确认沟通。',
    href: '/guides/nutritionist-get-clients',
    linkLabel: '阅读获客指南',
  },
  {
    step: '02',
    title: '收费',
    subtitle: '咨询报价路径',
    body: '按初诊、报告解读与跟进周期拆服务包，写清交付物和不含什么。收费对应咨询与健康管理服务。',
    href: '/guides/how-to-price-consult',
    linkLabel: '阅读收费指南',
  },
  {
    step: '03',
    title: '交付',
    subtitle: '白标报告 + 确认门',
    body: '上传材料生成可编辑白标草稿，带工作室 Logo 与署名。你确认后才发送，不自动私信。',
    href: '/guides/white-label-report',
    linkLabel: '阅读白标指南',
  },
] as const;

export default function SolutionsFunnelCards() {
  return (
    <section
      className="no-print"
      style={{
        padding: '8px 24px 48px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '14px',
        }}
      >
        {CARDS.map((card) => (
          <article
            key={card.step}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '2px solid rgba(255,215,0,0.45)',
              borderRadius: '12px',
              padding: '24px 22px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: '#FFD700',
                marginBottom: '10px',
              }}
            >
              {card.step} · {card.subtitle}
            </p>
            <h2
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '10px',
              }}
            >
              {card.title}
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.48)',
                lineHeight: 1.7,
                flex: 1,
                marginBottom: '18px',
              }}
            >
              {card.body}
            </p>
            <Link
              href={card.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FFD700',
                textDecoration: 'none',
              }}
            >
              {card.linkLabel} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
