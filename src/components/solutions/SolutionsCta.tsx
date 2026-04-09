'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Stat strip ─────────────────────────────────────────────────────── */
const STATS = [
  { value: '10,247+', label: 'EBM Citations',          labelZh: '循证引文' },
  { value: '4',       label: 'Intervention Pathways',  labelZh: '干预路径' },
  { value: '< 2s',   label: 'Report Compile Time',     labelZh: '报告生成' },
  { value: '0',       label: 'Commercial Affiliations', labelZh: '商业关联' },
];

/* ════════════════════════════════════════════════════════════════════════ */
export default function SolutionsCta() {
  const [hovered,    setHovered]    = useState(false);
  const [apiHovered, setApiHovered] = useState(false);

  function handleExport() {
    window.print();
  }

  return (
    <section
      className="no-print"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#0D0F14',
        padding: 'clamp(64px,8vw,104px) 24px',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* ── Stat strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '56px',
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#0D0F14',
                padding: '28px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 'clamp(1.375rem, 2.5vw, 1.75rem)',
                  fontWeight: 700,
                  color: '#FFD700',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.36)', fontWeight: 500 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.18)', marginTop: '2px' }}>
                {s.labelZh}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── CTA block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{ textAlign: 'center' }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '20px',
            }}
          >
            Export &nbsp;·&nbsp; 导出报告
          </p>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(1.625rem, 3.5vw, 2.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            Download Your Clinical Strategy
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.38)', marginBottom: '36px' }}>
            PHI Scrubbed &nbsp;·&nbsp; No commercial affiliation &nbsp;·&nbsp; EBM-graded
          </p>

          {/* Button row */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Primary — Export (triggers window.print) */}
            <button
              onClick={handleExport}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: hovered ? '#F5CB00' : '#FFD700',
                color: '#0D0D0D',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: hovered ? '0 0 32px rgba(255,215,0,0.28)' : 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 7l4 4 4-4M2 12h12"
                  stroke="#0D0D0D" strokeWidth="1.75"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export Clinical Strategy (PDF)
            </button>

            {/* Secondary — API Docs */}
            <button
              onMouseEnter={() => setApiHovered(true)}
              onMouseLeave={() => setApiHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                padding: '14px 28px',
                borderRadius: '8px',
                border: `1px solid ${apiHovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.09)'}`,
                backgroundColor: 'transparent',
                color: apiHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 2h5v2H4v7h7V8h2v5H2V2z" fill="currentColor" opacity=".5" />
                <path d="M8 2h5v5h-2V5.41L6.71 9.7 5.3 8.3 9.59 4H8V2z" fill="currentColor" />
              </svg>
              API Documentation
            </button>
          </div>

          {/* Methodology note */}
          <p
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.16)',
              marginTop: '28px',
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '28px auto 0',
            }}
          >
            All pathways are derived exclusively from peer-reviewed evidence (PubMed · Cochrane · NEJM).
            PivotOrder does not endorse, manufacture, or distribute any specific product or therapy.
            <br />
            所有干预路径均源自同行评审证据，PivotOrder 不背书任何商业产品或疗法。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
