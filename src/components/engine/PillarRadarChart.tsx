'use client';

import { useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { PillarResult } from './PillarResultCard';

interface Props {
  results: PillarResult[];
}

function riskToScore(risk: 'normal' | 'medium' | 'high'): number {
  if (risk === 'normal') return 90;
  if (risk === 'medium') return 52;
  return 20;
}

function riskToColor(risk: 'normal' | 'medium' | 'high'): string {
  if (risk === 'normal') return '#22C55E';
  if (risk === 'medium') return '#FFD700';
  return '#EF4444';
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function toPath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';
}

export default function PillarRadarChart({ results }: Props) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const polyRef = useRef<SVGPolygonElement>(null);

  const N = results.length;
  if (N < 3) return null;

  const cx = 130, cy = 130, maxR = 88;
  const angles = results.map((_, i) => (i * 360) / N);
  const scores  = results.map((p) => riskToScore(p.risk));

  /* Background web rings at 25 / 50 / 75 / 100 % */
  const ringPcts = [25, 50, 75, 100];
  const ringPaths = ringPcts.map((pct) =>
    toPath(angles.map((a) => polar(cx, cy, (pct / 100) * maxR, a)))
  );

  /* Score polygon */
  const scorePoints = scores.map((s, i) => polar(cx, cy, (s / 100) * maxR, angles[i]));
  const scorePath = toPath(scorePoints);

  /* Animated fill via SVG dasharray trick on mount */
  useEffect(() => {
    const el = document.getElementById('radar-fill-poly');
    if (!el) return;
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.7s ease-out 0.2s';
      el.style.opacity = '1';
    });
  }, [results]);

  const labelR = maxR + 22;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,215,0,0.7)', margin: 0 }}>
        {isZh ? '代谢支柱风险雷达图' : 'METABOLIC PILLAR RISK RADAR'}
      </p>

      <svg width="260" height="260" viewBox="0 0 260 260" aria-hidden>
        {/* Web rings */}
        {ringPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={i === ringPcts.length - 1 ? 1.5 : 1} />
        ))}

        {/* Ring % labels at far axis */}
        {ringPcts.slice(0, 3).map((pct, i) => {
          const [lx, ly] = polar(cx, cy, (pct / 100) * maxR + 3, angles[0]);
          return (
            <text key={i} x={lx + 3} y={ly} fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">
              {pct}%
            </text>
          );
        })}

        {/* Axes */}
        {angles.map((a, i) => {
          const [x, y] = polar(cx, cy, maxR, a);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
        })}

        {/* Score polygon - filled area */}
        <path id="radar-fill-poly" d={scorePath} fill="rgba(255,215,0,0.1)" stroke="#FFD700" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Score dots */}
        {scorePoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={riskToColor(results[i].risk)} stroke="#0E1117" strokeWidth="1.5" />
        ))}

        {/* Labels */}
        {results.map((p, i) => {
          const [lx, ly] = polar(cx, cy, labelR, angles[i]);
          const rawName = isZh ? p.nameZh : p.nameEn;
          const name    = isZh ? rawName : rawName.split(' ')[0];
          const anchor: 'end' | 'start' | 'middle' =
            lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
          return (
            <text key={i} x={lx} y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill={riskToColor(p.risk)}
              fontSize="9.5"
              fontWeight="700"
              fontFamily="var(--font-jetbrains, monospace)"
            >
              {name}
            </text>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 7} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="monospace">
          {isZh ? '代谢矩阵' : 'PIVOT'}
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="monospace">
          {isZh ? 'v2.4.1' : 'MATRIX'}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { color: '#22C55E', label: isZh ? '正常区间' : 'Normal' },
          { color: '#FFD700', label: isZh ? '需要关注' : 'Monitor' },
          { color: '#EF4444', label: isZh ? '高风险' : 'High Risk' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
