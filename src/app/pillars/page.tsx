'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

/* ─── Data ───────────────────────────────────────────────────────────── */
const PILLARS_DETAIL = [
  {
    id: 'A',
    zh: '隐性肥胖代谢溢出',
    en: 'Normal Weight Obesity (NWO)',
    descZh: '体重与 BMI 处于正常范围，但代谢指标已发生溢出——胰岛素抵抗在皮下悄然启动。',
    descEn: 'Body weight and BMI appear normal, but metabolic markers have already shifted — insulin resistance silently underway.',
    markers: [
      { name: 'FBG', unit: 'mmol/L', hosp: '3.9–6.1', opt: '4.2–5.1', trigger: '> 5.4' },
      { name: 'FINS', unit: 'µIU/mL', hosp: '2.6–24.9', opt: '3.0–7.0', trigger: '> 8.0' },
      { name: 'TG', unit: 'mmol/L', hosp: '< 1.7', opt: '< 1.0', trigger: '> 1.2' },
      { name: 'HDL-C', unit: 'mmol/L', hosp: '> 1.04', opt: '> 1.55', trigger: '< 1.3' },
    ],
    mechZh: '空腹血糖与胰岛素同步偏高提示胰岛素受体敏感性下降。TG/HDL 比值是内脏脂肪积累的代理指标，先于 BMI 改变出现。',
    mechEn: 'Synchronous elevation of FBG and FINS indicates declining insulin receptor sensitivity. TG/HDL ratio serves as a proxy for visceral fat accumulation, appearing before BMI changes.',
    intZh: '低GI饮食结构调整 + 空腹训练窗口优化 + 肌肉量追踪（DEXA）',
    intEn: 'Low-GI dietary restructuring + fasted training window optimization + lean mass tracking (DEXA)',
    color: '#EF4444',
  },
  {
    id: 'B',
    zh: '激素轴与LPS穿透',
    en: 'PCOS + Metabolic Endotoxemia',
    descZh: '雄激素轴异常与肠道内毒素双重打击：LPS 泄漏激活 TLR4 → 胰岛素受体钝化 → 卵巢颗粒细胞信号失调。',
    descEn: 'Double hit from androgen axis dysregulation and gut endotoxin: LPS leak activates TLR4 → insulin receptor blunting → ovarian granulosa cell signaling failure.',
    markers: [
      { name: 'DHEA-S', unit: 'µg/dL', hosp: '65–380', opt: '100–250', trigger: '> 300' },
      { name: 'Hcy', unit: 'µmol/L', hosp: '< 15.0', opt: '< 8.0', trigger: '> 10.0' },
      { name: 'LPS', unit: 'EU/mL', hosp: 'N/A', opt: '< 0.5', trigger: '> 1.0' },
    ],
    mechZh: 'LPS→TLR4→IR轴：肠道屏障破损后，脂多糖进入门脉循环，激活全身 TLR4 受体，产生慢性低级别炎症，使胆碱（Case B 干预核心）结合率下降 60%。',
    mechEn: 'LPS→TLR4→IR axis: After gut barrier damage, lipopolysaccharide enters portal circulation, activating systemic TLR4 receptors, creating chronic low-grade inflammation that reduces choline (Case B intervention core) binding rate by 60%.',
    intZh: '肌醇 MI:DCI 40:1 方案 + 胆碱 + 甲基叶酸（需先稳定 Case E）',
    intEn: 'Inositol MI:DCI 40:1 protocol + choline + methylfolate (requires Case E stabilization first)',
    color: '#F59E0B',
    depZh: '⚠ 必须先稳定 Case E（肠道屏障），否则 LPS 持续泄漏会使本柱干预效果下降 60%。',
    depEn: '⚠ Case E (Gut Barrier) must be stabilised first. Ongoing LPS leak reduces this intervention\'s efficacy by 60%.',
  },
  {
    id: 'C',
    zh: '甲减转换障碍',
    en: 'T4→T3 Conversion Failure',
    descZh: 'TSH 正常甚至偏低，但 fT3 不足——脱碘酶轴障碍导致 T4 被旁路转化为无活性的 rT3。',
    descEn: 'TSH may be normal or even low, but fT3 is insufficient — deiodinase axis failure shunts T4 into inactive rT3 instead of active T3.',
    markers: [
      { name: 'TSH', unit: 'mIU/L', hosp: '0.55–4.78', opt: '1.0–2.5', trigger: '> 3.0' },
      { name: 'fT3', unit: 'pmol/L', hosp: '3.5–6.5', opt: '> 5.0', trigger: '< 4.5' },
      { name: 'fT4', unit: 'pmol/L', hosp: '11.5–22.7', opt: '14.0–20.0', trigger: '< 13.0' },
    ],
    mechZh: '1型脱碘酶（D1）受多重上游因素抑制：皮质醇升高（Case D）、IFN-I升高（Case J）、硒/锌缺乏。rT3/T3 比值是更敏感的功能性甲减指标。',
    mechEn: 'Type 1 deiodinase (D1) is suppressed by multiple upstream factors: elevated cortisol (Case D), elevated IFN-I (Case J), selenium/zinc deficiency. The rT3/T3 ratio is a more sensitive functional hypothyroid marker.',
    intZh: '硒蛋氨酸 200µg/d + 锌 30mg/d + 压力管理（降皮质醇）',
    intEn: 'Selenomethionine 200µg/d + Zinc 30mg/d + stress management (cortisol reduction)',
    color: '#8B5CF6',
    depZh: '⚠ Case J（免疫线粒体轴）位于上游：mtDNA泄漏→IFN-I激增→D1脱碘酶基因被抑制→rT3升高、T3降低。',
    depEn: '⚠ Case J (Immune-Mitochondrial Axis) is upstream: mtDNA leak → IFN-I surge → D1 deiodinase gene suppression → rT3↑, T3↓.',
  },
  {
    id: 'D',
    zh: '皮质醇监工',
    en: 'HPA Axis Dysregulation',
    descZh: '慢性压力驱动 HPA 轴昼夜节律紊乱：皮质醇峰值错位、夜间皮质醇偏高、DHEA-S 进行性下降。',
    descEn: 'Chronic stress drives HPA axis circadian rhythm disruption: cortisol peak timing displacement, elevated nocturnal cortisol, progressive DHEA-S decline.',
    markers: [
      { name: 'Cortisol AM', unit: 'nmol/L', hosp: '171–536', opt: '300–500', trigger: '> 500 or < 200' },
      { name: 'DHEA-S', unit: 'µg/dL', hosp: '65–380', opt: '150–300', trigger: '< 100' },
    ],
    mechZh: '皮质醇↑→TSH抑制→T4减少（叠加Case C）；皮质醇↑→海马体 GR 受体下调→HPA 负反馈失效→皮质醇进一步升高。',
    mechEn: 'Cortisol↑ → TSH suppression → T4 reduction (compounding Case C); Cortisol↑ → hippocampal GR receptor downregulation → HPA negative feedback failure → further cortisol elevation.',
    intZh: '适应原（南非醉茄、红景天）+ 4-7-8 呼吸训练 + 昼夜节律锚定（光照/进食时间）',
    intEn: 'Adaptogens (Ashwagandha, Rhodiola) + 4-7-8 breathing protocol + circadian anchoring (light/meal timing)',
    color: '#EC4899',
  },
  {
    id: 'E',
    zh: '肠道海关',
    en: 'Gut Barrier & LPS-TLR4 Cascade',
    descZh: '肠道屏障通透性异常升高，LPS持续渗漏激活全身 TLR4，是 Case B、Case C、Case H 的上游关键节点。',
    descEn: 'Abnormally elevated gut permeability with continuous LPS leak activating systemic TLR4 — the upstream critical node for Cases B, C, and H.',
    markers: [
      { name: 'hsCRP', unit: 'mg/L', hosp: '< 3.0', opt: '< 0.5', trigger: '> 1.0' },
      { name: 'NLR', unit: '', hosp: '1.0–3.0', opt: '1.2–1.8', trigger: '> 2.2' },
      { name: 'LPS', unit: 'EU/mL', hosp: 'N/A', opt: '< 0.5', trigger: '> 1.0' },
    ],
    mechZh: 'LPS→TLR4→NF-κB→促炎细胞因子（IL-6, TNF-α）→胰岛素受体底物磷酸化障碍→全身胰岛素抵抗。',
    mechEn: 'LPS → TLR4 → NF-κB → pro-inflammatory cytokines (IL-6, TNF-α) → insulin receptor substrate phosphorylation impairment → systemic insulin resistance.',
    intZh: '多菌株益生菌（42株，6万亿CFU）+ 谷氨酰胺肠黏膜修复 + 低FODMAPs + 脂多糖吸附纤维',
    intEn: 'Multi-strain probiotics (42 strains, 6 trillion CFU) + glutamine gut lining repair + low-FODMAPs + LPS-binding dietary fiber',
    color: '#22C55E',
    depZh: '⚠ 这是最关键的上游支柱。稳定本柱后，Case B、C、H 的干预效果可提升 40–60%。',
    depEn: '⚠ This is the most critical upstream pillar. Stabilizing this pillar increases the efficacy of Cases B, C, and H by 40–60%.',
  },
  {
    id: 'F',
    zh: '表观逆转',
    en: 'Epigenetics + De-novo Lipogenesis + UCP1',
    descZh: 'DNA甲基化时钟加速老化的机制：SAM耗竭、Hcy积累、DNAmAge偏离。表观遗传干预可实现时钟逆转。',
    descEn: 'Mechanism of DNA methylation clock aging acceleration: SAM depletion, Hcy accumulation, DNAmAge deviation. Epigenetic interventions can achieve clock reversal.',
    markers: [
      { name: 'Hcy', unit: 'µmol/L', hosp: '< 15.0', opt: '< 7.0', trigger: '> 10.0' },
      { name: 'B12', unit: 'pmol/L', hosp: '> 148', opt: '> 400', trigger: '< 300' },
      { name: 'Folate', unit: 'nmol/L', hosp: '> 6.8', opt: '> 20', trigger: '< 13' },
    ],
    mechZh: 'SAM（S-腺苷甲硫氨酸）是DNA甲基化的甲基供体。Hcy偏高提示SAM-SAH代谢失衡。5-MTHF（活性叶酸）+ 甲钴胺重新激活甲基化循环。',
    mechEn: 'SAM (S-adenosylmethionine) is the methyl donor for DNA methylation. Elevated Hcy indicates SAM-SAH metabolic imbalance. 5-MTHF (active folate) + methylcobalamin reactivate the methylation cycle.',
    intZh: '甲基叶酸（5-MTHF）+ 甲钴胺 + 麦角硫因 50–100mg/d（甲基化时钟减速器）',
    intEn: 'Methylfolate (5-MTHF) + methylcobalamin + ergothioneine 50–100mg/d (methylation clock decelerator)',
    color: '#3B82F6',
    depZh: '⚠ 需要先完成 Case G（自噬激活），清除受损线粒体后，甲基化重编程才有细胞空间落地。',
    depEn: '⚠ Requires Case G (Autophagy activation) first. Damaged mitochondria must be cleared before methylation reprogramming has cellular space to operate.',
  },
  {
    id: 'G',
    zh: '细胞翻新',
    en: 'Autophagy & Mitophagy System',
    descZh: '细胞自我清洁系统：p62积累提示自噬流受阻，LC3-B是自噬体形成的标志蛋白。mTOR持续激活是抑制自噬的主要机制。',
    descEn: 'Cellular self-cleaning system: p62 accumulation indicates blocked autophagic flux; LC3-B marks autophagosome formation. Persistent mTOR activation is the primary autophagy inhibition mechanism.',
    markers: [
      { name: 'p62/SQSTM1', unit: 'ng/mL', hosp: 'N/A', opt: 'Low', trigger: 'Elevated' },
      { name: 'mTOR activity', unit: '', hosp: 'N/A', opt: 'Pulsatile', trigger: 'Persistently elevated' },
    ],
    mechZh: '自噬受损→受损线粒体（mtDNA泄漏源头）积累→激活 cGAS-STING 通路（Case J）→IFN-I慢性升高→全身老化加速。',
    mechEn: 'Impaired autophagy → damaged mitochondria accumulate (mtDNA leak source) → activates cGAS-STING pathway (Case J) → chronic IFN-I elevation → systemic aging acceleration.',
    intZh: '间歇性禁食（16:8，72h水断食）+ 亚精胺 1-2mg/d + 雷帕霉素（mTOR靶向）',
    intEn: 'Intermittent fasting (16:8, 72h water fasting) + spermidine 1-2mg/d + rapamycin (mTOR targeting)',
    color: '#06B6D4',
  },
  {
    id: 'H',
    zh: '慢病盾牌',
    en: 'Chronic Disease Metabolic Shield (GKI)',
    descZh: '葡萄糖-酮体指数（GKI）是代谢灵活性的核心量化指标。MCT介导的代谢重编程提供慢病预防盾牌。',
    descEn: 'The Glucose-Ketone Index (GKI) is the core quantifiable metric of metabolic flexibility. MCT-mediated metabolic reprogramming provides a chronic disease prevention shield.',
    markers: [
      { name: 'GKI', unit: '', hosp: 'N/A', opt: '1–6', trigger: '> 9 (poor metabolic flex)' },
      { name: 'BHB', unit: 'mmol/L', hosp: 'N/A', opt: '0.5–3.0', trigger: '< 0.2' },
      { name: 'FBG', unit: 'mmol/L', hosp: '3.9–6.1', opt: '4.2–5.1', trigger: '> 5.4' },
    ],
    mechZh: 'GKI = 血糖(mmol/L) ÷ 血酮(mmol/L)。GKI < 6 提示良好代谢灵活性；GKI > 9 提示葡萄糖依赖状态。β-羟基丁酸是NLRP3炎症小体抑制剂。',
    mechEn: 'GKI = Blood glucose(mmol/L) ÷ Blood ketones(mmol/L). GKI < 6 indicates good metabolic flexibility; GKI > 9 indicates glucose-dependent state. β-hydroxybutyrate is an NLRP3 inflammasome inhibitor.',
    intZh: 'MCT油（C8:C10 = 60:40）剂量递进 + 生酮适应期营养管理',
    intEn: 'MCT oil (C8:C10 = 60:40) progressive dosing + ketogenic adaptation nutritional management',
    color: '#F97316',
  },
  {
    id: 'I',
    zh: '血流变与时间代谢',
    en: 'Blood Rheology + Chronometabolism',
    descZh: '血液流变学指标（纤维蛋白原、NLR）与昼夜节律代谢窗口的协同优化。时间营养学干预最大化代谢干预效益。',
    descEn: 'Blood rheology markers (fibrinogen, NLR) combined with circadian metabolic window synchronization. Chrono-nutritional interventions maximize metabolic intervention efficacy.',
    markers: [
      { name: 'Fibrinogen', unit: 'g/L', hosp: '2–4', opt: '< 3.0', trigger: '> 3.5' },
      { name: 'NLR', unit: '', hosp: '1.0–3.0', opt: '1.2–1.8', trigger: '> 2.2' },
    ],
    mechZh: '纤维蛋白原是炎症急性期反应蛋白，同时是血栓形成风险指标。NLR（中性粒细胞/淋巴细胞比值）是全身炎症的简便代理指标，与全因死亡率相关。',
    mechEn: 'Fibrinogen is an acute-phase inflammatory protein and a thrombosis risk marker. NLR (neutrophil-to-lymphocyte ratio) is a convenient proxy for systemic inflammation, correlated with all-cause mortality.',
    intZh: '时间限制饮食（TRF）8小时窗口 + Omega-3（EPA 2g/d）+ 运动时机优化',
    intEn: 'Time-restricted feeding (TRF) 8-hour window + Omega-3 (EPA 2g/d) + exercise timing optimization',
    color: '#A855F7',
  },
  {
    id: 'J',
    zh: '免疫-线粒体轴',
    en: 'Immune-Mitochondrial Axis (cGAS-STING)',
    descZh: 'cGAS-STING通路是线粒体DNA泄漏后触发的免疫警报系统。持续激活导致慢性IFN-I升高、抑制甲状腺转换酶（Case C上游）。',
    descEn: 'The cGAS-STING pathway is the immune alarm system triggered by mitochondrial DNA leakage. Persistent activation causes chronic IFN-I elevation, suppressing thyroid conversion enzymes (upstream of Case C).',
    markers: [
      { name: 'IFN-β', unit: 'pg/mL', hosp: 'N/A', opt: '< 5', trigger: '> 10' },
      { name: 'hsCRP', unit: 'mg/L', hosp: '< 3.0', opt: '< 0.5', trigger: '> 1.0' },
      { name: 'IL-6', unit: 'pg/mL', hosp: '< 7.0', opt: '< 2.0', trigger: '> 3.5' },
    ],
    mechZh: 'mtDNA（线粒体DNA）泄漏→ cGAS感知胞浆DNA→ STING磷酸化→ IRF3激活→ IFN-I大量产生→ 全身抗病毒免疫持续激活→ 自身炎症损伤。',
    mechEn: 'mtDNA (mitochondrial DNA) leak → cGAS senses cytosolic DNA → STING phosphorylation → IRF3 activation → massive IFN-I production → persistent systemic antiviral immune activation → autoinflammatory damage.',
    intZh: 'NAD+前体（NMN/NR）恢复线粒体质量 + 自噬激活（Case G）减少mtDNA泄漏 + 甲状腺素辅因子（硒、锌）',
    intEn: 'NAD+ precursors (NMN/NR) to restore mitochondrial quality + autophagy activation (Case G) to reduce mtDNA leak + thyroid cofactors (selenium, zinc)',
    color: '#EF4444',
    depZh: '⚠ 这是 Case C（甲状腺转换）的上游节点。需同步处理自噬（Case G）以减少 mtDNA 泄漏来源。',
    depEn: '⚠ This is upstream of Case C (Thyroid Conversion). Requires simultaneous management of autophagy (Case G) to reduce mtDNA leak sources.',
  },
];

