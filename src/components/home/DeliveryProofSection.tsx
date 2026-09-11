import ComplianceNotice from '@/components/compliance/ComplianceNotice';

const STEPS = [
  { label: '导入材料', detail: '体检单进入工作台，不对外发送' },
  { label: '结构化草稿', detail: '生成可编辑健康管理参考' },
  { label: '套上品牌', detail: '工作室 Logo 与署名，不是平台壳' },
  { label: '确认后发送', detail: '你点确认之前，客户看不到' },
] as const;

export default function DeliveryProofSection() {
  return (
    <section
      style={{
        padding: '72px 24px 88px',
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-site" style={{ maxWidth: '900px' }}>
        <p
          className="text-caption"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          交付示意
        </p>
        <h2
          className="text-h3"
          style={{
            color: 'var(--color-text-heading)',
            marginBottom: '10px',
          }}
        >
          白标报告：客户看到你的品牌，确认前不会发出
        </h2>
        <p
          className="text-body-m"
          style={{
            maxWidth: '620px',
            marginBottom: '32px',
            lineHeight: 1.75,
          }}
        >
          工作台只出可编辑草稿。报告仅供健康管理参考，不构成医学诊断。发送门在你手里，不自动私信。
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          <article
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '24px',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  工作室品牌
                </p>
                <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>
                  你的 Logo · 你的署名
                </p>
              </div>
              <span
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#111827',
                  color: 'var(--color-accent)',
                }}
              >
                未确认 · 不发送
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '8px' }}>
              健康管理参考草稿
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              结构化条目可编辑。页面上不会出现诊断结论、疗效承诺或自动外发按钮。
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                非诊断
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                非治疗
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                确认门开启后才发送
              </span>
            </div>
          </article>

          <ol
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {STEPS.map((step, index) => (
              <li
                key={step.label}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  backgroundColor: 'var(--color-bg-subtle)',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {step.label}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <ComplianceNotice />
      </div>
    </section>
  );
}
