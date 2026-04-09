'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useT } from '@/context/LanguageContext';

/* Per-service technical specs (not translated — purely technical identifiers) */
const SERVICE_SPECS = [
  [
    { label: 'Protocol',    value: 'REST / JSON  ·  HTTPS only' },
    { label: 'Latency',     value: '< 2 000 ms p99' },
    { label: 'Auth',        value: 'API Key  ·  mTLS available' },
    { label: 'Data Return', value: 'age_delta · pathways · evidence_refs' },
  ],
  [
    { label: 'Output',     value: 'PDF  ·  JSON  ·  HL7 FHIR R4' },
    { label: 'Branding',   value: 'White-label or co-branded' },
    { label: 'Languages',  value: 'English  ·  Simplified Chinese' },
    { label: 'Compliance', value: 'HIPAA-ready  ·  GDPR-ready' },
  ],
  [
    { label: 'Min Cohort',  value: '50 individuals' },
    { label: 'Output',      value: 'CSV  ·  Parquet  ·  Dashboard' },
    { label: 'Anonymity',   value: 'k-Anonymity ≥ 5  ·  Differential Privacy' },
    { label: 'Turnaround',  value: 'Batch: 24 h  ·  Streaming: real-time' },
  ],
];

const SERVICE_IDS = ['api', 'whitelabel', 'cohort'];
const SERVICE_INDICES = ['01', '02', '03'];

/* ─── Beta modal ─────────────────────────────────────────────────────── */
function BetaModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="API Beta Access"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal card */}
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#111318',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: 'clamp(28px,5vw,44px)',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px',
            padding: '5px 14px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(255,215,0,0.9)',
              letterSpacing: '0.04em',
            }}
          >
            {t.enterprise.modal_badge}
          </span>
        </div>

        <h3
          style={{
            fontSize: 'clamp(1.125rem,2.5vw,1.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}
        >
          {t.enterprise.modal_headline}
        </h3>

        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.72, marginBottom: '8px' }}>
          {t.enterprise.modal_sub}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.28)',
            lineHeight: 1.65,
            marginBottom: '28px',
          }}
        >
          API 访问目前处于私密测试阶段，仅向申请通过的临床机构和研究组织开放，不提供自助注册。
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            padding: '16px 18px',
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.36)',
              marginBottom: '8px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {t.enterprise.modal_contact_label}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'rgba(255,215,0,0.75)',
            }}
          >
            enterprise@pivotorder.com
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.22)',
              marginTop: '4px',
            }}
          >
            {t.enterprise.modal_contact_detail}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 500,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          {t.enterprise.modal_close}
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function EnterprisePage() {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main style={{ backgroundColor: '#0A0C10', minHeight: 'calc(100vh - 68px)', color: '#FFFFFF' }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(72px,10vw,120px) 24px clamp(64px,8vw,96px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Classification badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {t.enterprise.badge}
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            lineHeight: 1.08,
            maxWidth: '820px',
            marginBottom: '24px',
          }}
        >
          {t.enterprise.headline}{' '}
          <span style={{ background: 'linear-gradient(135deg, #FFD700 0%, #F5CB00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.enterprise.headline_accent}
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem,1.8vw,1.125rem)',
            color: 'rgba(255,255,255,0.46)',
            lineHeight: 1.72,
            maxWidth: '640px',
            marginBottom: '8px',
          }}
        >
          {t.enterprise.sub}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.22)',
            marginBottom: '40px',
          }}
        >
          为您的诊所或研究机构接入 0.1% 生物年龄引擎 — 纯算力与接口，无商业产品导流，无利益冲突。
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#FFD700',
              color: '#0D0D0D',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              transition: 'background-color 0.2s',
            }}
          >
            Request API Documentation
          </button>
          <Link
            href="/science"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            View Scientific Foundation →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICE TIERS
      ══════════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(64px,8vw,96px) 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '40px',
          }}
        >
          {t.enterprise.tiers_label}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {t.enterprise.services.map((svc, idx) => (
            <div
              key={SERVICE_IDS[idx]}
              className="svc-card"
            >
              <div className="svc-index">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.25rem,2.5vw,2rem)', fontWeight: 700, color: 'rgba(255,255,255,0.1)', letterSpacing: '-0.02em' }}>
                  {SERVICE_INDICES[idx]}
                </span>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.02em', color: 'rgba(255,215,0,0.75)', marginBottom: '8px' }}>
                  {svc.tag}
                </p>
                <h2 style={{ fontSize: 'clamp(1.125rem,2vw,1.375rem)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.015em', marginBottom: '16px' }}>
                  {svc.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.46)', lineHeight: 1.72, maxWidth: '560px', marginBottom: '24px' }}>
                  {svc.body}
                </p>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
                  {SERVICE_SPECS[idx].map((sp, i) => (
                    <div
                      key={sp.label}
                      className="spec-row"
                      style={{ borderBottom: i < SERVICE_SPECS[idx].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <span className="spec-label">{sp.label}</span>
                      <span className="spec-value">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO INTEGRATES
      ══════════════════════════════════════════ */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0D0F14',
          padding: 'clamp(48px,6vw,72px) 24px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.38)',
              marginBottom: '28px',
            }}
          >
            {t.enterprise.integrators_label}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '10px',
            }}
          >
            {t.enterprise.integrators.map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#FFD700',
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.46)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(64px,8vw,96px) 24px',
          textAlign: 'center',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.38)',
            marginBottom: '20px',
          }}
        >
          {t.enterprise.cta_label}
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.375rem,2.8vw,1.875rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          {t.enterprise.cta_headline}
        </h2>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'rgba(255,255,255,0.36)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          {t.enterprise.cta_sub}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#FFD700', color: '#0D0D0D', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.2s' }}
        >
          {t.enterprise.btn_request}
        </button>
      </section>

      {/* ── Beta modal ── */}
      {modalOpen && <BetaModal onClose={() => setModalOpen(false)} />}

      <style>{`
        /* Service card — two-column layout desktop, single-column mobile */
        .svc-card {
          background-color: #111318;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: clamp(24px,4vw,36px);
          display: grid;
          grid-template-columns: clamp(52px,6vw,80px) 1fr;
          gap: 0 32px;
        }

        /* Spec table row — label + value side by side desktop */
        .spec-row {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 0 16px;
          padding: 9px 14px;
          align-items: baseline;
        }
        .spec-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.6875rem;
          color: rgba(255,255,255,0.25);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .spec-value {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          overflow-wrap: break-word;
          word-break: break-word;
          min-width: 0;
        }

        /* ── Mobile: collapse both grids ── */
        @media (max-width: 560px) {
          .svc-card {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .svc-index {
            display: none;   /* hide decorative number on small screens */
          }
          .spec-row {
            grid-template-columns: 1fr;
            gap: 2px;
            padding: 10px 12px;
          }
          .spec-label {
            font-size: 0.625rem;
            color: rgba(255,255,255,0.2);
          }
          .spec-value {
            font-size: 0.8125rem;
            color: rgba(255,255,255,0.65);
          }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
