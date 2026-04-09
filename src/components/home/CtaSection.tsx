'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useT } from '@/context/LanguageContext';

export default function CtaSection() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* DNA background decoration */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '-60px',
          transform: 'translateY(-50%)',
          width: '420px',
          height: '420px',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3" />
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3"
            transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="100" rx="60" ry="90" stroke="#FFD700" strokeWidth="3"
            transform="rotate(120 100 100)" />
          {[20, 45, 70, 95, 120, 145, 170].map((y, i) => (
            <line key={i} x1="40" y1={y} x2="160" y2={y}
              stroke="#FFD700" strokeWidth="2" strokeOpacity="0.5" />
          ))}
        </svg>
      </div>

      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <p
          className="text-caption"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '24px',
            color: 'var(--color-text-muted)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          {t.cta.section_label}
        </p>

        {/* Headline */}
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#FFFFFF',
            marginBottom: '12px',
            maxWidth: '640px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
          }}
        >
          {t.cta.headline1}
          <br />
          <span style={{ color: 'var(--color-accent)' }}>{t.cta.headline2}</span>
        </h2>

        {/* Sub-copy EN */}
        <p
          style={{
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            maxWidth: '520px',
            marginBottom: '8px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.2s',
          }}
        >
          {t.cta.sub}
        </p>

        {/* Sub-copy ZH */}
        <p
          className="text-caption"
          style={{
            textTransform: 'none',
            letterSpacing: 0,
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '52px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.25s',
          }}
        >
          {''}
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s',
          }}
        >
          <Link
            href="/auth/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-dark)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = 'var(--color-accent-hover)';
              el.style.boxShadow = '0 0 28px rgba(255,215,0,0.35)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = 'var(--color-accent)';
              el.style.boxShadow = 'none';
            }}
          >
            {t.cta.btn_engine} <span style={{ fontSize: '1rem' }}>→</span>
          </Link>

          <Link
            href="/engine?mode=mock"
            className="btn-secondary-dark"
          >
            <span>⚡</span> {t.cta.btn_demo}
          </Link>
        </div>

        {/* Bottom note */}
        <p
          style={{
            marginTop: '40px',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.2)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.5s',
          }}
        >
          {t.cta.footnote}
        </p>
      </div>
    </section>
  );
}
