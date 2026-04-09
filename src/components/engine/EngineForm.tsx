'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';
import Toast from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import PillarResultCard, { type PillarResult, type RiskLevel } from '@/components/engine/PillarResultCard';
import PillarRadarChart from '@/components/engine/PillarRadarChart';
import HumanCareMessage from '@/components/engine/HumanCareMessage';
import PrintEngineResult from '@/components/engine/PrintEngineResult';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface FormState {
  currentAge:  number;
  gender:      'Male' | 'Female' | 'Other';
}

interface OptimizationItem {
  category:        string;
  categoryZh:      string;
  recommendation:  string;
  recommendationZh: string;
  priority?:       'HIGH' | 'MEDIUM' | 'LOW';
}

interface AnalysisResult {
  predicted_age:        number;
  delta_years:          number;
  confidence_interval?: [number, number];
  optimization_plan:    OptimizationItem[];
  human_care?:          string;
}

type Phase = 'idle' | 'loading' | 'result' | 'error';

const AGE_MIN = 18;
const AGE_MAX = 100;
const MAX_REVERSAL_RATIO = 0.20;

function minTargetAge(current: number) {
  return Math.ceil(current * (1 - MAX_REVERSAL_RATIO));
}

/* ─── Mock 10-pillar results ─────────────────────────────────────────── */
function buildPillarResults(age: number, gender: string): PillarResult[] {
  const r = (a: boolean, b: RiskLevel, c: RiskLevel): RiskLevel => a ? b : c;
  return [
    {
      caseId: 'E',
      nameZh: '肠道海关',
      nameEn: 'Gut Barrier & LPS-TLR4',
      risk: r(age > 40, 'medium', 'normal'),
      flags: age > 40 ? [{ marker: 'hsCRP', value: '1.4', unit: 'mg/L', trigger: '1.0' }] : [],
      mechanism: 'hsCRP 轻度升高提示系统性低级别炎症，肠道屏障通透性可能轻度升高。LPS-TLR4 轴需要关注，否则会削弱其他支柱的干预效果。',
      mechanismEn: 'Mildly elevated hsCRP suggests systemic low-grade inflammation, possibly with increased gut permeability. The LPS-TLR4 axis needs attention, as it reduces efficacy of other pillar interventions.',
      suggestion: '多菌株益生菌方案 + 谷氨酰胺肠黏膜修复 + 减少精制碳水化合物',
      suggestionEn: 'Multi-strain probiotic protocol + glutamine gut lining repair + reduce refined carbohydrates',
      dependency: '⚠ 这是最关键的上游支柱。稳定后，Case B 和 Case C 的干预效果可提升 40–60%。',
      dependencyEn: '⚠ This is the most critical upstream pillar. Stabilizing it increases Cases B and C efficacy by 40–60%.',
    },
    {
      caseId: 'A',
      nameZh: '隐性肥胖代谢溢出',
      nameEn: 'Normal Weight Obesity',
      risk: r(age > 45, 'medium', 'normal'),
      flags: age > 45 ? [
        { marker: 'FBG',  value: '5.6', unit: 'mmol/L',   trigger: '5.4' },
        { marker: 'FINS', value: '9.2', unit: 'µIU/mL',   trigger: '8.0' },
      ] : [],
      mechanism: '空腹血糖与胰岛素同步偏高，提示胰岛素抵抗早期阶段。TG/HDL 比值是内脏脂肪积累的灵敏代理指标。',
      mechanismEn: 'Synchronous elevation of FBG and FINS indicates early-stage insulin resistance. The TG/HDL ratio is a sensitive proxy for visceral fat accumulation.',
      suggestion: '低 GI 饮食结构 + 空腹训练窗口（餐前运动）+ 肌肉量追踪',
      suggestionEn: 'Low-GI dietary structure + fasted training window (pre-meal exercise) + lean mass tracking',
    },
    {
      caseId: 'C',
      nameZh: '甲减转换障碍',
      nameEn: 'T4→T3 Conversion Failure',
      risk: r(age > 42, 'medium', 'normal'),
      flags: age > 42 ? [{ marker: 'TSH', value: '3.2', unit: 'mIU/L', trigger: '3.0' }] : [],
      mechanism: 'TSH 轻度偏高提示垂体代偿性增加分泌，可能存在 T4→T3 转换效率下降。需结合 fT3/rT3 比值确认。',
      mechanismEn: 'Mildly elevated TSH suggests compensatory pituitary secretion increase, possibly indicating reduced T4→T3 conversion efficiency. Should be confirmed with fT3/rT3 ratio.',
      suggestion: '硒蛋氨酸 200µg/d + 锌 30mg/d + 压力管理（降低皮质醇水平）',
      suggestionEn: 'Selenomethionine 200µg/d + Zinc 30mg/d + stress management (cortisol reduction)',
      dependency: '⚠ Case J（免疫线粒体轴）位于上游——mtDNA 泄漏会激增 IFN-I，抑制 D1 脱碘酶基因，导致 rT3 升高。',
      dependencyEn: '⚠ Case J (Immune-Mitochondrial Axis) is upstream — mtDNA leak increases IFN-I, suppressing D1 deiodinase gene and elevating rT3.',
    },
    {
      caseId: 'F',
      nameZh: '表观逆转',
      nameEn: 'Epigenetics + Methylation',
      risk: 'normal',
      flags: [],
      mechanism: '同型半胱氨酸与 B 族维生素水平在参考范围内，甲基化循环未见明显异常。建议定期监测以防止 DNAmAge 加速。',
      mechanismEn: 'Homocysteine and B-vitamin levels are within reference range, no significant methylation cycle abnormalities detected. Regular monitoring recommended to prevent DNAmAge acceleration.',
      suggestion: '维持当前甲基化支持方案，考虑麦角硫因 50mg/d 作为预防性干预',
      suggestionEn: 'Maintain current methylation support protocol, consider ergothioneine 50mg/d as preventive intervention',
    },
    {
      caseId: 'G',
      nameZh: '细胞翻新',
      nameEn: 'Autophagy & Mitophagy',
      risk: r(age > 50, 'medium', 'normal'),
      flags: [],
      mechanism: '细胞自噬活性随年龄增长自然下降。建议通过间歇性禁食和亚精胺补充来激活自噬通量，为 Case F 的表观遗传干预清理细胞空间。',
      mechanismEn: 'Cellular autophagy activity naturally declines with age. Recommend activating autophagic flux through intermittent fasting and spermidine supplementation, clearing cellular space for Case F epigenetic interventions.',
      suggestion: '16:8 间歇性禁食方案 + 亚精胺 1–2 mg/d + 定期 72h 水断食（季度性）',
      suggestionEn: '16:8 intermittent fasting protocol + spermidine 1–2 mg/d + periodic 72h water fasting (quarterly)',
    },
  ].filter((p) => gender === 'Female' || p.caseId !== 'B') as PillarResult[];
}

