'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const PILLARS = [
  { id: 'A', zh: '隐性肥胖代谢溢出', en: 'Normal Weight Obesity', tags: ['FBG', 'FINS', 'TG'], desc_zh: '正常体重下隐藏的胰岛素抵抗与代谢溢出', desc_en: 'Hidden insulin resistance under normal BMI' },
  { id: 'B', zh: '激素轴与LPS穿透', en: 'PCOS + Metabolic Endotoxemia', tags: ['DHEA-S', 'Hcy', 'LPS'], desc_zh: '雄激素轴异常叠加肠道内毒素渗透', desc_en: 'Androgen axis disruption with gut endotoxin leak' },
  { id: 'C', zh: '甲减转换障碍', en: 'T4→T3 Conversion Failure', tags: ['TSH', 'fT3', 'rT3'], desc_zh: 'T4 无法有效转换为活性 T3 的脱碘酶障碍', desc_en: 'Deiodinase axis failure preventing T4→T3 conversion' },
  { id: 'D', zh: '皮质醇监工', en: 'HPA Axis Dysregulation', tags: ['Cortisol', 'DHEA-S'], desc_zh: '慢性压力驱动 HPA 轴节律紊乱', desc_en: 'Chronic stress-driven HPA axis rhythm disruption' },
  { id: 'E', zh: '肠道海关', en: 'Gut Barrier & LPS-TLR4', tags: ['LPS', 'Zonulin', 'hsCRP'], desc_zh: '肠道屏障通透性升高，LPS激活全身炎症', desc_en: 'Gut permeability increase activating systemic inflammation' },
  { id: 'F', zh: '表观逆转', en: 'Epigenetics + Methylation', tags: ['Hcy', 'SAM', 'DNAmAge'], desc_zh: 'DNA甲基化时钟与表观遗传逆时针', desc_en: 'DNA methylation clock reversal and epigenetic remodeling' },
  { id: 'G', zh: '细胞翻新', en: 'Autophagy & Mitophagy', tags: ['p62', 'LC3-B', 'mTOR'], desc_zh: '自噬与线粒体质量控制系统优化', desc_en: 'Autophagy and mitochondrial quality control system' },
  { id: 'H', zh: '慢病盾牌', en: 'Chronic Disease GKI Shield', tags: ['GKI', 'MCT', 'BHB'], desc_zh: '代谢弹性与慢病预防的酮体代谢策略', desc_en: 'Ketone metabolism strategy for chronic disease prevention' },
  { id: 'I', zh: '血流变与时间代谢', en: 'Blood Rheology + Chrono', tags: ['Fibrinogen', 'NLR', 'RBC'], desc_zh: '血液流变学与昼夜节律代谢窗口', desc_en: 'Blood rheology and circadian metabolic window optimization' },
  { id: 'J', zh: '免疫-线粒体轴', en: 'Immune-Mitochondrial Axis', tags: ['cGAS', 'IFN-I', 'mtDNA'], desc_zh: 'cGAS-STING通路与线粒体DNA泄漏免疫激活', desc_en: 'cGAS-STING pathway and mtDNA leak immune activation' },
];

const DEPENDENCIES = [
  { zh: 'Case E（肠道屏障）必须先稳定，Case B 和 Case C 的干预才能生效。LPS 泄漏可削弱相关干预效果达 60%。', en: 'Case E (Gut Barrier) must be stabilised before Case B and C interventions become effective. LPS leak can reduce efficacy by up to 60%.' },
  { zh: 'Case G（自噬系统）是 Case F（表观遗传逆转）的物理前提。未清除受损线粒体，甲基化重编程无从落地。', en: 'Case G (Autophagy) is the physical prerequisite of Case F (Epigenetics). Without clearing damaged mitochondria, methylation reprogramming has no substrate.' },
  { zh: 'Case J（免疫线粒体轴）位于 Case C（甲状腺转换）上游。mtDNA泄漏 → IFN-I升高 → D1脱碘酶被抑制 → rT3升高、T3降低。', en: 'Case J (Immune-Mitochondrial Axis) is upstream of Case C (Thyroid). mtDNA leak → IFN-I surge → D1 deiodinase suppression → rT3↑, T3↓.' },
];

export default function PillarsPreviewSection() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ backgroundColor: 'var(--color-bg-subtle)' }}
    >
      <div className="container-site">
        {/* Section label — was text-caption 0.75rem, now 0.9375rem */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '20px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
        }}>
          <span style={{
            display: 'inline-block', width: '20px', height: '2px',
            backgroundColor: 'var(--color-accent)', flexShrink: 0,
          }} />
          <p style={{
            margin: 0, fontSize: '0.9375rem', fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--color-accent)',
          }}>
            {lang === 'zh' ? '十大代谢支柱协议' : 'THE 10-PILLAR METABOLIC PROTOCOL'}
          </p>
        </div>

        {/* Headline */}
        <h2
          className="text-h2"
          style={{
            color: 'var(--color-text-heading)',
            maxWidth: '640px',
            marginBottom: '16px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
          }}
        >
          {lang === 'zh'
            ? <>标准体检读 20 个指标。<br />我们审计 10 个代谢系统。</>
            : <>Standard checkups see 20 markers.<br />We audit 10 metabolic systems.</>}
        </h2>

        <p
          className="text-body-m"
          style={{
            maxWidth: '560px',
            marginBottom: '56px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.2s',
          }}
        >
          {lang === 'zh'
            ? 'PivotOrder 引擎不孤立读取实验室数值，而是审计 10 个互联的代谢系统——映射因果链、上游阻断因素和干预优先序列。'
            : "PivotOrder's algorithm audits 10 interconnected metabolic systems — mapping causal chains, upstream blockers, and precision intervention sequences."}
        </p>

        {/* 10 pillar grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          {PILLARS.map((p, idx) => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease-out ${0.05 * idx + 0.3}s, transform 0.5s ease-out ${0.05 * idx + 0.3}s`,
              }}
            >
              {/* Giant watermark letter */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '12px',
                  fontSize: '5rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  opacity: 0.08,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {p.id}
              </span>

              {/* Case label — decorative English-only, 0.6875rem OK */}
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--color-text-muted)',
                  fontFamily: '"JetBrains Mono", monospace',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                CASE {p.id}
              </span>

              {/* Name */}
              <h3
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '4px',
                }}
              >
                {lang === 'zh' ? p.zh : p.en}
              </h3>

              {/* Sub-description */}
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: '12px',
                }}
              >
                {lang === 'zh' ? p.desc_zh : p.desc_en}
              </p>

              {/* Marker tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: 'var(--color-accent-dim)',
                      color: '#92610A',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: '"JetBrains Mono", monospace',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dependency warnings */}
        <div
          style={{
            backgroundColor: 'rgba(255,215,0,0.06)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '12px',
            padding: '24px 28px',
            marginBottom: '48px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.8s',
          }}
        >
          <p
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--color-accent)',
              marginBottom: '14px',
            }}
          >
            {lang === 'zh' ? '⚠ 因果依赖关系' : '⚠ CAUSAL DEPENDENCIES'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEPENDENCIES.map((d, i) => (
              <p
                key={i}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {lang === 'zh' ? d.zh : d.en}
              </p>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.9s',
          }}
        >
          <Link href="/auth/register" className="btn-primary">
            {lang === 'zh' ? '获取你的支柱报告 →' : 'Get Your Pillar Report →'}
          </Link>
          <Link
            href="/pillars"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-heading)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            {lang === 'zh' ? '了解完整协议 →' : 'Learn the Full Protocol →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
