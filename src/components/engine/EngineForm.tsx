'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';
import Toast from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import PillarResultCard, { type PillarResult } from '@/components/engine/PillarResultCard';
import PillarRadarChart from '@/components/engine/PillarRadarChart';
import HumanCareMessage from '@/components/engine/HumanCareMessage';
import PrintEngineResult from '@/components/engine/PrintEngineResult';
import type { AnalyzeV4Response, EBMInsight, DigitalTwin } from '@/app/api/analyze/route';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface FormState {
  currentAge:  number;
  gender:      'Male' | 'Female' | 'Other';
}

interface OptimizationItem {
  category:         string;
  categoryZh:       string;
  recommendation:   string;
  recommendationZh: string;
  priority?:        'HIGH' | 'MEDIUM' | 'LOW';
  caseLinked?:      string;
}

interface AnalysisResult {
  predicted_age:         number;
  delta_years:           number;
  confidence_interval?:  [number, number];
  optimization_plan:     OptimizationItem[];
  human_care?:           string;
  ebm_insights?:         EBMInsight[];
  digital_twin?:         DigitalTwin;
  data_completeness?:    number;
  primary_driver?:       string;
  primary_driver_zh?:    string;
  extracted_markers?:    AnalyzeV4Response['extracted_markers'];
  calc_note?:            string;
}

type Phase = 'idle' | 'loading' | 'result' | 'error';

const AGE_MIN = 18;
const AGE_MAX = 100;
const MAX_REVERSAL_RATIO = 0.20;

function minTargetAge(current: number) {
  return Math.ceil(current * (1 - MAX_REVERSAL_RATIO));
}

/* ─── Bilingual loading log lines ───────────────────────────────────── */
const LOG_LINES_ZH = [
  '正在上传体检报告至 PivotOrder 引擎…',
  '启动 Claude Vision 生物标志物提取…',
  '初始化 PhenoAge 甲基化时钟模型（Levine 2018）…',
  '加载十大代谢支柱触发阈值注册表…',
  '执行 EBM 循证交叉验证（8项规则）…',
  '评估因果依赖链与上游阻断因素…',
  '运行 90 天数字孪生预测模型…',
  '生成个性化干预优先级路线图…',
  '✓  分析完成，生物年龄向量已生成。',
];
const LOG_LINES_EN = [
  'Uploading medical report to PivotOrder engine…',
  'Activating Claude Vision biomarker extraction…',
  'Initializing PhenoAge methylation clock (Levine 2018)…',
  'Loading 10-Pillar trigger threshold registry…',
  'Running EBM cross-validation (8 clinical rules)…',
  'Evaluating causal dependency chain & upstream blockers…',
  'Running 90-day Digital Twin predictive model…',
  'Generating personalized intervention priority map…',
  '✓  Analysis complete. Biological age vector generated.',
];

/* ─── Mock fallback (fully bilingual) ───────────────────────────────── */
function buildMockResult(form: FormState): AnalysisResult {
  const noise     = parseFloat(((Math.random() - 0.5) * 0.8).toFixed(1));
  const target    = minTargetAge(form.currentAge);
  const predicted = parseFloat(
    Math.max(target, form.currentAge * (1 - 0.12) + noise).toFixed(1),
  );
  const delta = parseFloat((predicted - form.currentAge).toFixed(1));
  return {
    predicted_age: predicted,
    delta_years:   delta,
    confidence_interval: [
      parseFloat((predicted - 1.5).toFixed(1)),
      parseFloat((predicted + 1.5).toFixed(1)),
    ],
    optimization_plan: [
      {
        category: 'Epigenetic Methylation', categoryZh: '表观甲基化修复',
        recommendation: 'Ergothioneine supplementation (50–100 mg/day) combined with folate-B12 co-factors to regulate methylation clock velocity.',
        recommendationZh: '麦角硫因补充（50–100 mg/天），联合叶酸-B12 辅因子，调节甲基化时钟速率，降低 DNAmAge 漂移。',
        priority: 'HIGH', caseLinked: 'F',
      },
      {
        category: 'Metabolic Resilience', categoryZh: '代谢弹性优化',
        recommendation: 'Flash-release essential amino acid complex (9 EAAs, golden ratio) administered 30 min post-exercise to optimize mTOR pathway efficiency.',
        recommendationZh: '运动后 30 分钟补充速释型必需氨基酸复合物（9 种 EAA 黄金比例），优化 mTOR 通路效率，促进肌肉蛋白合成。',
        priority: 'HIGH', caseLinked: 'G',
      },
      {
        category: 'Gut Microbiome', categoryZh: '肠道菌群重建',
        recommendation: 'Multi-strain probiotic protocol (42 strains, 6 Trillion CFU) with prebiotic matrix to elevate Shannon diversity index above 3.5.',
        recommendationZh: '42 菌株益生菌方案（6 万亿 CFU）联合益生元基质，将 Shannon 多样性指数提升至 3.5 以上，强化肠道屏障功能。',
        priority: 'MEDIUM', caseLinked: 'E',
      },
      {
        category: 'HRV & Autonomic Balance', categoryZh: '心率变异性与自主神经平衡',
        recommendation: 'Structured HRV training (4-7-8 breathing, 2× daily) targeting RMSSD ≥ 55 ms to improve autonomic regulation score.',
        recommendationZh: '结构化心率变异性训练（4-7-8 呼吸法，每日 2 次），目标 RMSSD ≥ 55 ms，改善自主神经调节评分。',
        priority: 'MEDIUM', caseLinked: 'D',
      },
    ],
    ebm_insights: [
      {
        rule: 'TG/HDL Ratio', ruleZh: 'TG/HDL 比值', triggered: true,
        value: '1.6', threshold: '> 1.5',
        finding: 'Elevated TG/HDL ratio suggests insulin resistance and visceral fat accumulation — a key Case A indicator preceding BMI changes.',
        findingZh: 'TG/HDL 比值升高提示胰岛素抵抗与内脏脂肪积累——这是先于 BMI 变化出现的 Case A 核心指标。',
        severity: 'medium', casesLinked: ['A'],
      },
      {
        rule: 'Low-Grade Systemic Inflammation', ruleZh: '系统性低级别炎症', triggered: true,
        value: 'hsCRP 1.4 mg/L', threshold: '> 1.0',
        finding: 'hsCRP above PivotOrder optimal threshold. Combined with NLR pattern, this indicates active LPS-TLR4 cascade in Case E.',
        findingZh: 'hsCRP 超过 PivotOrder 最优阈值。结合 NLR 模式，提示 Case E 肠道 LPS-TLR4 级联通路激活。',
        severity: 'medium', casesLinked: ['E', 'J'],
      },
    ],
    digital_twin: {
      baseline_age: predicted,
      day30_projection: parseFloat((predicted - 0.4).toFixed(1)),
      day60_projection: parseFloat((predicted - 0.9).toFixed(1)),
      day90_projection: parseFloat((predicted - 1.6).toFixed(1)),
      reversal_potential: 1.6,
      key_levers: ['Gut barrier stabilization (Case E)', 'Methylation support (Case F)', 'Circadian anchoring (Case D)'],
      confidence: 'moderate',
    },
    data_completeness: 35,
    primary_driver: 'Case E',
    primary_driver_zh: '肠道海关',
  };
}

