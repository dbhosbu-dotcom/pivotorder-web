import Link from 'next/link';
import ComplianceNotice from '@/components/compliance/ComplianceNotice';
import MoneyMathStrip from '@/components/home/MoneyMathStrip';
import { workbenchRegisterUrl } from '@/lib/site';

const STEPS = ['发 H5 获客', '按咨询报价成交', '白标报告跟进（确认后发送）'] as const;

export default function WorkbenchHero() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        padding: '80px 24px 72px',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '100%',
          backgroundColor: 'var(--color-border-subtle)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-site" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
        <p
          className="text-caption"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '20px',
            color: 'var(--color-text-muted)',
          }}
        >
          枢序健康 · 营养师工作台
        </p>

        <h1
          className="text-h2"
          style={{
            color: 'var(--color-text-heading)',
            marginBottom: '18px',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}
        >
          证拿到了。客户从哪来，咨询费怎么收？
        </h1>

        <p
          className="text-body-m"
          style={{
            lineHeight: 1.8,
            maxWidth: '640px',
            marginBottom: '28px',
          }}
        >
          H5 留资、报价路径、白标报告跟进草稿，放进同一张工作台。你确认后才发给客户。报告仅供健康管理参考。
        </p>

        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            listStyle: 'none',
            padding: 0,
            margin: '0 0 20px',
          }}
        >
          {STEPS.map((step, index) => (
            <li
              key={step}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-subtle)',
                fontSize: '0.875rem',
                color: 'var(--color-text-heading)',
                fontWeight: 600,
              }}
            >
              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <MoneyMathStrip />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <a href={workbenchRegisterUrl} className="btn-primary">
            免费搭建工作室 <span>→</span>
          </a>
          <Link href="/guides" className="btn-secondary">
            营养师指南
          </Link>
        </div>

        <ComplianceNotice />
      </div>
    </section>
  );
}
