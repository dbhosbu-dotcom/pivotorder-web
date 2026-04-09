'use client';

import { useEffect, useRef, useState } from 'react';

const COMPARE_ROWS = [
  { dimension: 'Data Points', standard: '~20 markers', engine: '200+ multi-omic markers' },
  { dimension: 'Output Type', standard: 'Static binary', engine: 'Dynamic probability vector' },
  { dimension: 'Predictive Window', standard: 'None', engine: '5–10 year risk trajectory' },
  { dimension: 'Personalization', standard: 'Population reference range', engine: 'Individual baseline drift tracking' },
  { dimension: 'Update Frequency', standard: 'Annual', engine: 'Continuous · 90-day cycle' },
  { dimension: 'Algorithm Transparency', standard: 'Black box', engine: 'Fully auditable EBM chain' },
];

export default function ParadigmSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="container-site">
        {/* Section label */}
        <p
          className="text-caption"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '20px',
            color: 'var(--color-accent)',
          }}
        >
          The 0.1% Paradigm &nbsp;·&nbsp; 顶尖 0.1% 的认知范式
        </p>

        {/* Section title */}
        <h2
          className="text-h1"
          style={{ marginBottom: '72px', maxWidth: '640px' }}
        >
          The Standard Checkup vs.{' '}
          <span style={{ color: 'var(--color-accent)' }}>The Living Model</span>
        </h2>

        {/* Left / Right split comparison */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2px 1fr',
            gap: 0,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
          }}
        >
          {/* Left — Standard */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: '12px 0 0 12px',
              padding: '40px 36px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'opacity 0.7s ease-in-out 0.1s, transform 0.7s ease-in-out 0.1s',
            }}
          >
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '24px',
              }}
            >
              The Standard Paradigm &nbsp;·&nbsp; 传统医学范式
            </p>

            <div style={{ marginBottom: '32px' }}>
              {[
                'A single measurement.',
                'A single point in time.',
                'A binary output: normal / abnormal.',
              ].map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 2,
                    margin: 0,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
              {['No trajectory.', 'No prediction.', 'No intervention window.'].map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 2.2,
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <p
              className="text-caption"
              style={{
                marginTop: '28px',
                textTransform: 'none',
                letterSpacing: 0,
                color: 'var(--color-text-muted)',
                opacity: 0.7,
              }}
            >
              单次测量 · 单一时间点 · 二元判断
              <br />
              没有轨迹 · 没有预测 · 没有干预窗口
            </p>
          </div>

          {/* Yellow center divider */}
          <div
            style={{
              backgroundColor: 'var(--color-accent)',
              flexShrink: 0,
            }}
          />

          {/* Right — PivotOrder */}
          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderLeft: 'none',
              borderRadius: '0 12px 12px 0',
              padding: '40px 36px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(16px)',
              transition: 'opacity 0.7s ease-in-out 0.1s, transform 0.7s ease-in-out 0.1s',
            }}
          >
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '24px',
                color: 'var(--color-accent)',
              }}
            >
              The PivotOrder Engine &nbsp;·&nbsp; PivotOrder 算法引擎
            </p>

            <div style={{ marginBottom: '32px' }}>
              {[
                { text: 'Continuous multi-omic integration.', highlight: false },
                { text: 'Biological clocks recalculated every 90 days.', highlight: false },
                { text: 'A living digital twin — updated as you change.', highlight: true },
              ].map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '1rem',
                    color: item.highlight
                      ? 'var(--color-text-heading)'
                      : 'var(--color-text-primary)',
                    lineHeight: 2,
                    margin: 0,
                    backgroundColor: item.highlight
                      ? 'var(--color-accent-dim)'
                      : 'transparent',
                    padding: item.highlight ? '0 6px' : 0,
                    borderRadius: item.highlight ? '4px' : 0,
                    display: 'inline',
                  }}
                >
                  {item.text}
                  {i < 2 && <br />}
                </p>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
              {['Trajectory.', 'Prediction.', 'Precision intervention mapping.'].map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '0.9375rem',
                    color: i === 2 ? 'var(--color-accent)' : 'var(--color-text-heading)',
                    lineHeight: 2.2,
                    margin: 0,
                    fontWeight: i === 2 ? 600 : 400,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <p
              className="text-caption"
              style={{
                marginTop: '28px',
                textTransform: 'none',
                letterSpacing: 0,
                color: 'var(--color-text-secondary)',
              }}
            >
              持续多组学整合 · 生物时钟每 90 天重算
              <br />
              随你演化的活体数字孪生
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <div
          style={{
            marginTop: '64px',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out 0.3s',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              backgroundColor: 'var(--color-bg-subtle)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {['Dimension 维度', 'Standard 传统体检', 'PivotOrder Engine'].map(
              (header, i) => (
                <div
                  key={header}
                  style={{
                    padding: '14px 20px',
                    borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <span
                    className="text-caption"
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color:
                        i === 2
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                      fontWeight: i === 2 ? 600 : 500,
                    }}
                  >
                    {header}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Table rows */}
          {COMPARE_ROWS.map((row, idx) => (
            <div
              key={row.dimension}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom:
                  idx < COMPARE_ROWS.length - 1
                    ? '1px solid var(--color-border-subtle)'
                    : 'none',
                backgroundColor:
                  idx % 2 === 0 ? 'var(--color-bg)' : 'var(--color-bg-subtle)',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderRight: '1px solid var(--color-border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {row.dimension}
                </span>
              </div>
              <div
                style={{
                  padding: '14px 20px',
                  borderRight: '1px solid var(--color-border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {row.standard}
                </span>
              </div>
              <div style={{ padding: '14px 20px' }}>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-heading)',
                    fontWeight: 600,
                  }}
                >
                  {row.engine}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