/* ─── Mock pillar results ────────────────────────────────────────────── */
function buildMockPillarResults(age: number, gender: string): PillarResult[] {
  const base: PillarResult[] = [
    {
      caseId: 'E', nameZh: '肠道海关', nameEn: 'Gut Barrier & LPS-TLR4',
      risk: age > 40 ? 'medium' : 'normal',
      flags: age > 40 ? [{ marker: 'hsCRP', value: '1.4', unit: 'mg/L', trigger: '1.0' }] : [],
      mechanism: 'hsCRP 轻度升高提示系统性低级别炎症，肠道屏障通透性可能轻度升高。LPS-TLR4 轴需要关注。',
      mechanismEn: 'Mildly elevated hsCRP suggests systemic low-grade inflammation with possible increased gut permeability.',
      suggestion: '多菌株益生菌方案 + 谷氨酰胺肠黏膜修复 + 减少精制碳水化合物',
      suggestionEn: 'Multi-strain probiotic protocol + glutamine gut lining repair + reduce refined carbohydrates',
      dependency: '⚠ 最关键上游支柱。稳定后，Case B 和 C 干预效果可提升 40–60%。',
      dependencyEn: '⚠ Most critical upstream pillar. Stabilizing increases Cases B & C efficacy by 40–60%.',
    },
    {
      caseId: 'A', nameZh: '隐性肥胖代谢溢出', nameEn: 'Normal Weight Obesity',
      risk: age > 45 ? 'medium' : 'normal',
      flags: age > 45 ? [{ marker: 'FBG', value: '5.6', unit: 'mmol/L', trigger: '5.4' }, { marker: 'FINS', value: '9.2', unit: 'µIU/mL', trigger: '8.0' }] : [],
      mechanism: '空腹血糖与胰岛素同步偏高，提示胰岛素抵抗早期阶段。TG/HDL 比值是内脏脂肪积累的灵敏代理指标。',
      mechanismEn: 'Synchronous FBG and FINS elevation indicates early insulin resistance. TG/HDL is a sensitive visceral fat proxy.',
      suggestion: '低 GI 饮食结构 + 空腹训练窗口（餐前运动）+ 肌肉量追踪',
      suggestionEn: 'Low-GI dietary structure + fasted training window (pre-meal exercise) + lean mass tracking',
      dependency: null, dependencyEn: null,
    },
    {
      caseId: 'C', nameZh: '甲减转换障碍', nameEn: 'T4→T3 Conversion Failure',
      risk: age > 42 ? 'medium' : 'normal',
      flags: age > 42 ? [{ marker: 'TSH', value: '3.2', unit: 'mIU/L', trigger: '3.0' }] : [],
      mechanism: 'TSH 轻度偏高提示垂体代偿性增加分泌，可能存在 T4→T3 转换效率下降。',
      mechanismEn: 'Mildly elevated TSH suggests compensatory pituitary secretion, possibly indicating reduced T4→T3 conversion.',
      suggestion: '硒蛋氨酸 200µg/d + 锌 30mg/d + 压力管理（降低皮质醇水平）',
      suggestionEn: 'Selenomethionine 200µg/d + Zinc 30mg/d + stress management (cortisol reduction)',
      dependency: '⚠ Case J（免疫线粒体轴）位于上游——mtDNA 泄漏激增 IFN-I，抑制 D1 脱碘酶基因。',
      dependencyEn: '⚠ Case J is upstream — mtDNA leak increases IFN-I, suppressing D1 deiodinase gene.',
    },
    {
      caseId: 'F', nameZh: '表观逆转', nameEn: 'Epigenetics + Methylation',
      risk: 'normal', flags: [],
      mechanism: '同型半胱氨酸与 B 族维生素水平在参考范围内，甲基化循环未见明显异常。',
      mechanismEn: 'Homocysteine and B-vitamin levels within reference range. No significant methylation cycle abnormalities detected.',
      suggestion: '维持当前甲基化支持方案，考虑麦角硫因 50mg/d 作为预防性干预',
      suggestionEn: 'Maintain methylation support protocol; consider ergothioneine 50mg/d as preventive intervention',
      dependency: null, dependencyEn: null,
    },
    {
      caseId: 'G', nameZh: '细胞翻新', nameEn: 'Autophagy & Mitophagy',
      risk: age > 50 ? 'medium' : 'normal', flags: [],
      mechanism: '细胞自噬活性随年龄增长自然下降。建议通过间歇性禁食和亚精胺激活自噬通量。',
      mechanismEn: 'Cellular autophagy naturally declines with age. Recommend activating autophagic flux via intermittent fasting and spermidine.',
      suggestion: '16:8 间歇性禁食方案 + 亚精胺 1–2 mg/d + 定期 72h 水断食（季度性）',
      suggestionEn: '16:8 intermittent fasting + spermidine 1–2 mg/d + periodic 72h water fasting (quarterly)',
      dependency: null, dependencyEn: null,
    },
    { caseId: 'B', nameZh: '激素轴与LPS穿透', nameEn: 'PCOS + Metabolic Endotoxemia', risk: 'normal', flags: [], mechanism: '（男性不适用此支柱）', mechanismEn: '(Not applicable for male patients)', suggestion: '—', suggestionEn: '—', dependency: null, dependencyEn: null },
    { caseId: 'D', nameZh: '皮质醇监工', nameEn: 'HPA Axis Dysregulation', risk: 'normal', flags: [], mechanism: '皮质醇节律暂无异常指标。建议维持规律睡眠与压力管理。', mechanismEn: 'No cortisol rhythm abnormalities detected. Maintain regular sleep and stress management.', suggestion: '适应原补充 + 规律睡眠节律', suggestionEn: 'Adaptogen supplementation + regular sleep circadian anchoring', dependency: null, dependencyEn: null },
    { caseId: 'H', nameZh: '慢病盾牌', nameEn: 'Chronic Disease Shield (GKI)', risk: 'normal', flags: [], mechanism: 'GKI 代谢灵活性指标暂无异常。', mechanismEn: 'GKI metabolic flexibility markers within normal range.', suggestion: '可考虑 MCT 油渐进补充方案', suggestionEn: 'Consider progressive MCT oil supplementation', dependency: null, dependencyEn: null },
    { caseId: 'I', nameZh: '血流变与时间代谢', nameEn: 'Blood Rheology + Chronometabolism', risk: 'normal', flags: [], mechanism: '纤维蛋白原与 NLR 暂无异常。', mechanismEn: 'Fibrinogen and NLR within optimal range.', suggestion: 'Omega-3（EPA 2g/d）+ 时间限制饮食', suggestionEn: 'Omega-3 (EPA 2g/d) + time-restricted feeding', dependency: null, dependencyEn: null },
    { caseId: 'J', nameZh: '免疫线粒体轴', nameEn: 'Immune-Mitochondrial Axis', risk: 'normal', flags: [], mechanism: 'cGAS-STING 通路暂无激活迹象。', mechanismEn: 'No cGAS-STING pathway activation signs detected.', suggestion: 'NAD+ 前体（NMN 250mg/d）预防性支持', suggestionEn: 'NAD+ precursor (NMN 250mg/d) preventive support', dependency: null, dependencyEn: null },
  ].filter((p) => gender === 'Female' || p.caseId !== 'B' || true) as PillarResult[];

  return base.sort((a, b) => {
    const order = { high: 0, medium: 1, normal: 2 };
    return order[a.risk] - order[b.risk];
  });
}

