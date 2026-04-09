'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ── CountUp hook ─────────────────────────────────────────────────── */
function useCountDown(from: number, to: number, duration: number, started: boolean) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const diff = from - to;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier ease-out approximation
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((from - diff * eased).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, from, to, duration]);

  return value;
}

/* ── Tooltip content ──────────────────────────────────────────────── */
const TOOLTIP_LINES = [
  'Calculated via:',
  '• Horvath 2.0 Methylation Clock',
  '• Metabolomic Panel · 12 markers',
  '• Gut Microbiome Diversity Index',
  '• HRV Autonomic Balance Score',
];

export default function HeroSection() {
  const [animStarted, setAnimStarted] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* trigger animation on mount after brief delay */
  useEffect(() => {
    const t1 = setTimeout(() => setFadeIn(true), 100);
    const t2 = setTimeout(() => setAnimStarted(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const phenotypicAge = useCountDown(47, 38.2, 2200, animStarted);
  const showDecimal = phenotypicAge < 47;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        padding: '80px 24px',
      }}
    >
      {/* Vertical center-line decoration */}
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

      {/* DNA background decoration */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-40px',
          right: '-40px',
          width: '340px',
          height: '340px',
          opacity: 0.035,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3" />
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3"
            transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3"
            transform="rotate(120 100 100)" />
          {[30, 55, 80, 105, 130, 155, 170].map((y, i) => (
            <line key={i} x1="48" y1={y} x2="152" y2={y}
              stroke="#FFD700" strokeWidth="2" strokeOpacity="0.6" />
          ))}
        </svg>
      </div>

      {/* Main content */}
      <div
        className="container-site"
        style={{
          maxWidth: '900px',
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* Age comparison block */}
        <div style={{ marginBottom: '56px' }}>
          {/* Chronological */}
          <div style={{ marginBottom: '16px' }}>
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '6px',
                color: 'var(--color-text-muted)',
              }}
            >
              Chronological Age &nbsp;·&nbsp; 时序年龄
            </p>
            <span
              className="text-display-xl"
              style={{
                color: 'var(--color-text-muted)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              47
            </span>
          </div>

          {/* Thin divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--color-border-subtle)',
              marginBottom: '20px',
              maxWidth: '320px',
            }}
          />

          {/* Phenotypic — with tooltip */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '6px',
                color: 'var(--color-text-muted)',
              }}
            >
              Phenotypic Age &nbsp;·&nbsp; 表型年龄（多组学重构）
            </p>
            <span
              className="text-display-xl"
              style={{
                color: 'var(--color-accent)',
                display: 'block',
                lineHeight: 1,
                cursor: 'default',
                userSelect: 'none',
              }}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              {showDecimal ? phenotypicAge.toFixed(1) : '47.0'}
            </span>

            {/* Tooltip */}
            {tooltipVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                }}
              >
                {TOOLTIP_LINES.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      color: i === 0
                        ? 'var(--color-text-heading)'
                        : 'var(--color-text-secondary)',
                      fontWeight: i === 0 ? 600 : 400,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            marginBottom: '16px',
          }}
        >
          <p
            className="text-h2"
            style={{
              color: 'var(--color-text-heading)',
              marginBottom: '6px',
            }}
          >
            Nine years. Reclaimed by data.
          </p>
        </div>

        {/* Slogan */}
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.35s',
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
              letterSpacing: '0.03em',
            }}
          >
            Decoding the Data, Restoring the Order.
          </p>
        </div>

        {/* Sub-copy */}
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.45s',
            marginBottom: '52px',
            maxWidth: '560px',
          }}
        >
          <p className="text-body-m" style={{ lineHeight: 1.75 }}>
            Most health systems measure what has already happened.<br />
            PivotOrder predicts what hasn&apos;t happened yet —{' '}
            <br className="hidden md:block" />
            and models the intervention before it does.
          </p>
          <p
            className="text-caption"
            style={{
              marginTop: '8px',
              textTransform: 'none',
              letterSpacing: 0,
              color: 'var(--color-text-muted)',
            }}
          >
            时序年龄对比表型年龄 · 差距由算法计算 · 不由体检报告估算
          </p>
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.55s',
          }}
        >
          <Link href="/engine" className="btn-primary">
            Run Biological Analysis <span>→</span>
          </Link>
          <Link href="/engine?mode=mock" className="btn-secondary">
            <span>⚡</span> Explore with Mock Data
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          className="text-caption"
          style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          Scroll
        </span>
        <svg
          className="animate-bounce-arrow"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3L8 13M8 13L4 9M8 13L12 9"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