export default function PillarsPage() {
  const { lang } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          backgroundColor: 'var(--color-bg-dark)',
          padding: '96px 24px 80px',
          textAlign: 'center',
        }}
      >
        <div className="container-site" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p
            className="text-caption"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-accent)',
              marginBottom: '24px',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease-out',
            }}
          >
            {lang === 'zh' ? '十大代谢支柱协议' : 'THE 10-PILLAR METABOLIC PROTOCOL'}
          </p>

          <h1
            className="text-h1"
            style={{
              color: '#FFFFFF',
              marginBottom: '24px',
              lineHeight: 1.2,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
            }}
          >
            {lang === 'zh'
              ? <>十大代谢支柱协议<br /><span style={{ color: 'var(--color-accent)' }}>因果优先，而非症状驱动</span></>
              : <>The 10-Pillar Metabolic Protocol<br /><span style={{ color: 'var(--color-accent)' }}>Causal Priority, Not Symptom-Driven</span></>}
          </h1>

          <p
            className="text-body-l"
            style={{
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '640px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.2s',
            }}
          >
            {lang === 'zh'
              ? 'PivotOrder 引擎不孤立读取实验室数值，而是审计 10 个互联的代谢系统——映射因果链、上游阻断因素和干预优先序列。每个支柱都有自己的触发阈值，优于医院参考范围的精细分辨率。'
              : "PivotOrder's engine doesn't read lab values in isolation. It audits 10 interconnected metabolic systems — mapping causal chains, upstream blockers, and intervention sequences. Each pillar has its own trigger thresholds, with finer resolution than hospital reference ranges."}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.3s',
            }}
          >
            <Link href="/auth/register" className="btn-primary">
              {lang === 'zh' ? '上传报告——首次分析免费 →' : 'Upload Report — First Analysis Free →'}
            </Link>
            <Link
              href="/engine"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              {lang === 'zh' ? '探索算力引擎 →' : 'Explore The Engine →'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Threshold Registry ──────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
        <div className="container-site">
          <p className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-accent)', marginBottom: '16px' }}>
            {lang === 'zh' ? '正规阈值注册表' : 'CANONICAL THRESHOLD REGISTRY'}
          </p>
          <h2 className="text-h2" style={{ color: 'var(--color-text-heading)', marginBottom: '8px' }}>
            {lang === 'zh' ? '精度优于医院参考范围' : 'Precision Beyond Hospital Reference Ranges'}
          </h2>
          <p className="text-body-m" style={{ marginBottom: '40px', maxWidth: '520px' }}>
            {lang === 'zh'
              ? '医院参考范围基于群体统计，PivotOrder 阈值基于最优生理功能的循证研究。'
              : 'Hospital reference ranges are population statistics. PivotOrder thresholds are based on evidence-based research for optimal physiological function.'}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-dark)', color: '#FFFFFF' }}>
                  <th style={thStyle}>{lang === 'zh' ? '标志物' : 'Marker'}</th>
                  <th style={thStyle}>{lang === 'zh' ? '医院参考范围' : 'Hospital Reference'}</th>
                  <th style={{ ...thStyle, color: 'var(--color-accent)' }}>{lang === 'zh' ? 'PivotOrder 最优区间' : 'PivotOrder Optimal'}</th>
                  <th style={{ ...thStyle, color: '#EF4444' }}>{lang === 'zh' ? '触发阈值' : 'Trigger Threshold'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { marker: 'FBG 空腹血糖', unit: 'mmol/L', hosp: '3.9–6.1', opt: '4.2–5.1', trigger: '> 5.4' },
                  { marker: 'FINS 空腹胰岛素', unit: 'µIU/mL', hosp: '2.6–24.9', opt: '3.0–7.0', trigger: '> 8.0' },
                  { marker: 'TG 甘油三酯', unit: 'mmol/L', hosp: '< 1.7', opt: '< 1.0', trigger: '> 1.2' },
                  { marker: 'HDL-C', unit: 'mmol/L', hosp: '> 1.04', opt: '> 1.55', trigger: '< 1.3' },
                  { marker: 'Hcy 同型半胱氨酸', unit: 'µmol/L', hosp: '< 15.0', opt: '< 8.0', trigger: '> 10.0' },
                  { marker: 'TSH', unit: 'mIU/L', hosp: '0.55–4.78', opt: '1.0–2.5', trigger: '> 3.0' },
                  { marker: 'hsCRP 超敏CRP', unit: 'mg/L', hosp: '< 3.0', opt: '< 0.5', trigger: '> 1.0' },
                  { marker: 'NLR 中性粒/淋巴比', unit: '', hosp: '1.0–3.0', opt: '1.2–1.8', trigger: '> 2.2' },
                  { marker: 'Fibrinogen 纤维蛋白原', unit: 'g/L', hosp: '2–4', opt: '< 3.0', trigger: '> 3.5' },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                        {row.marker}
                      </span>
                      {row.unit && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}>{row.unit}</span>}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{row.hosp}</td>
                    <td style={{ ...tdStyle, color: '#15803D', fontWeight: 600 }}>{row.opt}</td>
                    <td style={{ ...tdStyle, color: '#EF4444', fontWeight: 600 }}>{row.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pillar Detail Cards ──────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-site">
          <p className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-accent)', marginBottom: '16px' }}>
            {lang === 'zh' ? '十大支柱详解' : 'ALL 10 PILLARS'}
          </p>
          <h2 className="text-h2" style={{ color: 'var(--color-text-heading)', marginBottom: '48px' }}>
            {lang === 'zh' ? '因果链、阈值与干预序列' : 'Causal Chains, Thresholds & Intervention Sequences'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {PILLARS_DETAIL.map((p) => (
              <PillarCard key={p.id} pillar={p} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Causal Dependency Map ────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
        <div className="container-site">
          <p className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-accent)', marginBottom: '16px' }}>
            {lang === 'zh' ? '因果依赖关系图' : 'CAUSAL DEPENDENCY MAP'}
          </p>
          <h2 className="text-h2" style={{ color: 'var(--color-text-heading)', marginBottom: '16px' }}>
            {lang === 'zh' ? '上游先行，下游才有效' : 'Upstream First — Downstream Becomes Effective'}
          </h2>
          <p className="text-body-m" style={{ maxWidth: '600px', marginBottom: '48px' }}>
            {lang === 'zh'
              ? '十个支柱不是孤立的干预列表。它们形成一张因果网络——忽视上游支柱，下游干预的效果将大打折扣。'
              : 'The 10 pillars are not an isolated intervention checklist. They form a causal network — ignoring upstream pillars significantly reduces the efficacy of downstream interventions.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                from: 'Case J · 免疫线粒体轴',
                arrow: '→',
                to: 'Case C · 甲状腺转换',
                mechZh: 'mtDNA泄漏 → IFN-I激增 → D1脱碘酶基因抑制 → rT3升高',
                mechEn: 'mtDNA leak → IFN-I surge → D1 deiodinase suppression → rT3↑',
              },
              {
                from: 'Case E · 肠道屏障',
                arrow: '→',
                to: 'Case B · PCOS激素轴',
                mechZh: 'LPS泄漏 → TLR4激活 → 胆碱结合率下降60% → B柱干预失效',
                mechEn: 'LPS leak → TLR4 activation → choline binding rate ↓60% → Case B interventions ineffective',
              },
              {
                from: 'Case E · 肠道屏障',
                arrow: '→',
                to: 'Case C · 甲状腺转换',
                mechZh: 'LPS泄漏 → 全身炎症 → TSH受体信号干扰 → T3合成减少',
                mechEn: 'LPS leak → systemic inflammation → TSH receptor signal interference → T3 synthesis reduction',
              },
              {
                from: 'Case G · 自噬系统',
                arrow: '→',
                to: 'Case F · 表观遗传逆转',
                mechZh: '自噬受损 → 受损线粒体积累 → 细胞内无空间落实甲基化重编程',
                mechEn: 'Impaired autophagy → damaged mitochondria accumulate → no cellular space for methylation reprogramming',
              },
            ].map((dep, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '6px 14px', fontSize: '0.875rem', fontWeight: 600, color: '#EF4444', flexShrink: 0 }}>
                  {dep.from}
                </div>
                <span style={{ color: 'var(--color-accent)', fontSize: '1.25rem', fontWeight: 700 }}>→</span>
                <div style={{ backgroundColor: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '6px', padding: '6px 14px', fontSize: '0.875rem', fontWeight: 600, color: '#92610A', flexShrink: 0 }}>
                  {dep.to}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
                  {lang === 'zh' ? dep.mechZh : dep.mechEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--color-bg-dark)', padding: '96px 24px' }}>
        <div className="container-site" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <h2 className="text-h2" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            {lang === 'zh' ? '准备好映射你的十大支柱了吗？' : 'Ready to Map Your 10 Pillars?'}
          </h2>
          <p className="text-body-l" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '40px' }}>
            {lang === 'zh'
              ? '上传你的体检报告，解锁你的十大代谢支柱评分。首次分析完全免费。'
              : 'Upload your checkup report. Unlock your 10-Pillar metabolic score. First analysis completely free.'}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn-primary">
              {lang === 'zh' ? '上传报告——首次免费 →' : 'Upload Report — First Analysis Free →'}
            </Link>
            <Link
              href="/engine"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            >
              {lang === 'zh' ? '探索算力引擎 →' : 'Explore The Engine →'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Pillar card subcomponent ──────────────────────────────────────── */
function PillarCard({ pillar, lang }: { pillar: typeof PILLARS_DETAIL[0]; lang: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderLeft: `4px solid ${pillar.color}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'left',
          backgroundColor: open ? 'var(--color-bg-subtle)' : '#FFFFFF',
          transition: 'background-color 0.2s',
        }}
      >
        <span
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: pillar.color,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {pillar.id}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>CASE {pillar.id}</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
              {lang === 'zh' ? pillar.zh : pillar.en}
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'zh' ? pillar.descZh : pillar.descEn}
          </p>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s', flexShrink: 0 }}
        >
          <path d="M3 6L8 11L13 6" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Expandable body */}
      {open && (
        <div style={{ padding: '0 28px 28px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-subtle)' }}>
          {/* Markers table */}
          {pillar.markers.length > 0 && (
            <div style={{ marginTop: '24px', overflowX: 'auto' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {lang === 'zh' ? '关键标志物' : 'KEY MARKERS'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pillar.markers.map((m, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 16px', fontSize: '0.8125rem' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: 'var(--color-text-heading)' }}>{m.name}</span>
                    {m.unit && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>{m.unit}</span>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      <span>{lang === 'zh' ? '最优' : 'Optimal'}: </span>
                      <span style={{ color: '#15803D', fontWeight: 600 }}>{m.opt}</span>
                      <span style={{ margin: '0 6px' }}>·</span>
                      <span>{lang === 'zh' ? '触发' : 'Trigger'}: </span>
                      <span style={{ color: '#EF4444', fontWeight: 600 }}>{m.trigger}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mechanism */}
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              {lang === 'zh' ? '机制摘要' : 'MECHANISM'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
              {lang === 'zh' ? pillar.mechZh : pillar.mechEn}
            </p>
          </div>

          {/* Intervention */}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              {lang === 'zh' ? '干预方向' : 'INTERVENTION DIRECTION'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
              {lang === 'zh' ? pillar.intZh : pillar.intEn}
            </p>
          </div>

          {/* Dependency */}
          {(lang === 'zh' ? pillar.depZh : pillar.depEn) && (
            <div style={{ marginTop: '16px', backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: '8px', padding: '12px 16px' }}>
              <p style={{ fontSize: '0.875rem', color: '#92610A', margin: 0, lineHeight: 1.65 }}>
                {lang === 'zh' ? pillar.depZh : pillar.depEn}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  fontFamily: '"JetBrains Mono", monospace',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.875rem',
};