/* ─── AnimatedNumber ─────────────────────────────────────────────────── */
function AnimatedNumber({ to, from }: { to: number; from: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration: 2, ease: [0.16, 1, 0.3, 1],
      onUpdate(v) { node.textContent = v.toFixed(1); },
    });
    return () => controls.stop();
  }, [from, to]);
  return <span ref={ref}>{from.toFixed(1)}</span>;
}

/* ─── Priority badge ─────────────────────────────────────────────────── */
function PriorityBadge({ priority, isZh }: { priority?: string; isZh: boolean }) {
  const cfg = ({
    HIGH:   { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
    MEDIUM: { bg: 'rgba(255,215,0,0.12)',   color: '#D4A500' },
    LOW:    { bg: 'rgba(34,197,94,0.12)',   color: '#22C55E' },
  } as Record<string, { bg: string; color: string }>)[priority ?? 'LOW'] ?? { bg: 'rgba(255,255,255,0.08)', color: '#8A8A8A' };
  const label = priority === 'HIGH' ? (isZh ? '高优先' : 'HIGH') : priority === 'MEDIUM' ? (isZh ? '中优先' : 'MEDIUM') : (isZh ? '低优先' : 'LOW');
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>
      {label}
    </span>
  );
}

/* ─── Upload drop zone ───────────────────────────────────────────────── */
function UploadZone({ isZh, onFileSelect, selectedFile, locked }: {
  isZh:           boolean;
  onFileSelect:   (file: File) => void;
  selectedFile:   File | null;
  locked?:        boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => { if (!locked) onFileSelect(file); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0]; if (file) handleFile(file);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleFile(file);
  };

  const borderColor = dragOver ? '#FFD700' : selectedFile ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.12)';
  const bg          = dragOver ? 'rgba(255,215,0,0.04)' : selectedFile ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!locked) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!locked) inputRef.current?.click(); }}
      style={{ position: 'relative', border: `2px dashed ${borderColor}`, borderRadius: '12px', padding: '32px 24px', textAlign: 'center', cursor: locked ? 'default' : 'pointer', transition: 'border-color 0.2s, background-color 0.2s', backgroundColor: bg }}
    >
      {locked && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '10px', backgroundColor: 'rgba(13,13,24,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 500 }}>
            {isZh ? '登录后方可上传真实体检报告' : 'Sign in to upload your real report'}
          </p>
        </div>
      )}
      {selectedFile ? (
        <>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#22C55E', margin: '0 0 4px' }}>{selectedFile.name}</p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {isZh ? '点击可更换文件' : 'Click to change file'}
          </p>
        </>
      ) : (
        <>
          <div style={{ fontSize: '2rem', marginBottom: '14px' }}>📤</div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 6px' }}>
            {isZh ? '拖放体检报告至此' : 'Drop your checkup report here'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>
            {isZh ? '支持 PDF · 图片（JPG / PNG）' : 'Supports PDF · Image (JPG / PNG)'}
          </p>
          <span style={{ display: 'inline-block', padding: '6px 18px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem' }}>
            {isZh ? '或点击选择文件' : 'or click to browse'}
          </span>
        </>
      )}
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
}

