'use client';

import { motion } from 'framer-motion';
import { useT, useLanguage } from '@/context/LanguageContext';
import { ENGINE_TRIAD } from '@/lib/pathwayData';

export default function SolutionsHero() {
  const t = useT();
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#0D0F14',
        padding: 'clamp(64px,8vw,104px) 24px clamp(48px,6vw,80px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial accent glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-55%)',
          width: '680px',
          height: '320px',
          background:
            'radial-gradient(ellipse at center, rgba(255,215,0,0.055) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        {/* Lab-grade label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '5px 14px',
            marginBottom: '28px',
          }}
        >
          {/* Classification tag */}
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {t.solutions.hero_badge} &nbsp;·&nbsp; Evidence Level A
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.07 }}
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            lineHeight: 1.08,
            marginBottom: '22px',
          }}
        >
          {t.solutions.hero_headline}
        </motion.h1>

        {/* Subtitle EN */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
            color: 'rgba(255,255,255,0.42)',
            lineHeight: 1.72,
            maxWidth: '580px',
            margin: '0 auto 10px',
          }}
        >
          {t.solutions.hero_sub}
        </motion.p>

          {/* Breadcrumb flow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '6px 18px', marginBottom: '56px' }}
          >
            {[
              { label: isZh ? '引擎分析' : 'Engine Analysis', active: false },
              { label: '→', active: false },
              { label: isZh ? '干预路线图' : 'Intervention Map', active: true },
              { label: '→', active: false },
              { label: isZh ? '协议导出' : 'Protocol Export', active: false },
            ].map((item, i) => (
              <span key={i} style={{ fontSize: '0.6875rem', fontWeight: item.active ? 600 : 400, letterSpacing: '0.04em', color: item.active ? '#FFD700' : 'rgba(255,255,255,0.25)' }}>
                {item.label}
              </span>
            ))}
          </motion.div>
      </div>

      {/* ── Engine Triad ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.4 }}
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}
      >
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: '20px', fontFamily: '"JetBrains Mono", monospace' }}>
          {isZh ? '三大核心算力引擎 — 驱动所有临床路径输出' : 'THREE CORE COMPUTATION ENGINES — POWERING ALL CLINICAL PATHWAYS'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '12px' }}>
          {ENGINE_TRIAD.map((engine) => (
            <div key={engine.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${engine.color}22`, borderTop: `2px solid ${engine.color}55`, borderRadius: '10px', padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.25rem' }}>{engine.icon}</span>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    {isZh ? engine.nameZh : engine.name}
                  </p>
                  <p style={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", monospace', color: engine.color, margin: 0, letterSpacing: '0.05em' }}>
                    {engine.module}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: '0 0 12px' }}>
                {isZh ? engine.descZh : engine.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                {engine.params.map((p) => (
                  <span key={p} style={{ fontSize: '0.625rem', fontFamily: 'monospace', backgroundColor: `${engine.color}10`, border: `1px solid ${engine.color}25`, borderRadius: '3px', padding: '2px 6px', color: engine.color, opacity: 0.8 }}>
                    {p}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                {engine.endpoint}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
