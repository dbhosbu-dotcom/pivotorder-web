'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export type RiskLevel = 'high' | 'medium' | 'normal';

export interface PillarFlag {
  marker: string;
  value: string;
  unit: string;
  trigger: string;
}

export interface PillarResult {
  caseId: string;   // 'A' | 'B' | ... | 'J'
  nameZh: string;
  nameEn: string;
  risk: RiskLevel;
  flags: PillarFlag[];
  mechanism: string;
  mechanismEn: string;
  suggestion: string;
  suggestionEn: string;
  dependency?: string;
  dependencyEn?: string;
}

interface Props {
  result: PillarResult;
  rank: number;
}

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; label_zh: string; label_en: string; border: string }> = {
  high:   { color: '#EF4444', bg: 'rgba(239,68,68,0.06)',   label_zh: '高风险', label_en: 'HIGH RISK',   border: '#EF4444' },
  medium: { color: '#D4A500', bg: 'rgba(255,215,0,0.08)',   label_zh: '中风险', label_en: 'FLAG',        border: '#FFD700' },
  normal: { color: '#22C55E', bg: 'rgba(34,197,94,0.06)',   label_zh: '正常范围', label_en: 'OPTIMAL',   border: '#22C55E' },
};

export default function PillarResultCard({ result, rank }: Props) {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(result.risk !== 'normal');

  const cfg = RISK_CONFIG[result.risk];
  const name = lang === 'zh' ? result.nameZh : result.nameEn;
  const mechanism = lang === 'zh' ? result.mechanism : result.mechanismEn;
  const suggestion = lang === 'zh' ? result.suggestion : result.suggestionEn;
  const dependency = lang === 'zh' ? result.dependency : result.dependencyEn;

  return (
    <div
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}33`,
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: '10px',
        padding: '20px 24px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: result.risk === 'normal' ? 'pointer' : 'default',
          justifyContent: 'space-between',
        }}
        onClick={() => result.risk === 'normal' && setExpanded((v) => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* Priority rank badge */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: cfg.color,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {rank}
          </div>

          {/* Case label + name */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#8A8A8A',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                CASE {result.caseId}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1F2937',
                }}
              >
                {name}
              </span>
            </div>
          </div>
        </div>

        {/* Risk badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: cfg.color,
              backgroundColor: `${cfg.color}18`,
              padding: '3px 10px',
              borderRadius: '4px',
            }}
          >
            {lang === 'zh' ? cfg.label_zh : cfg.label_en}
          </span>

          {result.risk === 'normal' && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                color: '#8A8A8A',
              }}
            >
              <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${cfg.border}22` }}>
          {/* Flags list */}
          {result.flags.length > 0 && (
            <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.flags.map((flag, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    border: `1px solid ${cfg.border}44`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#1F2937', fontFamily: '"JetBrains Mono", monospace' }}>
                    {flag.marker}
                  </span>
                  <span style={{ color: cfg.color, fontWeight: 700, margin: '0 6px' }}>
                    {flag.value} {flag.unit}
                  </span>
                  <span style={{ color: '#8A8A8A', fontSize: '0.75rem' }}>
                    ({lang === 'zh' ? '触发' : 'trigger'} {'>'} {flag.trigger})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Mechanism */}
          <p style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: 1.65, marginBottom: '10px' }}>
            {mechanism}
          </p>

          {/* Suggestion */}
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, marginBottom: dependency ? '12px' : 0 }}>
            <span style={{ fontWeight: 600, color: '#1F2937' }}>
              {lang === 'zh' ? '建议：' : 'Recommendation: '}
            </span>
            {suggestion}
          </p>

          {/* Dependency warning */}
          {dependency && (
            <div
              style={{
                backgroundColor: 'rgba(255,215,0,0.12)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '0.8125rem',
                color: '#92610A',
                lineHeight: 1.6,
              }}
            >
              ⚠ {dependency}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
