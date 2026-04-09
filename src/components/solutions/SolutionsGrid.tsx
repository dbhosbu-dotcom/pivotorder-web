'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PATHWAYS, type Pathway } from '@/lib/pathwayData';

/* ─── Card ───────────────────────────────────────────────────────────── */
function PathwayCard({ pathway, index }: { pathway: Pathway; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#14171F' : '#111318',
        border: `1px solid ${hovered ? pathway.tagColor + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '12px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
        transform: hovered ? 'translateY(-4px) scale(1.005)' : 'translateY(0) scale(1)',
        transition:
          'background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered
          ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${pathway.tagColor}20`
          : '0 4px 16px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top color bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${pathway.tagColor}, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Index + Evidence badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}
        >
          PATHWAY {pathway.index}
        </span>
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: pathway.tagColor,
            backgroundColor: pathway.tagColor + '14',
            border: `1px solid ${pathway.tagColor}30`,
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          Evidence {pathway.evidenceLevel}
        </span>
      </div>

      {/* Domain tag */}
      <div style={{ marginBottom: '14px' }}>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: pathway.tagColor,
          }}
        >
          {pathway.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          lineHeight: 1.25,
          marginBottom: '6px',
        }}
      >
        {pathway.title}
      </h3>
      <p
        style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.22)',
          marginBottom: '18px',
          letterSpacing: '0.02em',
        }}
      >
        {pathway.titleZh}
      </p>

      {/* Description EN */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.72,
          marginBottom: '8px',
          flex: 1,
        }}
      >
        {pathway.description}
      </p>

      {/* Description ZH */}
      <p
        style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.2)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        {pathway.descriptionZh}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {pathway.metrics.map((m) => (
          <div
            key={m.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'rgba(255,255,255,0.28)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {m.label}
            </span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.62)',
                textAlign: 'right',
              }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Clock target */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '6px',
          padding: '8px 12px',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: pathway.tagColor,
            flexShrink: 0,
            opacity: 0.8,
          }}
        />
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6875rem',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          Clock Target: {pathway.clockTarget}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Grid ───────────────────────────────────────────────────────────── */
export default function SolutionsGrid() {
  return (
    <section
      style={{
        padding: 'clamp(56px,7vw,96px) 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section label row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '48px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '8px',
            }}
          >
            Multi-Omic Intervention Matrix &nbsp;·&nbsp; 多组学干预矩阵
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            4 Clinical Pathways &nbsp;
            <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
              · derived from engine output
            </span>
          </h2>
        </div>

        {/* Engine source pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,215,0,0.06)',
            border: '1px solid rgba(255,215,0,0.18)',
            borderRadius: '20px',
            padding: '7px 16px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFD700',
            }}
          />
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              color: 'rgba(255,215,0,0.7)',
              letterSpacing: '0.06em',
            }}
          >
            Source: PivotOrder Engine v2.4.1
          </span>
        </div>
      </motion.div>

      {/* 2-column grid — single column on mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: '20px',
        }}
      >
        {PATHWAYS.map((pathway, i) => (
          <PathwayCard key={pathway.id} pathway={pathway} index={i} />
        ))}
      </div>
    </section>
  );
}
