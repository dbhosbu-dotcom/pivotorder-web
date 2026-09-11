const STEPS = ['上传检验单', 'AI 整理', '白标草稿', '确认后发送'] as const;

export default function DeliveryProofSection() {
  return (
    <section
      style={{
        padding: '72px 24px 88px',
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-site" style={{ maxWidth: '860px' }}>
        <h2
          className="text-h3"
          style={{
            color: 'var(--color-text-heading)',
            marginBottom: '20px',
          }}
        >
          交得出去
        </h2>

        <ol
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: '12px',
            listStyle: 'none',
            margin: '0 0 20px',
            padding: 0,
          }}
        >
          {STEPS.map((step, index) => (
            <li
              key={step}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: 'var(--color-bg-subtle)',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {String(index + 1).padStart(2, '0')}
              </p>
              <p style={{ margin: '6px 0 0', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {step}
              </p>
            </li>
          ))}
        </ol>

        <p
          style={{
            margin: 0,
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}
        >
          报告仅供健康管理参考，发送前须你确认
        </p>
      </div>
    </section>
  );
}
