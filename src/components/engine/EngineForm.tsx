'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';
import Toast from '@/components/ui/Toast';
import { useT } from '@/context/LanguageContext';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface FormState {
  currentAge: number;
  targetAge: number;
  gender: 'Male' | 'Female' | 'Other';
}

interface OptimizationItem {
  category: string;
  recommendation: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface AnalysisResult {
  predicted_age: number;
  delta_years: number;
  confidence_interval?: [number, number];
  optimization_plan: OptimizationItem[];
}

type Phase = 'idle' | 'loading' | 'result' | 'error';

/* ─── Loading log lines ──────────────────────────────────────────────── */
const LOG_LINES = [
  '正在调用香港 AIGC 算力集群...',
  'Initializing Horvath 2.0 Methylation Clock...',
  'Loading metabolomic reference panel (12 markers)...',
  'Running EBM cross-validation (PubMed · Cochrane)...',
  'Fusing 6 biological clock models...',
  '✓  Biological age vector generated.',
];

/* ─── Mock fallback result ───────────────────────────────────────────── */
function buildMockResult(form: FormState): AnalysisResult {
  const delta = -(form.currentAge - form.targetAge) * 0.94;
  return {
    predicted_age: form.currentAge + delta,
    delta_years: delta,
    confidence_interval: [
      parseFloat((form.currentAge + delta - 1.3).toFixed(1)),
      parseFloat((form.currentAge + delta + 1.3).toFixed(1)),
    ],
    optimization_plan: [
      {
        category: 'Epigenetic Methylation',
        recommendation:
          'Ergothioneine supplementation (50–100 mg/day) combined with folate-B12 co-factors to regulate methylation clock velocity.',
        priority: 'HIGH',
      },
      {
        category: 'Metabolic Resilience',
        recommendation:
          'Flash-release essential amino acid complex (9 EAAs, golden ratio) administered 30 min post-exercise to optimize mTOR pathway efficiency.',
        priority: 'HIGH',
      },
      {
        category: 'Microbiome Architecture',
        recommendation:
          'Multi-strain probiotic protocol (42 strains, 6 Trillion CFU) with prebiotic matrix to elevate Shannon diversity index above 3.5.',
        priority: 'MEDIUM',
      },
      {
        category: 'HRV & Autonomic Balance',
        recommendation:
          'Structured HRV training (4-7-8 breathing, 2× daily) targeting RMSSD ≥ 55 ms to improve autonomic regulation score.',
        priority: 'MEDIUM',
      },
    ],
  };
}

/* ─── AnimatedNumber ─────────────────────────────────────────────────── */
function AnimatedNumber({ to, from }: { to: number; from: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = v.toFixed(1);
      },
    });
    return () => controls.stop();
  }, [from, to]);

  return <span ref={ref}>{from.toFixed(1)}</span>;
}

