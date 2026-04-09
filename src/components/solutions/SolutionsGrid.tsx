'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Data ───────────────────────────────────────────────────────────── */
interface Pathway {
  id: string;
  index: string;
  tag: string;
  tagColor: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  metrics: { label: string; value: string }[];
  evidenceLevel: string;
  clockTarget: string;
}

const PATHWAYS: Pathway[] = [
  {
    id: 'metabolic',
    index: '01',
    tag: 'Amino Acid & Lipid Kinetics',
    tagColor: '#60A5FA',
    title: 'Metabolic Pathway Optimization',
    titleZh: '代谢通路优化',
    description:
      'Targeted recalibration of cellular energy substrate utilization and protein synthesis efficiency, guided by individual amino acid and lipid metabolomic signatures. Corrects mitochondrial flux deviations identified via multi-marker panel analysis.',
    descriptionZh:
      '基于底层代谢组学数据的靶向调整，重建细胞能量底物利用率与蛋白质合成效率，纠正线粒体代谢通量偏差。',
    metrics: [
      { label: 'Primary Biomarkers', value: 'GDF-15 · CysC · TIMP1 · PAI-1' },
      { label: 'Intervention Window', value: '30–90 days' },
      { label: 'Clock Impact',        value: 'PhenoAge −2.1 yrs avg' },
    ],
    evidenceLevel: 'A',
    clockTarget: 'PhenoAge · Metabolomic Clock',
  },
  {
    id: 'epigenetic',
    index: '02',
    tag: 'DNA Methylation',
    tagColor: '#FFD700',
    title: 'Epigenetic Clock Reset',
    titleZh: '表观遗传时钟干预',
    description:
      'Precision nutritional intervention targeting aberrant CpG methylation sites detected by the Horvath 2.0 clock. Modulates upstream gene-expression regulators to reverse cellular aging trajectory without altering the underlying genomic sequence.',
    descriptionZh:
      '针对异常 DNA 甲基化位点的精准营养学干预，从基因表达层面逆转细胞衰老轨迹，不改变基因组序列。',
    metrics: [
      { label: 'Primary Biomarkers', value: 'DNAm · CpG Sites · B12/Folate Ratio' },
      { label: 'Intervention Window', value: '60–120 days' },
      { label: 'Clock Impact',        value: 'Horvath 2.0 −3.4 yrs avg' },
    ],
    evidenceLevel: 'A',
    clockTarget: 'Horvath 2.0 · GrimAge',
  },
  {
    id: 'microbiome',
    index: '03',
    tag: 'Gut-Brain Axis',
    tagColor: '#34D399',
    title: 'Microbiome Ecological Engineering',
    titleZh: '微生态工程',
    description:
      'Precision microecological intervention derived from gut microbiome diversity sequencing. Rebuilds mucosal immune barrier integrity and restores short-chain fatty acid production based on individual dysbiosis profiling.',
    descriptionZh:
      '基于肠道菌群多样性测序结果，提供重塑黏膜免疫屏障的精准微生态干预建议，恢复短链脂肪酸产量。',
    metrics: [
      { label: 'Primary Biomarkers', value: 'Shannon Index · Dysbiosis Score · SCFA' },
      { label: 'Intervention Window', value: '45–90 days' },
      { label: 'Clock Impact',        value: 'Microbiome Clock −1.8 yrs avg' },
    ],
    evidenceLevel: 'B+',
    clockTarget: 'Microbiome Diversity Clock',
  },
  {
    id: 'autonomic',
    index: '04',
    tag: 'HRV Biofeedback',
    tagColor: '#C084FC',
    title: 'Autonomic Resilience Training',
    titleZh: '自主神经适应性训练',
    description:
      'Neurobiological feedback protocol calibrated from heart-rate variability data. Elevates vagal tone and systemic metabolic stress resistance by targeting RMSSD normalization and parasympathetic dominance restoration.',
    descriptionZh:
      '基于心率变异性数据的神经生物反馈调节，提升机体对代谢应激的系统性抗性，实现迷走神经张力重建。',
    metrics: [
      { label: 'Primary Biomarkers', value: 'RMSSD · LF/HF Ratio · VO₂max' },
      { label: 'Intervention Window', value: '21–60 days' },
      { label: 'Clock Impact',        value: 'HRV Autonomic Clock −1.5 yrs avg' },
    ],
    evidenceLevel: 'B+',
    clockTarget: 'HRV Autonomic Model',
  },
];

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
        gap: '0',
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
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${pathway.tagColor}, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Index + Evidence level */}
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

        {/* Evidence level badge */}
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

      {/* Description */}
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

      {/* Thin divider */}
      <div
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          marginBottom: '20px',
        }}
      />

      {/* Metric rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {pathway.metrics.map((m) => (
          <div
            key={m.label}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}
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