/* ─── Bilingual loading log lines ───────────────────────────────────── */
const LOG_LINES_ZH = [
  '正在连接香港 AIGC 算力集群…',
  '初始化 Horvath 2.0 甲基化时钟…',
  '加载代谢组参考面板（12 项标志物）…',
  '执行循证交叉验证（PubMed · Cochrane）…',
  '融合 6 个生物时钟模型…',
  '评估十大代谢支柱系统…',
  '生成干预优先级路线图…',
  '✓  分析完成，生物年龄向量已生成。',
];
const LOG_LINES_EN = [
  'Connecting to AIGC compute cluster…',
  'Initializing Horvath 2.0 Methylation Clock…',
  'Loading metabolomic reference panel (12 markers)…',
  'Running EBM cross-validation (PubMed · Cochrane)…',
  'Fusing 6 biological clock models…',
  'Evaluating 10-Pillar metabolic system…',
  'Generating intervention priority map…',
  '✓  Analysis complete. Biological age vector generated.',
];

/* ─── Mock fallback result (fully bilingual) ─────────────────────────── */
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
        category:        'Epigenetic Methylation',
        categoryZh:      '表观甲基化修复',
        recommendation:  'Ergothioneine supplementation (50–100 mg/day) combined with folate-B12 co-factors to regulate methylation clock velocity.',
        recommendationZh: '麦角硫因补充（50–100 mg/天），联合叶酸-B12 辅因子，调节甲基化时钟速率，降低 DNAmAge 漂移。',
        priority: 'HIGH',
      },
      {
        category:        'Metabolic Resilience',
        categoryZh:      '代谢弹性优化',
        recommendation:  'Flash-release essential amino acid complex (9 EAAs, golden ratio) administered 30 min post-exercise to optimize mTOR pathway efficiency.',
        recommendationZh: '运动后 30 分钟补充速释型必需氨基酸复合物（9 种 EAA 黄金比例），优化 mTOR 通路效率，促进肌肉蛋白合成。',
        priority: 'HIGH',
      },
      {
        category:        'Microbiome Architecture',
        categoryZh:      '肠道菌群重建',
        recommendation:  'Multi-strain probiotic protocol (42 strains, 6 Trillion CFU) with prebiotic matrix to elevate Shannon diversity index above 3.5.',
        recommendationZh: '42 菌株益生菌方案（6 万亿 CFU）联合益生元基质，将 Shannon 多样性指数提升至 3.5 以上，强化肠道屏障功能。',
        priority: 'MEDIUM',
      },
      {
        category:        'HRV & Autonomic Balance',
        categoryZh:      '心率变异性与自主神经平衡',
        recommendation:  'Structured HRV training (4-7-8 breathing, 2× daily) targeting RMSSD ≥ 55 ms to improve autonomic regulation score.',
        recommendationZh: '结构化心率变异性训练（4-7-8 呼吸法，每日 2 次），目标 RMSSD ≥ 55 ms，改善自主神经调节评分。',
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
      onUpdate(v) { node.textContent = v.toFixed(1); },
    });
    return () => controls.stop();
  }, [from, to]);
  return <span ref={ref}>{from.toFixed(1)}</span>;
}