/* ─── EBM Insights section ───────────────────────────────────────────── */
function EBMSection({ insights, isZh }: { insights: EBMInsight[]; isZh: boolean }) {
  const triggered = insights.filter((i) => i.triggered);
  if (triggered.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#0E1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.8)' }}>
          {isZh ? 'EBM 循证交叉验证' : 'EBM CROSS-VALIDATION'}
        </span>
        <span style={{ fontSize: '0.6875rem', backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
          {triggered.length} {isZh ? '条规则触发' : `rule${triggered.length > 1 ? 's' : ''} fired`}
        </span>
      </div>
      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {triggered.map((insight, i) => {
          const sevColor = insight.severity === 'high' ? '#EF4444' : insight.severity === 'medium' ? '#FFD700' : '#22C55E';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ padding: '14px 18px', backgroundColor: `${sevColor}09`, border: `1px solid ${sevColor}22`, borderLeft: `3px solid ${sevColor}`, borderRadius: '8px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', fontWeight: 700, color: sevColor }}>
                  {isZh ? insight.ruleZh : insight.rule}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
                  {insight.value} (threshold {insight.threshold})
                </span>
                {insight.casesLinked.map((c) => (
                  <span key={c} style={{ fontSize: '0.6rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', padding: '1px 6px', borderRadius: '3px', letterSpacing: '0.08em' }}>
                    CASE {c}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                {isZh ? insight.findingZh : insight.finding}
              </p>
            </motion.div>
          );
        })}
      </div>
      <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.2)', margin: 0, fontFamily: 'monospace' }}>
          {isZh
            ? '基于 PubMed · Cochrane 循证医学库 · GRADE A/B 证据等级规则'
            : 'Based on PubMed · Cochrane EBM library · GRADE A/B evidence rules'}
        </p>
      </div>
    </div>
  );
}

/* ─── Digital Twin section ───────────────────────────────────────────── */
function DigitalTwinSection({ dt, chronological, isZh }: { dt: DigitalTwin; chronological: number; isZh: boolean }) {
  const reversal = parseFloat((dt.baseline_age - dt.day90_projection).toFixed(1));
  const points = [
    { day: 0,  age: dt.baseline_age,      label: isZh ? '基线' : 'Baseline' },
    { day: 30, age: dt.day30_projection,  label: isZh ? '30天' : 'Day 30' },
    { day: 60, age: dt.day60_projection,  label: isZh ? '60天' : 'Day 60' },
    { day: 90, age: dt.day90_projection,  label: isZh ? '90天' : 'Day 90' },
  ];

  const minAge = Math.min(...points.map((p) => p.age)) - 0.5;
  const maxAge = Math.max(...points.map((p) => p.age)) + 0.5;
  const chartH = 80;
  const chartW = 320;

  const toX = (day: number) => (day / 90) * chartW;
  const toY = (age: number) => chartH - ((age - minAge) / (maxAge - minAge)) * chartH;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.day).toFixed(1)},${toY(p.age).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${toX(90)},${chartH} L0,${chartH} Z`;

  const confColor = dt.confidence === 'high' ? '#22C55E' : dt.confidence === 'moderate' ? '#FFD700' : '#8A8A8A';

  return (
    <div style={{ backgroundColor: '#0E1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(34,197,94,0.8)' }}>
          {isZh ? '90 天数字孪生预测' : '90-DAY DIGITAL TWIN PROJECTION'}
        </span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: confColor, backgroundColor: `${confColor}15`, padding: '2px 10px', borderRadius: '4px' }}>
          {isZh ? '置信度：' : 'Confidence: '}{isZh ? (dt.confidence === 'high' ? '高' : dt.confidence === 'moderate' ? '中' : '低') : dt.confidence}
        </span>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: isZh ? '基线生物年龄' : 'Baseline Bio-Age', value: `${dt.baseline_age.toFixed(1)}`, unit: isZh ? '岁' : 'yrs', color: '#FFD700' },
            { label: isZh ? '90天预测' : '90-Day Target', value: `${dt.day90_projection.toFixed(1)}`, unit: isZh ? '岁' : 'yrs', color: '#22C55E' },
            { label: isZh ? '预期逆转' : 'Projected Reversal', value: `−${reversal.toFixed(1)}`, unit: isZh ? '岁' : 'yrs', color: '#22C55E' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, margin: 0 }}>
                {stat.value}<span style={{ fontSize: '0.875rem', fontWeight: 400, marginLeft: '3px' }}>{stat.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Mini sparkline chart */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <svg width={chartW} height={chartH + 24} viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ display: 'block', margin: '0 auto' }}>
            {/* Area fill */}
            <path d={areaD} fill="rgba(34,197,94,0.07)" />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={toX(p.day)} cy={toY(p.age)} r="4" fill="#22C55E" stroke="#0E1117" strokeWidth="2" />
                <text x={toX(p.day)} y={chartH + 16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
                  {p.label}
                </text>
                <text x={toX(p.day)} y={toY(p.age) - 8} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">
                  {p.age.toFixed(1)}
                </text>
              </g>
            ))}
            {/* Chronological age reference line */}
            <line x1="0" y1={toY(chronological)} x2={chartW} y2={toY(chronological)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,3" />
          </svg>
        </div>

        {/* Key levers */}
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '10px' }}>
            {isZh ? '关键干预杠杆（80% 依从性假设）' : 'KEY INTERVENTION LEVERS (80% ADHERENCE ASSUMPTION)'}
          </p>
          {dt.key_levers.map((lever, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
              <span style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>{i + 1}.</span>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{lever}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Extracted Markers mini-display ─────────────────────────────────── */
function ExtractedMarkersBar({ markers, isZh }: { markers: AnalyzeV4Response['extracted_markers']; isZh: boolean }) {
  if (!markers || markers.length === 0) return null;
  const triggered = markers.filter((m) => m.status === 'triggered');
  return (
    <div style={{ padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
          {isZh ? `已提取 ${markers.length} 项标志物` : `${markers.length} BIOMARKERS EXTRACTED`}
        </span>
        {triggered.length > 0 && (
          <span style={{ fontSize: '0.625rem', backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444', padding: '1px 7px', borderRadius: '4px', fontWeight: 700 }}>
            {triggered.length} {isZh ? '项触发阈值' : 'triggered'}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {markers.map((m, i) => {
          const color = m.status === 'triggered' ? '#EF4444' : m.status === 'optimal' ? '#22C55E' : 'rgba(255,255,255,0.4)';
          return (
            <div key={i} style={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", monospace', backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${color}30`, borderRadius: '4px', padding: '3px 8px', color }}>
              {m.name} {m.value} {m.unit}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════ */
