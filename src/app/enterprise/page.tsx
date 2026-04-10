'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useT, useLanguage } from '@/context/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.pivotorder.com';

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

/* ─── Shared input style ─────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(255,255,255,0.04)',
  color: '#FFFFFF',
  fontSize: '0.9375rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function EnterprisePage() {
  const t = useT();
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const e = t.enterprise;

  const [org,     setOrg]     = useState('');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [apiKey,  setApiKey]  = useState('');
  const [copied,  setCopied]  = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!org.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/enterprise/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: org.trim(),
          email:    email.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? e.modal_error_generic);
      }
      const data = await res.json();
      setApiKey(data.api_key);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : e.modal_error_generic);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

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
          <a
            href="#apply"
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
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            {t.enterprise.btn_request}
          </a>
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
          SELF-SERVICE API KEY FORM (inline)
      ══════════════════════════════════════════ */}
      <section
        id="apply"
        style={{
          padding: 'clamp(64px,8vw,96px) 24px',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFD700', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,215,0,0.9)', letterSpacing: '0.04em' }}>
            {e.modal_badge}
          </span>
        </div>

        {apiKey ? (
          /* ── Success state ── */
          <>
            <h2 style={{ fontSize: 'clamp(1.375rem,2.8vw,1.875rem)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {e.modal_success_headline}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.36)', lineHeight: 1.7, marginBottom: '24px' }}>
              {e.modal_success_sub}
            </p>

            {/* Key display */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                X-PivotOrder-API-Key
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#FFD700', wordBreak: 'break-all', lineHeight: 1.5 }}>
                {apiKey}
              </p>
            </div>

            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', backgroundColor: copied ? 'rgba(34,197,94,0.15)' : '#FFD700', color: copied ? '#22C55E' : '#0D0D0D', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.2s, color 0.2s' }}
            >
              {copied ? e.modal_success_copied : e.modal_success_copy}
            </button>
          </>
        ) : (
          /* ── Form state ── */
          <>
            <h2
              style={{
                fontSize: 'clamp(1.375rem,2.8vw,1.875rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              {e.cta_headline}
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.36)',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}
            >
              {e.modal_sub}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {e.modal_label_org} *
                  </label>
                  <input
                    required
                    value={org}
                    onChange={ev => setOrg(ev.target.value)}
                    placeholder="e.g. ABTIDE · Vancouver General Hospital"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {e.modal_label_email} *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    placeholder="contact@institution.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontSize: '0.875rem', color: '#F87171', marginBottom: '16px', lineHeight: 1.5 }}>
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: loading ? 'rgba(255,215,0,0.4)' : '#FFD700', color: '#0D0D0D', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.2s' }}
              >
                {loading ? e.modal_btn_loading : e.modal_btn_submit}
              </button>
            </form>
          </>
        )}
      </section>

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
