'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PATHWAYS } from '@/lib/pathwayData';
import { generateClinicalPDF } from '@/lib/generateClinicalPDF';

/* ─── Inline toast ───────────────────────────────────────────────────── */
function InlineToast({
  visible,
  message,
  isError = false,
}: {
  visible: boolean;
  message: string;
  isError?: boolean;
}) {
  const borderColor = isError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)';
  const iconColor   = isError ? '#EF4444' : '#FFD700';

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8, scale: visible ? 1 : 0.97 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          backgroundColor: '#111318',
          border: `1px solid ${borderColor}`,
          borderRadius: '10px',
          padding: '14px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        {isError ? (
          /* Error icon */
          <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>✕</span>
        ) : (
          /* Spinner */
          <svg
            width="16" height="16" viewBox="0 0 16 16"
            style={{ animation: 'spin-ring 1s linear infinite', flexShrink: 0 }}
          >
            <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="2" />
            <circle cx="8" cy="8" r="6" fill="none" stroke={iconColor}
              strokeWidth="2" strokeLinecap="round" strokeDasharray="10 28" />
          </svg>
        )}

        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8125rem',
            color: isError ? '#FCA5A5' : 'rgba(255,255,255,0.75)',
            letterSpacing: '0.03em',
          }}
        >
          {message}
        </span>
        <style>{`@keyframes spin-ring { to { transform: rotate(360deg); } }`}</style>
      </div>
    </motion.div>
  );
}

/* ─── Stat strip data ─────────────────────────────────────────────────── */
const STATS = [
  { value: '10,247+', label: 'EBM Citations',          labelZh: '循证引文' },
  { value: '4',       label: 'Intervention Pathways',  labelZh: '干预路径' },
  { value: '< 2s',   label: 'Report Compile Time',     labelZh: '报告生成' },
  { value: '0',       label: 'Commercial Affiliations', labelZh: '商业关联' },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function SolutionsCta() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg]         = useState('Generating anonymous clinical report...');
  const [toastErr, setToastErr]         = useState(false);
  const [hovered, setHovered]           = useState(false);
  const [apiHovered, setApiHovered]     = useState(false);
  const [exporting, setExporting]       = useState(false);

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    setToastErr(false);
    setToastMsg('Generating anonymous clinical report...');
    setToastVisible(true);

    try {
      await generateClinicalPDF(PATHWAYS);
      // Success: keep toast visible briefly then fade
      setTimeout(() => setToastVisible(false), 2000);
    } catch (err) {
      console.error('[PDF Export]', err);
      setToastErr(true);
      setToastMsg('Export Failed: Please try again.');
      setTimeout(() => setToastVisible(false), 4000);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <InlineToast
        visible={toastVisible}
        message={toastMsg}
        isError={toastErr}
      />

      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0D0F14',
          padding: 'clamp(64px,8vw,104px) 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* ── Stat strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '720px',
              marginBottom: '72px',
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.value}
                style={{
                  backgroundColor: '#0D0F14',
                  padding: '22px 16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                    fontWeight: 700,
                    color: '#FFD700',
                    lineHeight: 1,
                    marginBottom: '8px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '2px',
                  }}
                >
                  {s.label}
                </p>
                <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.15)' }}>
                  {s.labelZh}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ── Label ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: '20px',
            }}
          >
            Clinical Output &nbsp;·&nbsp; 临床输出
          </motion.p>

          {/* ── Headline ── */}
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.875rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '18px',
              maxWidth: '560px',
            }}
          >
            Export Your{' '}
            <span style={{ color: '#FFD700' }}>Clinical Strategy</span>
            <br />
            as a Structured PDF
          </motion.h2>

          {/* ── Sub-copy EN ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            style={{
              fontSize: '0.9375rem',
              color: 'rgba(255,255,255,0.36)',
              lineHeight: 1.72,
              maxWidth: '500px',
              marginBottom: '8px',
            }}
          >
            Generate a fully anonymised clinical PDF containing your biological
            age delta, four intervention pathway annotations, and a traceable
            EBM citation chain — ready for practitioner review.
          </motion.p>

          {/* ── Sub-copy ZH ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 }}
            style={{
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.16)',
              marginBottom: '48px',
            }}
          >
            生成完全匿名的临床 PDF，包含生物年龄落差、四项干预路径标注与可溯源循证引用链。
          </motion.p>

          {/* ── Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Primary — Export */}
            <button
              onClick={handleExport}
              disabled={exporting}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 30px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: exporting ? '#C9A800' : (hovered ? '#F5CB00' : '#FFD700'),
                color: '#0D0D0D',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: exporting ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
                opacity: exporting ? 0.8 : 1,
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                boxShadow: hovered && !exporting
                  ? '0 0 32px rgba(255,215,0,0.28)'
                  : '0 0 0 rgba(255,215,0,0)',
              } as React.CSSProperties}
            >
              {exporting ? (
                <svg width="16" height="16" viewBox="0 0 16 16"
                  style={{ animation: 'spin-ring 0.9s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
                  <circle cx="8" cy="8" r="6" fill="none" stroke="#0D0D0D"
                    strokeWidth="2" strokeLinecap="round" strokeDasharray="10 28" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M4 7l4 4 4-4M2 12h12"
                    stroke="#0D0D0D" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {exporting ? 'Generating...' : 'Export Clinical Strategy (PDF)'}
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
              Access API Documentation
              <span style={{ fontSize: '0.75rem', opacity: 0.55 }}>→</span>
            </button>
          </motion.div>

          {/* ── Divider ── */}
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              margin: '60px auto 52px',
            }}
          />

          {/* ── Methodology declaration ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '28px 32px',
              maxWidth: '680px',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.5875rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '12px',
              }}
            >
              Methodology Declaration &nbsp;·&nbsp; 方法论声明
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.32)',
                lineHeight: 1.8,
              }}
            >
              All intervention pathways presented here are derived exclusively from
              peer-reviewed evidence (PubMed · Cochrane · NEJM · Lancet) and your
              individual multi-omic engine output. PivotOrder does not endorse,
              manufacture, or distribute any specific product, supplement, or therapy.
              This output is for research and clinical decision-support purposes only.
              Not a substitute for professional medical advice.
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.14)',
                lineHeight: 1.7,
                marginTop: '12px',
              }}
            >
              本页所有干预路径均源自同行评审证据与个人多组学引擎输出。PivotOrder
              不背书、不生产、不分发任何具体产品、补剂或疗法。本输出仅用于科研与临床决策辅助目的，不替代专业医疗建议。
            </p>
          </motion.div>

        </div>
      </section>
    </>
  );
}
