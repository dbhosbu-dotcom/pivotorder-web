'use client';

import { motion } from 'framer-motion';
import { useT } from '@/context/LanguageContext';

export default function SolutionsHero() {
  const t = useT();
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '6px 18px' }}
          >
            {[
              { label: 'Engine Analysis', active: false },
              { label: '→',              active: false },
              { label: 'Intervention Map', active: true  },
              { label: '→',              active: false },
              { label: 'Protocol Export', active: false },
            ].map((item, i) => (
              <span key={i} style={{ fontSize: '0.6875rem', fontWeight: item.active ? 600 : 400, letterSpacing: '0.04em', color: item.active ? '#FFD700' : 'rgba(255,255,255,0.25)' }}>
                {item.label}
              </span>
            ))}
          </motion.div>
      </div>
    </div>
  );
}
