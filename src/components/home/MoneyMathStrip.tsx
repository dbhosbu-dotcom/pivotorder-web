export default function MoneyMathStrip() {
  return (
    <aside
      aria-label="算账条"
      style={{
        margin: '0 0 36px',
        padding: '18px 20px',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-subtle)',
        maxWidth: '640px',
      }}
    >
      <p
        style={{
          margin: '0 0 8px',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--color-text-heading)',
        }}
      >
        一条咨询费，对照工作台月费
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '0.9375rem',
          lineHeight: 1.75,
          color: 'var(--color-text-secondary)',
        }}
      >
        咨询费 × 月成交单数。演示 200 元 × 5 单 = 1000 元，对照独立档 99 元/月。这是公式，不是保证接到 5 单。H5 只是留资页，客户不会自动进来。
      </p>
    </aside>
  );
}