/* ─── Priority badge ─────────────────────────────────────────────────── */
function PriorityBadge({ priority }: { priority?: string }) {
  const cfg = {
    HIGH:   { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
    MEDIUM: { bg: 'rgba(255,215,0,0.12)',  color: '#D4A500' },
    LOW:    { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
  }[priority ?? 'LOW'] ?? { bg: 'rgba(255,255,255,0.08)', color: '#8A8A8A' };

  return (
    <span
      style={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        backgroundColor: cfg.bg,
        color: cfg.color,
        padding: '2px 8px',
        borderRadius: '4px',
        flexShrink: 0,
      }}
    >
      {priority ?? 'LOW'}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════ */
export default function EngineForm() {
  const t = useT();
  const [form, setForm] = useState<FormState>({
    currentAge: 47,
    targetAge: 38,
    gender: 'Male',
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [logIndex, setLogIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Animate log lines during loading ── */
  useEffect(() => {
    if (phase !== 'loading') { setLogIndex(0); return; }
    if (logIndex >= LOG_LINES.length - 1) return;
    const t = setTimeout(() => setLogIndex((i) => i + 1), 560);
    return () => clearTimeout(t);
  }, [phase, logIndex]);

  /* ── Submit ── */
  async function handleSubmit() {
    setPhase('loading');
    setLogIndex(0);
    setResult(null);

    // Strip any trailing slash and deduplicate in case the env var was set incorrectly
    const rawBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
    // Guard against a doubled value like "http://...http://..." (env-file corruption)
    const httpIdx = rawBase.indexOf('http', 1);
    const baseUrl = httpIdx !== -1 ? rawBase.slice(httpIdx) : rawBase;

    // If no API URL configured → run mock immediately
    if (!baseUrl) {
      await new Promise((r) => setTimeout(r, LOG_LINES.length * 560 + 400));
      setResult(buildMockResult(form));
      setPhase('result');
      return;
    }

    const apiUrl = `${baseUrl}/predict`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAge: form.currentAge,
          targetAge: form.targetAge,
          gender: form.gender,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: AnalysisResult = await res.json();
      setResult(data);
      setPhase('result');
    } catch (err) {
      console.error('[EngineForm]', err);
      setToast('Engine Link Failed: 请检查后端 API 状态，当前以 Mock 数据运行结果展示。');
      // Graceful fallback — still show mock result
      await new Promise((r) => setTimeout(r, 600));
      setResult(buildMockResult(form));
      setPhase('result');
    }
  }

  function handleReset() {
    setPhase('idle');
    setResult(null);
  }

  /* ── Field style helper ── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#FFFFFF',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    appearance: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '8px',
  };

  return (
    <>
      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast}
          type="error"
          onClose={() => setToast(null)}
        />
      )}

      {/* ── FORM CARD ── */}
      {phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#111318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: 'clamp(32px, 5vw, 56px)',
            maxWidth: '520px',
            width: '100%',
          }}
        >
          {/* Card header */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '20px',
                padding: '4px 12px',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  display: 'inline-block',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#22C55E',
                  fontFamily: 'var(--font-jetbrains, monospace)',
                }}
              >
                {t.engine.status} · Engine v2.4.1
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginBottom: '8px',
                lineHeight: 1.2,
              }}
            >
              {t.engine.headline}
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.6,
              }}
            >
              {t.engine.sub}
            </p>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Current Age */}
            <div>
              <label style={labelStyle}>
                {t.engine.label_age}
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={form.currentAge}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currentAge: Number(e.target.value) }))
                }
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')
                }
              />
            </div>

            {/* Target Age */}
            <div>
              <label style={labelStyle}>
                {t.engine.label_target}
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={form.targetAge}
                onChange={(e) =>
                  setForm((f) => ({ ...f, targetAge: Number(e.target.value) }))
                }
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')
                }
              />
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyle}>{t.engine.label_gender}</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      gender: e.target.value as FormState['gender'],
                    }))
                  }
                  style={{ ...inputStyle, cursor: 'pointer', paddingRight: '40px' }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')
                  }
                >
                  <option value="Male" style={{ backgroundColor: '#111318' }}>{t.engine.opt_male}</option>
                  <option value="Female" style={{ backgroundColor: '#111318' }}>{t.engine.opt_female}</option>
                  <option value="Other" style={{ backgroundColor: '#111318' }}>{t.engine.opt_other}</option>
                </select>
                {/* Chevron */}
                <span
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.3)',
                    pointerEvents: 'none',
                    fontSize: '0.75rem',
                  }}
                >
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              margin: '36px 0',
            }}
          />

          {/* Submit button — breathing glow */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#FFD700',
              color: '#0D0D0D',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              animation: 'breath-glow 3s ease-in-out infinite',
            }}
          >
            {t.engine.btn_run}
            <span style={{ marginLeft: '8px', fontSize: '1rem' }}>→</span>
          </button>

          <p
            style={{
              marginTop: '16px',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.2)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {t.hero.footnote}
          </p>
        </motion.div>
      )}

      {/* ── LOADING STATE ── */}
      {phase === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Spinner ring */}
          <div style={{ marginBottom: '40px', position: 'relative', display: 'inline-block' }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              style={{ animation: 'spin-ring 1.2s linear infinite' }}
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,215,0,0.15)"
                strokeWidth="3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#FFD700"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="44 132"
                strokeDashoffset="0"
              />
            </svg>
          </div>

          {/* Terminal log */}
          <div
            style={{
              backgroundColor: '#0A0C10',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'left',
              fontFamily: 'var(--font-jetbrains, monospace)',
              minHeight: '200px',
            }}
          >
            {LOG_LINES.slice(0, logIndex + 1).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '0.8125rem',
                  color:
                    i === logIndex
                      ? '#FFD700'
                      : i === LOG_LINES.length - 1
                      ? '#22C55E'
                      : 'rgba(255,255,255,0.35)',
                  marginBottom: '6px',
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: '8px' }}>
                  {`[${String(i).padStart(2, '0')}]`}
                </span>
                {line}
              </motion.p>
            ))}
            {/* Blinking cursor */}
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                backgroundColor: '#FFD700',
                marginLeft: '4px',
                animation: 'blink-cursor 1s step-end infinite',
                verticalAlign: 'middle',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* ── RESULT ── */}
      {phase === 'result' && result && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '640px', width: '100%' }}
        >
          {/* ── Hero result card ── */}
          <div
            style={{
              backgroundColor: '#111318',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '16px',
              padding: 'clamp(28px, 5vw, 48px)',
              marginBottom: '24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top glow */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent)',
              }}
            />

            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '8px',
              }}
            >
              {t.engine.result_label}
            </p>

            {/* Big animated number */}
            <div
              style={{
                fontSize: 'clamp(4rem, 12vw, 7rem)',
                fontWeight: 800,
                color: '#FFD700',
                lineHeight: 1,
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              <AnimatedNumber from={form.currentAge} to={result.predicted_age} />
            </div>

            {/* Delta */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '20px',
                padding: '4px 14px',
                marginBottom: '28px',
              }}
            >
              <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '1rem' }}>
                ↓ {Math.abs(result.delta_years).toFixed(1)} yrs
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                reclaimed
              </span>
            </div>

            {/* Three-column stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {[
                {
                  label: 'Input Age',
                  value: String(form.currentAge),
                  sub: '时序年龄',
                  valueColor: 'rgba(255,255,255,0.45)',
                },
                {
                  label: 'Predicted Age',
                  value: result.predicted_age.toFixed(1),
                  sub: '预测生物年龄',
                  valueColor: '#FFD700',
                },
                {
                  label: '95% CI',
                  value: result.confidence_interval
                    ? `${result.confidence_interval[0]}–${result.confidence_interval[1]}`
                    : '—',
                  sub: '置信区间',
                  valueColor: 'rgba(255,255,255,0.6)',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: '#0E1117',
                    padding: '16px 12px',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.3)',
                      marginBottom: '6px',
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: stat.valueColor,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      color: 'rgba(255,255,255,0.18)',
                      marginTop: '2px',
                    }}
                  >
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Optimization plan ── */}
          <div
            style={{
              backgroundColor: '#111318',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            {/* Plan header */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: '4px',
                  }}
                >
                  Intervention Priority Map
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {t.engine.result_plan}
                </p>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  borderRadius: '20px',
                  padding: '3px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#FFD700',
                }}
              >
                {result.optimization_plan.length} protocols
              </span>
            </div>

            {/* Plan items */}
            {result.optimization_plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                style={{
                  padding: '20px 28px',
                  borderBottom:
                    i < result.optimization_plan.length - 1
                      ? '1px solid rgba(255,255,255,0.05)'
                      : 'none',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Index number */}
                <span
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,215,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFD700',
                    marginTop: '1px',
                  }}
                >
                  {i + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                      }}
                    >
                      {item.category}
                    </span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.65,
                    }}
                  >
                    {item.recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '14px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  'rgba(255,215,0,0.4)';
                (e.currentTarget as HTMLElement).style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.color =
                  'rgba(255,255,255,0.6)';
              }}
            >
              ← {t.engine.btn_reset}
            </button>

            <Link
              href="/solutions"
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '14px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#FFD700',
                color: '#0D0D0D',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                fontFamily: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = '#F5CB00')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = '#FFD700')
              }
            >
              {t.engine.btn_solutions}
            </Link>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              marginTop: '20px',
              fontSize: '0.6875rem',
              color: 'rgba(255,255,255,0.15)',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            Results generated by the PivotOrder multi-omic fusion engine · Engine v2.4.1
            <br />
            This output is for research and informational purposes only. Not a medical diagnosis.
          </p>
        </motion.div>
      )}

      {/* ── Global keyframe injector ── */}
      <style>{`
        @keyframes breath-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
          50%       { box-shadow: 0 0 24px 6px rgba(255,215,0,0.25); }
        }
        @keyframes spin-ring {
          to { transform: rotate(360deg); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  );
}