export default function EngineForm() {
  const { lang } = useLanguage();
  const { user, consumeFreeAnalysis, hasRemainingAnalyses, remainingFreeCount, saveAnalysis } = useAuth();
  const isZh = lang === 'zh';

  const [form, setForm]           = useState<FormState>({ currentAge: 47, gender: 'Male' });
  const [phase, setPhase]         = useState<Phase>('idle');
  const [logIndex, setLogIndex]   = useState(0);
  const [result, setResult]       = useState<AnalysisResult | null>(null);
  const [pillarResults, setPillarResults] = useState<PillarResult[]>([]);
  const [toast, setToast]         = useState<string | null>(null);
  const [careSeed]                = useState(() => Math.floor(Math.random() * 100));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isMockResult, setIsMockResult] = useState(false);

  const isLoggedIn = !!user;
  const canRunReal = isLoggedIn && hasRemainingAnalyses();
  const logLines   = isZh ? LOG_LINES_ZH : LOG_LINES_EN;

  useEffect(() => {
    if (phase !== 'loading') { setLogIndex(0); return; }
    if (logIndex >= logLines.length - 1) return;
    const t = setTimeout(() => setLogIndex((i) => i + 1), 520);
    return () => clearTimeout(t);
  }, [phase, logIndex, logLines.length]);

  const runAnalysis = useCallback(async (isMock: boolean) => {
    setPhase('loading');
    setLogIndex(0);
    setResult(null);

    if (isMock) {
      await new Promise((r) => setTimeout(r, logLines.length * 520 + 300));
      const mockResult = buildMockResult(form);
      const pillars    = buildMockPillarResults(form.currentAge, form.gender);
      setResult(mockResult);
      setPillarResults(pillars);
      setIsMockResult(true);
      setPhase('result');
      return;
    }

    setIsMockResult(false);

    try {
      let apiResult: AnalyzeV4Response;

      if (uploadedFile) {
        // Real file upload → Claude Vision analysis
        const fd = new FormData();
        fd.append('file', uploadedFile);
        fd.append('age', String(form.currentAge));
        fd.append('gender', form.gender);

        const res = await fetch('/api/analyze', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }
        apiResult = await res.json();
      } else {
        // No file: call with age+gender only (fallback)
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ age: form.currentAge, gender: form.gender }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }
        apiResult = await res.json();
      }

      // Map API response to frontend types
      const mapped: AnalysisResult = {
        predicted_age:     apiResult.biological_age.predicted,
        delta_years:       apiResult.biological_age.delta,
        confidence_interval: apiResult.biological_age.confidence_interval,
        optimization_plan: apiResult.optimization_plan.map((item) => ({
          category:         item.category,
          categoryZh:       item.categoryZh,
          recommendation:   item.recommendation,
          recommendationZh: item.recommendationZh,
          priority:         item.priority,
          caseLinked:       item.caseLinked,
        })),
        ebm_insights:      apiResult.ebm_insights,
        digital_twin:      apiResult.digital_twin,
        data_completeness: apiResult.data_completeness,
        primary_driver:    apiResult.primary_driver,
        primary_driver_zh: apiResult.primary_driver_zh,
        extracted_markers: apiResult.extracted_markers,
        calc_note:         apiResult.biological_age.calculation_note,
      };

      const pillars: PillarResult[] = apiResult.pillar_results.map((p) => ({
        caseId:       p.caseId,
        nameZh:       p.nameZh,
        nameEn:       p.nameEn,
        risk:         p.risk,
        flags:        p.flags,
        mechanism:    p.mechanism,
        mechanismEn:  p.mechanismEn,
        suggestion:   p.suggestion,
        suggestionEn: p.suggestionEn,
        dependency:   p.dependency ?? undefined,
        dependencyEn: p.dependencyEn ?? undefined,
      }));

      setResult(mapped);
      setPillarResults(pillars);
      setPhase('result');

      if (isLoggedIn) {
        consumeFreeAnalysis();
        saveAnalysis({
          type: 'upload',
          biologicalAge:    mapped.predicted_age,
          chronologicalAge: form.currentAge,
          delta:            mapped.delta_years,
          topFlags:         pillars.filter((p) => p.risk !== 'normal').map((p) => p.caseId),
          pillarSummary:    pillars.map((p) => ({ caseId: p.caseId, nameZh: p.nameZh, nameEn: p.nameEn, risk: p.risk })),
          optimizationItems: mapped.optimization_plan,
        });
      }
    } catch (err) {
      console.error('[EngineForm]', err);
      setToast(isZh ? '引擎连接异常，已切换为演示数据…' : 'Engine error — switching to demo data…');
      await new Promise((r) => setTimeout(r, 600));
      const mockResult = buildMockResult(form);
      setIsMockResult(true);
      setResult(mockResult);
      setPillarResults(buildMockPillarResults(form.currentAge, form.gender));
      setPhase('result');
    }
  }, [form, uploadedFile, isLoggedIn, isZh, consumeFreeAnalysis, saveAnalysis, logLines.length]);

  function handleReset() {
    setPhase('idle'); setResult(null); setPillarResults([]); setIsMockResult(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '0.9375rem',
    outline: 'none', transition: 'border-color 0.2s', appearance: 'none', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px',
  };

  return (
    <>
      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}

      {/* ── FREE ANALYSIS BANNER ── */}
      {isLoggedIn && canRunReal && phase === 'idle' && (
        <div style={{ width: '100%', maxWidth: '880px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '10px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              {isZh
                ? `欢迎回来，${user.name}！你还有 ${remainingFreeCount()} 次免费分析机会，上传报告立即解读。`
                : `Welcome back, ${user.name}! You have ${remainingFreeCount()} free ${remainingFreeCount() === 1 ? 'analysis' : 'analyses'} remaining.`}
            </p>
          </div>
        </div>
      )}

      {/* ── PAYWALL ── */}
      {isLoggedIn && !canRunReal && phase === 'idle' && (
        <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔬</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            {isZh ? '免费次数已用完' : 'Free Analysis Used'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.65 }}>
            {isZh ? '升级至专业版，解锁无限次体检报告解读、历史追踪与趋势分析。' : 'Upgrade to Pro for unlimited analyses, history tracking, and trend charts.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => alert(isZh ? '支付功能即将上线！' : 'Payment coming soon!')} style={{ width: '100%', padding: '13px', borderRadius: '8px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9375rem' }}>
              {isZh ? '升级专业版 →' : 'Upgrade to Pro →'}
            </button>
            <button onClick={() => runAnalysis(true)} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.875rem' }}>
              ⚡ {isZh ? '继续使用模拟数据体验' : 'Continue with demo data'}
            </button>
          </div>
        </div>
      )}

      {/* ── FORM CARD ── */}
      {phase === 'idle' && (!isLoggedIn || canRunReal) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: 'clamp(32px, 5vw, 48px)', maxWidth: '560px', width: '100%' }}
        >
          {/* Card header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '20px', padding: '4px 12px', marginBottom: '18px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22C55E', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                {isZh ? '引擎在线 · Claude Vision v3.5 · PhenoAge v2' : 'Engine Online · Claude Vision v3.5 · PhenoAge v2'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.2 }}>
              {isZh ? '上传你的体检报告' : 'Upload Your Medical Report'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
              {isZh
                ? 'Claude Vision 自动提取生物标志物 → PhenoAge 生物年龄计算 → EBM 交叉验证 → 90天数字孪生预测'
                : 'Claude Vision extracts biomarkers → PhenoAge biological age → EBM cross-validation → 90-day Digital Twin projection'}
            </p>
          </div>

          {/* Upload zone */}
          <UploadZone isZh={isZh} onFileSelect={setUploadedFile} selectedFile={uploadedFile} locked={!isLoggedIn} />

          {/* Login links */}
          {!isLoggedIn && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
              <Link href="/auth/login" style={{ padding: '8px 20px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
                {isZh ? '登录' : 'Sign In'}
              </Link>
              <Link href="/auth/register" style={{ padding: '8px 20px', borderRadius: '6px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                {isZh ? '注册，前 3 次分析免费 →' : 'Register — 3 Free Analyses →'}
              </Link>
            </div>
          )}

          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isZh ? '基础参数' : 'Basic parameters'}
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Age + gender */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{isZh ? '当前年龄' : 'Current Age'}</label>
              <input type="number" min={AGE_MIN} max={AGE_MAX} value={form.currentAge}
                onChange={(e) => { const v = Math.min(AGE_MAX, Math.max(AGE_MIN, Number(e.target.value))); setForm((prev) => ({ ...prev, currentAge: v })); }}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{isZh ? '生物性别' : 'Biological Sex'}</label>
              <select value={form.gender} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as FormState['gender'] }))} style={inputStyle}>
                <option value="Male">{isZh ? '男性' : 'Male'}</option>
                <option value="Female">{isZh ? '女性' : 'Female'}</option>
                <option value="Other">{isZh ? '其他' : 'Other'}</option>
              </select>
            </div>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.2)', marginTop: '6px', lineHeight: 1.5 }}>
            {isZh ? `目标生物年龄自动设为当前年龄的 80%（${minTargetAge(form.currentAge)} 岁）` : `Target biological age auto-set to 80% of current (${minTargetAge(form.currentAge)} yrs)`}
          </p>

          {/* Engine pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px', marginBottom: '4px' }}>
            {[
              isZh ? 'Claude Vision 提取' : 'Claude Vision',
              isZh ? 'PhenoAge 生物时钟' : 'PhenoAge Clock',
              isZh ? 'EBM 交叉验证' : 'EBM Validation',
              isZh ? '90天数字孪生' : 'Digital Twin',
            ].map((pill) => (
              <span key={pill} style={{ fontSize: '0.625rem', fontFamily: 'monospace', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 8px', color: 'rgba(255,255,255,0.3)' }}>
                {pill}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => runAnalysis(isLoggedIn ? !canRunReal : true)}
            style={{ width: '100%', marginTop: '18px', padding: '15px', borderRadius: '10px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
          >
            {isLoggedIn && canRunReal && uploadedFile
              ? (isZh ? `分析「${uploadedFile.name.length > 18 ? uploadedFile.name.slice(0, 18) + '…' : uploadedFile.name}」→` : `Analyze "${uploadedFile.name.length > 20 ? uploadedFile.name.slice(0, 20) + '…' : uploadedFile.name}" →`)
              : isLoggedIn && canRunReal
                ? (isZh ? '开始引擎分析 →' : 'Run Engine Analysis →')
                : (isZh ? '⚡ 体验演示' : '⚡ Run Demo')}
          </button>

          {!isLoggedIn && (
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)' }}>
              ⚡ {isZh ? '演示模式 · 无需登录 · 使用示例数据' : 'Demo mode · No account required · uses sample data'}
            </p>
          )}
        </motion.div>
      )}

      {/* ── LOADING STATE ── */}
      {phase === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ width: '100%', maxWidth: '520px', backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '48px 40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid rgba(255,215,0,0.2)', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin-ring 0.8s linear infinite', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                {isZh ? '引擎分析运行中…' : 'Engine Analysis Running…'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                {isZh ? 'Claude Vision + PhenoAge + EBM + 数字孪生' : 'Claude Vision + PhenoAge + EBM + Digital Twin'}
              </p>
            </div>
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem' }}>
            {logLines.slice(0, logIndex + 1).map((line, i) => (
              <div key={i} style={{ padding: '4px 0', color: i === logIndex ? '#FFD700' : 'rgba(255,255,255,0.3)', display: 'flex', gap: '10px' }}>
                <span style={{ color: 'rgba(255,215,0,0.4)' }}>[{String(i).padStart(2, '0')}]</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── RESULT STATE ── */}
      {phase === 'result' && result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Mock banner */}
          {isMockResult && (
            <div style={{ backgroundColor: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', padding: '11px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚡</span>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0, flex: 1 }}>
                {isZh ? '当前为模拟演示数据，仅供体验。上传真实体检报告可获取 Claude Vision 解读 + EBM 交叉验证 + 数字孪生预测。' : 'Demo mode — mock data. Upload your real report for Claude Vision extraction + EBM validation + Digital Twin projection.'}
              </p>
              <Link href="/auth/register" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFD700', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {isZh ? '注册免费上传 →' : 'Register Free →'}
              </Link>
            </div>
          )}

          {/* Primary driver badge */}
          {result.primary_driver && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                {isZh ? '首要代谢阻断因素' : 'PRIMARY METABOLIC BLOCKER'}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#EF4444' }}>
                {result.primary_driver} — {isZh ? result.primary_driver_zh : result.primary_driver}
              </span>
              {result.data_completeness !== undefined && (
                <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                  {isZh ? `数据完整度 ${result.data_completeness}%` : `Data completeness: ${result.data_completeness}%`}
                </span>
              )}
            </div>
          )}

          {/* Section 1: Bio-age vector */}
          <div style={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {isZh ? '生物年龄向量 · PhenoAge (Levine 2018)' : 'BIOLOGICAL AGE VECTOR · PhenoAge (Levine 2018)'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
              {[
                { label: isZh ? '时序年龄' : 'Chronological', value: String(form.currentAge), color: 'rgba(255,255,255,0.45)' },
                { label: isZh ? '预测生物年龄' : 'Biological Age', value: <AnimatedNumber from={form.currentAge} to={result.predicted_age} />, color: '#FFD700', isNode: true },
                { label: isZh ? '年龄落差' : 'Age Delta', value: `${result.delta_years > 0 ? '+' : ''}${result.delta_years.toFixed(1)} ${isZh ? '岁' : 'yrs'}`, color: result.delta_years < 0 ? '#22C55E' : '#EF4444' },
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: '#0E1117', padding: '20px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Confidence interval */}
            {result.confidence_interval && (
              <div style={{ padding: '8px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)', margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                  {isZh ? '95% 置信区间：' : '95% CI: '}[{result.confidence_interval[0]} — {result.confidence_interval[1]}]
                  {result.calc_note && <span style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.15)' }}>· {result.calc_note}</span>}
                </p>
              </div>
            )}

            {/* Radar chart */}
            {pillarResults.length > 0 && (
              <div style={{ padding: '28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <PillarRadarChart results={pillarResults} />
              </div>
            )}

            {/* Extracted markers */}
            {result.extracted_markers && result.extracted_markers.length > 0 && (
              <div style={{ padding: '12px 28px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <ExtractedMarkersBar markers={result.extracted_markers} isZh={isZh} />
              </div>
            )}

            {/* Optimization plan */}
            <div style={{ padding: '20px 28px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
                {isZh ? '个性化干预优先级路线图' : 'PERSONALIZED INTERVENTION PRIORITY MAP'}
              </p>
              {result.optimization_plan.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  style={{ padding: '16px 0', borderBottom: i < result.optimization_plan.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', gap: '14px', alignItems: 'flex-start' }}
                >
                  <span style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(255,215,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#FFD700', marginTop: '1px' }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {isZh ? item.categoryZh : item.category}
                      </span>
                      <PriorityBadge priority={item.priority} isZh={isZh} />
                      {item.caseLinked && (
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', padding: '1px 6px', borderRadius: '3px', letterSpacing: '0.08em' }}>
                          CASE {item.caseLinked}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>
                      {isZh ? item.recommendationZh : item.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 2: EBM Cross-Validation */}
          {result.ebm_insights && result.ebm_insights.filter((i) => i.triggered).length > 0 && (
            <EBMSection insights={result.ebm_insights} isZh={isZh} />
          )}

          {/* Section 3: Digital Twin */}
          {result.digital_twin && (
            <DigitalTwinSection dt={result.digital_twin} chronological={form.currentAge} isZh={isZh} />
          )}

          {/* Section 4: 10-Pillar Audit */}
          {pillarResults.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '4px' }}>
                    {isZh ? '十大代谢支柱评估' : 'YOUR 10-PILLAR METABOLIC AUDIT'}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
                    {isZh ? '代谢系统因果优先级分析' : 'Causal Priority Metabolic Analysis'}
                  </p>
                </div>
                <Link href="/pillars" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                  {isZh ? '了解完整协议 →' : 'Full Protocol →'}
                </Link>
              </div>
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pillarResults.map((p, i) => (
                  <PillarResultCard key={p.caseId} result={p} rank={i + 1} />
                ))}
              </div>
              <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'rgba(255,215,0,0.04)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {isZh ? '⚡ 干预优先序：排名靠前的支柱通常是上游阻断因素，必须优先处理。' : '⚡ Intervention priority: Higher-ranked pillars are upstream blockers — address them first.'}
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Human Care Message */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px 28px' }}>
            <HumanCareMessage seed={careSeed} />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleReset} style={{ flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.4)'; (e.currentTarget as HTMLElement).style.color = '#FFD700'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
            >
              ← {isZh ? '重新分析' : 'New Analysis'}
            </button>
            {isLoggedIn && (
              <Link href="/profile?tab=reports" style={{ flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {isZh ? '我的报告 →' : 'My Reports →'}
              </Link>
            )}
            <button onClick={() => window.print()} style={{ flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,215,0,0.35)', backgroundColor: 'rgba(255,215,0,0.08)', color: '#FFD700', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,215,0,0.15)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,215,0,0.08)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M4 7l4 4 4-4M2 12h12" stroke="#FFD700" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {isZh ? '导出 PDF 报告' : 'Export PDF'}
            </button>
            <Link href="/solutions" style={{ flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#FFD700', color: '#0D0D0D', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#F5CB00')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#FFD700')}
            >
              {isZh ? '查看临床路径 →' : 'View Solutions →'}
            </Link>
          </div>

          {/* Footer disclaimer */}
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1.6, textAlign: 'center' }}>
            {isZh
              ? 'PivotOrder 多组学融合引擎 · Claude Vision + PhenoAge + EBM · 引擎 v3.0\n本输出仅供研究及信息参考，不构成医学诊断建议。'
              : 'PivotOrder Multi-omic Fusion Engine · Claude Vision + PhenoAge + EBM · Engine v3.0\nFor research and informational purposes only. Not a medical diagnosis.'}
          </p>
        </motion.div>
      )}

      {/* Print-only report */}
      {result && (
        <PrintEngineResult
          chronologicalAge={form.currentAge}
          biologicalAge={result.predicted_age}
          delta={result.delta_years}
          confidenceInterval={result.confidence_interval}
          optimizationPlan={result.optimization_plan}
          pillarResults={pillarResults.map((p) => ({ caseId: p.caseId, nameZh: p.nameZh, nameEn: p.nameEn, risk: p.risk }))}
          isZh={isZh}
          isMock={isMockResult}
        />
      )}

      <style>{`@keyframes spin-ring { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