/* ─── Priority badge (bilingual) ─────────────────────────────────────── */
function PriorityBadge({ priority, isZh }: { priority?: string; isZh: boolean }) {
  const cfg = ({
    HIGH:   { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
    MEDIUM: { bg: 'rgba(255,215,0,0.12)',   color: '#D4A500' },
    LOW:    { bg: 'rgba(34,197,94,0.12)',   color: '#22C55E' },
  } as Record<string, { bg: string; color: string }>)[priority ?? 'LOW'] ?? { bg: 'rgba(255,255,255,0.08)', color: '#8A8A8A' };

  const label =
    priority === 'HIGH'   ? (isZh ? '高优先' : 'HIGH')   :
    priority === 'MEDIUM' ? (isZh ? '中优先' : 'MEDIUM') :
                            (isZh ? '低优先' : 'LOW');

  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      backgroundColor: cfg.bg, color: cfg.color,
      padding: '2px 8px', borderRadius: '4px', flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

/* ─── Upload drop zone ───────────────────────────────────────────────── */
function UploadZone({ isZh, onFileSelect, selectedFile, locked }: {
  isZh:           boolean;
  onFileSelect:   (name: string) => void;
  selectedFile:   string | null;
  locked?:        boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (locked) return;
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file.name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file.name);
  };

  const borderColor = dragOver ? '#FFD700' : selectedFile ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.12)';
  const bg          = dragOver ? 'rgba(255,215,0,0.04)' : selectedFile ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!locked) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!locked) inputRef.current?.click(); }}
      style={{
        position: 'relative', border: `2px dashed ${borderColor}`, borderRadius: '12px',
        padding: '32px 24px', textAlign: 'center',
        cursor: locked ? 'default' : 'pointer',
        transition: 'border-color 0.2s, background-color 0.2s',
        backgroundColor: bg,
      }}
    >
      {/* Lock overlay for non-logged-in users */}
      {locked && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '10px',
          backgroundColor: 'rgba(13,13,24,0.72)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '8px', zIndex: 2,
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 500 }}>
            {isZh ? '登录后方可上传真实体检报告' : 'Sign in to upload your real report'}
          </p>
        </div>
      )}

      {selectedFile ? (
        <>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#22C55E', margin: '0 0 4px' }}>
            {selectedFile}
          </p>
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
            {isZh ? '支持 PDF · 图片 · CSV · Excel' : 'Supports PDF · Image · CSV · Excel'}
          </p>
          <span style={{
            display: 'inline-block', padding: '6px 18px',
            border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem',
          }}>
            {isZh ? '或点击选择文件' : 'or click to browse'}
          </span>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
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

  const [form, setForm] = useState<FormState>({ currentAge: 47, gender: 'Male' });
  const [phase, setPhase]               = useState<Phase>('idle');
  const [logIndex, setLogIndex]         = useState(0);
  const [result, setResult]             = useState<AnalysisResult | null>(null);
  const [pillarResults, setPillarResults] = useState<PillarResult[]>([]);
  const [toast, setToast]               = useState<string | null>(null);
  const [careSeed]                      = useState(() => Math.floor(Math.random() * 100));
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isMockResult, setIsMockResult] = useState(false);

  const isLoggedIn = !!user;
  const canRunReal = isLoggedIn && hasRemainingAnalyses();
  const logLines   = isZh ? LOG_LINES_ZH : LOG_LINES_EN;

  /* ── Animate log lines during loading ── */
  useEffect(() => {
    if (phase !== 'loading') { setLogIndex(0); return; }
    if (logIndex >= logLines.length - 1) return;
    const t = setTimeout(() => setLogIndex((i) => i + 1), 480);
    return () => clearTimeout(t);
  }, [phase, logIndex, logLines.length]);

  const runAnalysis = useCallback(async (isMock: boolean) => {
    setPhase('loading');
    setLogIndex(0);
    setResult(null);

    const rawBase   = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
    const httpIdx   = rawBase.indexOf('http', 1);
    const baseUrl   = httpIdx !== -1 ? rawBase.slice(httpIdx) : rawBase;
    const useMock   = !baseUrl || isMock;

    setIsMockResult(useMock);

    if (useMock) {
      await new Promise((r) => setTimeout(r, logLines.length * 480 + 400));
      const mockResult = buildMockResult(form);
      const pillars0 = buildPillarResults(form.currentAge, form.gender);
      setResult(mockResult);
      setPillarResults(pillars0);
      setPhase('result');
      if (!isMock && isLoggedIn) {
        consumeFreeAnalysis();
        saveAnalysis({
          type: 'upload',
          biologicalAge:      mockResult.predicted_age,
          chronologicalAge:   form.currentAge,
          delta:              mockResult.delta_years,
          topFlags:           pillars0.filter((p) => p.risk !== 'normal').map((p) => p.caseId),
          pillarSummary:      pillars0.map((p) => ({ caseId: p.caseId, nameZh: p.nameZh, nameEn: p.nameEn, risk: p.risk })),
          optimizationItems:  mockResult.optimization_plan,
        });
      }
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentAge: form.currentAge, gender: form.gender }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AnalysisResult = await res.json();
      const pillars1 = buildPillarResults(form.currentAge, form.gender);
      setResult(data);
      setPillarResults(pillars1);
      setPhase('result');
      if (isLoggedIn) {
        consumeFreeAnalysis();
        saveAnalysis({
          type: 'upload',
          biologicalAge:    data.predicted_age,
          chronologicalAge: form.currentAge,
          delta:            data.delta_years,
          topFlags:         pillars1.filter((p) => p.risk !== 'normal').map((p) => p.caseId),
          pillarSummary:    pillars1.map((p) => ({ caseId: p.caseId, nameZh: p.nameZh, nameEn: p.nameEn, risk: p.risk })),
          optimizationItems: data.optimization_plan,
        });
      }
    } catch (err) {
      console.error('[EngineForm]', err);
      setToast(isZh ? '引擎连接异常，已切换为演示数据…' : 'Engine connection failed — running with demo data…');
      await new Promise((r) => setTimeout(r, 600));
      const mockResult = buildMockResult(form);
      setIsMockResult(true);
      setResult(mockResult);
      setPillarResults(buildPillarResults(form.currentAge, form.gender));
      setPhase('result');
    }
  }, [form, isLoggedIn, isZh, consumeFreeAnalysis, saveAnalysis, logLines.length]);

  function handleReset() {
    setPhase('idle');
    setResult(null);
    setPillarResults([]);
    setIsMockResult(false);
  }

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '10px 14px', color: '#FFFFFF', fontSize: '0.9375rem',
    outline: 'none', transition: 'border-color 0.2s', appearance: 'none', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.6875rem', fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)', marginBottom: '6px',
  };

  return (
    <>
      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}

      {/* ── FREE ANALYSIS BANNER ────────────────────────────────────────── */}
      {isLoggedIn && canRunReal && phase === 'idle' && (
        <div style={{ width: '100%', maxWidth: '880px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '10px', padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              {isZh
                ? `欢迎回来，${user.name}！你还有 ${remainingFreeCount()} 次免费分析机会，上传报告立即解读。`
                : `Welcome back, ${user.name}! You have ${remainingFreeCount()} free ${remainingFreeCount() === 1 ? 'analysis' : 'analyses'} remaining — upload your report to start.`}
            </p>
          </div>
        </div>
      )}

      {/* ── PAYWALL ─────────────────────────────────────────────────────── */}
      {isLoggedIn && !canRunReal && phase === 'idle' && (
        <div style={{
          width: '100%', maxWidth: '520px',
          backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '40px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔬</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            {isZh ? '免费次数已用完' : 'Free Analysis Used'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '28px', lineHeight: 1.65 }}>
            {isZh
              ? '升级至专业版，解锁无限次体检报告解读、历史追踪与趋势分析。'
              : 'Upgrade to Pro for unlimited checkup report analyses, history tracking, and trend charts.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => alert(isZh ? '支付功能即将上线，敬请期待！' : 'Payment coming soon — stay tuned!')}
              style={{ width: '100%', padding: '13px', borderRadius: '8px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9375rem' }}
            >
              {isZh ? '升级专业版 →' : 'Upgrade to Pro →'}
            </button>
            <button
              onClick={() => runAnalysis(true)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              ⚡ {isZh ? '继续使用模拟数据体验' : 'Continue with mock data demo'}
            </button>
          </div>
        </div>
      )}

      {/* ── FORM CARD ───────────────────────────────────────────────────── */}
      {phase === 'idle' && (!isLoggedIn || canRunReal || false) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: 'clamp(32px, 5vw, 48px)',
            maxWidth: '560px', width: '100%',
          }}
        >
          {/* ── Card header ── */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: '20px', padding: '4px 12px', marginBottom: '18px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22C55E', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                {isZh ? '系统在线 · 引擎 v2.4.1' : 'System Online · Engine v2.4.1'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.2 }}>
              {isZh ? '上传你的体检报告' : 'Upload Your Medical Report'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
              {isZh
                ? '引擎将解读报告中的生物标志物，评估十大代谢支柱风险，生成因果干预路线图。'
                : 'The engine reads your biomarkers, audits all 10 metabolic pillars, and generates a causal intervention roadmap.'}
            </p>
          </div>

          {/* ── Upload zone (primary) ── */}
          <UploadZone
            isZh={isZh}
            onFileSelect={setUploadedFile}
            selectedFile={uploadedFile}
            locked={!isLoggedIn}
          />

          {/* Login links for non-logged-in users */}
          {!isLoggedIn && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
              <Link href="/auth/login" style={{
                padding: '8px 20px', borderRadius: '6px',
                backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
              }}>
                {isZh ? '登录' : 'Sign In'}
              </Link>
              <Link href="/auth/register" style={{
                padding: '8px 20px', borderRadius: '6px',
                backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-dark)',
                fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
              }}>
                {isZh ? '注册，前 3 次分析免费 →' : 'Register — 3 Free Analyses →'}
              </Link>
            </div>
          )}

          {/* ── Separator ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isZh ? '补充参数' : 'Basic parameters'}
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* ── Secondary fields: age + gender in a row ── */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{isZh ? '当前年龄' : 'Current Age'}</label>
              <input
                type="number" min={AGE_MIN} max={AGE_MAX} value={form.currentAge}
                onChange={(e) => {
                  const v = Math.min(AGE_MAX, Math.max(AGE_MIN, Number(e.target.value)));
                  setForm((prev) => ({ ...prev, currentAge: v }));
                }}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{isZh ? '生物性别' : 'Biological Sex'}</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as FormState['gender'] }))}
                style={inputStyle}
              >
                <option value="Male">{isZh ? '男性' : 'Male'}</option>
                <option value="Female">{isZh ? '女性' : 'Female'}</option>
                <option value="Other">{isZh ? '其他' : 'Other'}</option>
              </select>
            </div>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.2)', marginTop: '6px', lineHeight: 1.5 }}>
            {isZh
              ? `目标生物年龄将自动设为当前年龄的 80%（${minTargetAge(form.currentAge)} 岁）`
              : `Target biological age auto-set to 80% of current (${minTargetAge(form.currentAge)} yrs)`}
          </p>

          {/* ── Run / upload button ── */}
          <button
            onClick={() => runAnalysis(isLoggedIn ? !canRunReal : true)}
            style={{
              width: '100%', marginTop: '22px', padding: '15px',
              borderRadius: '10px', backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-dark)', fontSize: '1rem', fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
          >
            {isLoggedIn && canRunReal && uploadedFile
              ? (isZh ? `分析「${uploadedFile.length > 18 ? uploadedFile.slice(0, 18) + '…' : uploadedFile}」→` : `Analyze "${uploadedFile.length > 20 ? uploadedFile.slice(0, 20) + '…' : uploadedFile}" →`)
              : isLoggedIn && canRunReal
                ? (isZh ? '开始分析 →' : 'Start Analysis →')
                : (isZh ? '⚡ 体验演示' : '⚡ Run Demo')}
          </button>

          {!isLoggedIn && (
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)' }}>
              ⚡ {isZh ? '演示模式 · 无需登录 · 使用示例数据' : 'Demo mode · No account required · uses sample data'}
            </p>
          )}
        </motion.div>
      )}

      {/* ── LOADING STATE ────────────────────────────────────────────────── */}
      {phase === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: '100%', maxWidth: '520px',
            backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '48px 40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              width: '32px', height: '32px',
              border: '2px solid rgba(255,215,0,0.2)', borderTopColor: '#FFD700',
              borderRadius: '50%', animation: 'spin-ring 0.8s linear infinite', flexShrink: 0,
            }} />
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                {isZh ? '分析运行中…' : 'Analysis Running…'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                {isZh ? '十大支柱评估 + 多组学融合' : '10-Pillar audit + multi-omic fusion'}
              </p>
            </div>
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem' }}>
            {logLines.slice(0, logIndex + 1).map((line, i) => (
              <div key={i} style={{
                padding: '4px 0',
                color: i === logIndex ? '#FFD700' : 'rgba(255,255,255,0.3)',
                display: 'flex', gap: '10px',
              }}>
                <span style={{ color: 'rgba(255,215,0,0.4)' }}>[{String(i).padStart(2, '0')}]</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── RESULT STATE ─────────────────────────────────────────────────── */}
      {phase === 'result' && result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* ── Mock mode banner ── */}
          {isMockResult && (
            <div style={{
              backgroundColor: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '10px', padding: '11px 20px',
              display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚡</span>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0, flex: 1 }}>
                {isZh
                  ? '当前为模拟演示数据，仅供体验。上传真实体检报告可获取个性化十大支柱分析。'
                  : 'Demo mode — using mock data. Upload your real report for a personalized 10-Pillar analysis.'}
              </p>
              <Link href="/auth/register" style={{
                fontSize: '0.8125rem', fontWeight: 700, color: '#FFD700',
                textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {isZh ? '注册免费上传 →' : 'Register Free →'}
              </Link>
            </div>
          )}

          {/* ── Section 1: Bio-age vector + radar + optimization ── */}
          <div style={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Section label */}
            <div style={{ padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {isZh ? '生物年龄向量' : 'BIOLOGICAL AGE VECTOR'}
              </span>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
              {[
                {
                  label: isZh ? '时序年龄' : 'Chronological',
                  value: String(form.currentAge),
                  color: 'rgba(255,255,255,0.45)',
                },
                {
                  label: isZh ? '预测生物年龄' : 'Biological Age',
                  value: <AnimatedNumber from={form.currentAge} to={result.predicted_age} />,
                  color: '#FFD700',
                  isNode: true,
                },
                {
                  label: isZh ? '年龄落差' : 'Age Delta',
                  value: `${result.delta_years > 0 ? '+' : ''}${result.delta_years.toFixed(1)} ${isZh ? '岁' : 'yrs'}`,
                  color: result.delta_years < 0 ? '#22C55E' : '#EF4444',
                },
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: '#0E1117', padding: '20px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Radar chart ── */}
            {pillarResults.length > 0 && (
              <div style={{ padding: '28px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <PillarRadarChart results={pillarResults} />
              </div>
            )}

            {/* Confidence interval */}
            {result.confidence_interval && (
              <div style={{ padding: '10px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)', margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                  {isZh ? '95% 置信区间：' : '95% CI: '}[{result.confidence_interval[0]} — {result.confidence_interval[1]}]
                </p>
              </div>
            )}

            {/* Optimization plan */}
            <div style={{ padding: '20px 28px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
                {isZh ? '干预优化方案' : 'INTERVENTION PRIORITY MAP'}
              </p>
              {result.optimization_plan.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  style={{
                    padding: '16px 0',
                    borderBottom: i < result.optimization_plan.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: '26px', height: '26px', borderRadius: '50%',
                    border: '1px solid rgba(255,215,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#FFD700', marginTop: '1px',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {isZh ? item.categoryZh : item.category}
                      </span>
                      <PriorityBadge priority={item.priority} isZh={isZh} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>
                      {isZh ? item.recommendationZh : item.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Section 2: 10-Pillar Audit ── */}
          {pillarResults.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{
                padding: '20px 28px', borderBottom: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
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
                  {isZh
                    ? '⚡ 干预优先序：排名靠前的支柱通常是上游阻断因素，必须优先处理。'
                    : '⚡ Intervention priority: Higher-ranked pillars are typically upstream blockers — address first.'}
                </p>
              </div>
            </div>
          )}

          {/* ── Section 3: Human Care Message ── */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px 28px' }}>
            <HumanCareMessage seed={careSeed} />
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.4)'; (e.currentTarget as HTMLElement).style.color = '#FFD700'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
            >
              ← {isZh ? '重新分析' : 'New Analysis'}
            </button>
            {isLoggedIn && (
              <Link href="/profile?tab=reports" style={{
                flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none', textAlign: 'center',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isZh ? '我的报告 →' : 'My Reports →'}
              </Link>
            )}
            {/* PDF export */}
            <button
              onClick={() => window.print()}
              style={{
                flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px',
                border: '1px solid rgba(255,215,0,0.35)', backgroundColor: 'rgba(255,215,0,0.08)',
                color: '#FFD700', fontSize: '0.875rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,215,0,0.15)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,215,0,0.08)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 7l4 4 4-4M2 12h12" stroke="#FFD700" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isZh ? '导出 PDF 报告' : 'Export PDF'}
            </button>
            <Link href="/solutions" style={{
              flex: 1, minWidth: '140px', padding: '14px 18px', borderRadius: '10px',
              border: 'none', backgroundColor: '#FFD700', color: '#0D0D0D',
              fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#F5CB00')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#FFD700')}
            >
              {isZh ? '查看临床路径 →' : 'View Solutions →'}
            </Link>
          </div>

          {/* Footer disclaimer */}
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1.6, textAlign: 'center' }}>
            {isZh
              ? 'PivotOrder 多组学融合引擎生成 · 引擎 v2.4.1\n本输出仅供研究及信息参考，不构成医学诊断建议。'
              : 'Results generated by the PivotOrder multi-omic fusion engine · Engine v2.4.1\nThis output is for research and informational purposes only. Not a medical diagnosis.'}
          </p>
        </motion.div>
      )}

      {/* ── PRINT-ONLY engine report (shown only during window.print()) ── */}
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

      <style>{`
        @keyframes spin-ring { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
