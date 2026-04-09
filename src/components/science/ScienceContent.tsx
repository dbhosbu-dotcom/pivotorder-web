'use client';

import Link from 'next/link';
import { useT } from '@/context/LanguageContext';

const PILLAR_INDICES = ['01', '02', '03'];
const STEP_NUMBERS   = ['1', '2', '3', '4', '5'];
const PILLAR_STATS   = [
  [{ value: '147',   label: 'Validated Markers' }, { value: '4',     label: 'Omic Layers'              }, { value: '>0.82', label: 'Cross-Omic r²'            }],
  [{ value: '4',     label: 'Clock Models'       }, { value: '−34%', label: 'Variance vs. Single-Clock' }, { value: '±0.7', label: 'Mean Error (yrs)'          }],
  [{ value: '10,247+', label: 'PubMed Citations' }, { value: 'A/B+', label: 'Evidence Grade'            }, { value: '0',    label: 'Observational-Only Pathways' }],
];

export default function ScienceContent() {
  const t = useT();

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 68px)' }}>

      {/* ── Hero ── */}
      <section style={{ borderBottom: '1px solid var(--color-border)', padding: 'clamp(72px,10vw,120px) 24px clamp(64px,8vw,96px)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '6px 14px', marginBottom: '32px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            {t.science.badge}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-heading)', lineHeight: 1.08, maxWidth: '780px', marginBottom: '24px' }}>
          {t.science.headline.split('PivotOrder').map((part, i) =>
            i === 0
              ? <span key={i}>{part}</span>
              : <span key={i}><span style={{ color: 'var(--color-accent)' }}>PivotOrder</span>{part}</span>
          )}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)', color: 'var(--color-text-secondary)', lineHeight: 1.72, maxWidth: '680px' }}>
          {t.science.sub}
        </p>
      </section>

      {/* ── Three Pillars ── */}
      <section style={{ padding: 'clamp(64px,8vw,104px) 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '48px' }}>
          {t.science.pillars_label}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.science.pillars.map((p, i) => (
            <div
              key={i}
              style={{ display: 'grid', gridTemplateColumns: 'clamp(60px,8vw,100px) 1fr', gap: '0 40px', padding: 'clamp(36px,5vw,56px) 0', borderTop: '1px solid var(--color-border)', borderBottom: i === t.science.pillars.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 700, color: 'var(--color-border)', letterSpacing: '-0.02em' }}>
                  {PILLAR_INDICES[i]}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(1.125rem,2.2vw,1.5rem)', fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.015em', marginBottom: '16px' }}>
                  {p.title}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)', lineHeight: 1.75, maxWidth: '640px', marginBottom: '28px' }}>
                  {p.body}
                </p>

                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {PILLAR_STATS[i].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.25rem,2vw,1.625rem)', fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px 12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>REF</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{p.refs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section style={{ backgroundColor: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'clamp(56px,7vw,88px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            {t.science.pipeline_label}
          </p>
          <h2 style={{ fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', marginBottom: '48px' }}>
            {t.science.pipeline_headline}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {t.science.pipeline_steps.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '0 24px', alignItems: 'flex-start', paddingBottom: '28px', position: 'relative' }}>
                {i < t.science.pipeline_steps.length - 1 && (
                  <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: 0, width: '1px', backgroundColor: 'var(--color-border)' }} />
                )}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, position: 'relative' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{STEP_NUMBERS[i]}</span>
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-heading)', marginBottom: '3px' }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(64px,8vw,96px) 24px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.375rem,2.8vw,1.875rem)', fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
          {t.science.cta_headline}
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
          {t.science.cta_sub}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/engine" className="btn-primary">{t.science.btn_engine}</Link>
          <Link href="/enterprise" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 22px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.9375rem', textDecoration: 'none' }}>
            {t.science.btn_enterprise}
          </Link>
        </div>
      </section>
    </main>
  );
}
