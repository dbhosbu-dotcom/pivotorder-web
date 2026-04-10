/**
 * pathwayData.ts — Single source of truth for clinical pathway content.
 * Imported by both SolutionsGrid (display) and PrintReport (browser print).
 */

export interface Pathway {
  id:             string;
  index:          string;
  tag:            string;
  tagZh:          string;
  tagColor:       string;
  title:          string;
  titleZh:        string;
  description:    string;
  descriptionZh:  string;
  metrics:        { label: string; labelZh: string; value: string }[];
  evidenceLevel:  string;
  clockTarget:    string;
  clockTargetZh:  string;
  engineModule:   string;
  engineModuleZh: string;
  apiEndpoint?:   string;
}

/* ─── Engine Triad — the 3 core backend computation modules ──────────── */
export const ENGINE_TRIAD = [
  {
    id:       'phenoage',
    icon:     '🧬',
    color:    '#FFD700',
    name:     'PhenoAge Biological Clock',
    nameZh:   'PhenoAge 生物时钟引擎',
    module:   'aging_engine.py',
    desc:     'Levine 2018 PhenoAge algorithm. Computes biological age delta from 9 validated biomarkers. Outputs deviation score, trend series, and confidence interval.',
    descZh:   'Levine 2018 PhenoAge 算法。基于 9 项验证生物标志物计算生物年龄偏差分、趋势序列与置信区间。',
    params:   ['Albumin', 'Creatinine', 'CRP', 'Glucose', 'Lymphocyte%', 'MCV', 'RDW', 'ALP', 'WBC'],
    endpoint: 'POST /api/v1/analyze/v4 → biological_age',
  },
  {
    id:       'ebm',
    icon:     '⚕️',
    color:    '#EF4444',
    name:     'EBM Cross-Validation Matrix',
    nameZh:   'EBM 循证交叉验证矩阵',
    module:   'cross_validation_engine.py + ebm_pathway_engine.py',
    desc:     '8 evidence-based clinical rules (GRADE A/B). Detects TG/HDL insulin resistance, HOMA-IR, TSH/fT3 discordance, inflammation cascade patterns, and causal upstream blockers.',
    descZh:   '8 条 GRADE A/B 循证医学规则。检测 TG/HDL 胰岛素抵抗、HOMA-IR、TSH/fT3 不协调、炎症级联模式与上游因果阻断因素。',
    params:   ['TG/HDL Ratio', 'HOMA-IR', 'TSH×fT3', 'hsCRP×NLR', 'Hcy×B12', 'Cascade Risk'],
    endpoint: 'POST /api/v1/analyze/v4 → cross_validation_insights',
  },
  {
    id:       'twin',
    icon:     '🔮',
    color:    '#22C55E',
    name:     'Digital Twin Predictive Engine',
    nameZh:   '90天数字孪生预测引擎',
    module:   'predictive_engine.py',
    desc:     '90-day biological age reversal simulation. Models individual marker change trajectories under specified adherence scores. Generates day-30/60/90 projections with key intervention levers.',
    descZh:   '90 天生物年龄逆转仿真。在特定依从性评分下模拟各标志物变化轨迹。生成第 30/60/90 天预测值及关键干预杠杆。',
    params:   ['Adherence Score', 'Baseline BioAge', 'Pillar Risk Profile', 'Intervention Priority'],
    endpoint: 'POST /api/v1/analyze/v4 → digital_twin_prediction',
  },
] as const;

export const PATHWAYS: Pathway[] = [
  {
    id:    'metabolic',
    index: '01',
    tag:      'Metabolic Pathway Mapping',
    tagZh:    '代谢通路映射',
    tagColor: '#60A5FA',
    title:    'Metabolic Pathway Optimization',
    titleZh:  '代谢通路优化',
    description:
      'Activated metabolic pathways are identified from EBM cross-validation output (Cases A, H). The engine maps insulin resistance signals, GKI metabolic flexibility, and lipid kinetics into a causal intervention sequence.',
    descriptionZh:
      '从 EBM 交叉验证输出（Case A、H）识别激活的代谢通路。引擎将胰岛素抵抗信号、GKI 代谢灵活性与脂质动力学映射为因果干预序列。',
    metrics: [
      { label: 'Engine Module',        labelZh: '引擎模块',       value: 'ebm_pathway_engine.py' },
      { label: 'Primary Biomarkers',   labelZh: '核心生物标志物', value: 'TG/HDL · HOMA-IR · GKI · BHB' },
      { label: 'Intervention Window',  labelZh: '干预时间窗',     value: '30–90 days' },
      { label: 'Clock Impact',         labelZh: '时钟效果评估',   value: 'PhenoAge −2.1 yrs (avg)' },
    ],
    evidenceLevel:  'A',
    clockTarget:    'PhenoAge · Case A + H pathway',
    clockTargetZh:  '表型年龄时钟 · Case A + H 通路',
    engineModule:   'ebm_pathway_engine.py',
    engineModuleZh: 'EBM 通路引擎',
    apiEndpoint:    'POST /api/v1/analyze/v4',
  },
  {
    id:    'epigenetic',
    index: '02',
    tag:      'Epigenetic Clock Reset',
    tagZh:    '表观时钟逆转',
    tagColor: '#FFD700',
    title:    'Methylation Reprogramming Protocol',
    titleZh:  '甲基化重编程方案',
    description:
      'Powered by the PhenoAge engine (Levine 2018). Identifies SAM-SAH imbalance via Hcy/B12/Folate panel (Case F). Genomics engine cross-references MTHFR/COMT SNPs to personalise methylation cofactor protocol.',
    descriptionZh:
      '由 PhenoAge 引擎（Levine 2018）驱动。通过 Hcy/B12/Folate 面板（Case F）识别 SAM-SAH 不平衡。基因组引擎交叉比对 MTHFR/COMT SNP 以个性化甲基化辅因子方案。',
    metrics: [
      { label: 'Engine Module',        labelZh: '引擎模块',       value: 'aging_engine.py + genomics_engine.py' },
      { label: 'Primary Biomarkers',   labelZh: '核心生物标志物', value: 'Hcy · B12 · Folate · DNAmAge' },
      { label: 'Intervention Window',  labelZh: '干预时间窗',     value: '60–120 days' },
      { label: 'Clock Impact',         labelZh: '时钟效果评估',   value: 'Horvath 2.0 −3.4 yrs (avg)' },
    ],
    evidenceLevel:  'A',
    clockTarget:    'Horvath 2.0 · GrimAge · Case F',
    clockTargetZh:  'Horvath 2.0 · GrimAge · Case F 表观逆转',
    engineModule:   'aging_engine.py + genomics_engine.py',
    engineModuleZh: 'PhenoAge 引擎 + 基因组引擎',
    apiEndpoint:    'POST /api/v1/analyze/v4',
  },
  {
    id:    'microbiome',
    index: '03',
    tag:      'Gut Barrier & LPS-TLR4 Axis',
    tagZh:    '肠道屏障 & LPS-TLR4 轴',
    tagColor: '#34D399',
    title:    'Gut Microbiome Ecological Engineering',
    titleZh:  '肠道微生态工程',
    description:
      'Case E (Gut Barrier) is the most upstream pillar — its activation degrades interventions across Cases B, C, and H. The engine identifies LPS-TLR4 cascade from hsCRP + NLR dual-flag and generates a targeted gut restoration sequence.',
    descriptionZh:
      'Case E（肠道屏障）是最上游的支柱——其激活会降低 Case B、C、H 的干预效果。引擎从 hsCRP + NLR 双标志识别 LPS-TLR4 级联并生成靶向肠道修复序列。',
    metrics: [
      { label: 'Engine Module',        labelZh: '引擎模块',       value: 'cross_validation_engine.py (Rule 4)' },
      { label: 'Primary Biomarkers',   labelZh: '核心生物标志物', value: 'hsCRP · NLR · LPS · IL-6' },
      { label: 'Intervention Window',  labelZh: '干预时间窗',     value: '45–90 days' },
      { label: 'Upstream Unlock',      labelZh: '上游解锁效应',   value: '+40–60% Case B/C/H efficacy' },
    ],
    evidenceLevel:  'A',
    clockTarget:    'Inflammatory Age Clock · Case E upstream',
    clockTargetZh:  '炎性年龄时钟 · Case E 上游修复',
    engineModule:   'cross_validation_engine.py',
    engineModuleZh: 'EBM 交叉验证引擎（规则 4）',
    apiEndpoint:    'POST /api/v1/analyze/v4',
  },
  {
    id:    'twin',
    index: '04',
    tag:      '90-Day Digital Twin Simulation',
    tagZh:    '90天数字孪生仿真',
    tagColor: '#C084FC',
    title:    'Digital Twin Reversal Planning',
    titleZh:  '数字孪生逆转规划',
    description:
      'The predictive engine simulates a personalised 90-day biological age trajectory. Adjusts projections per adherence level and identifies the top 3 intervention levers with the highest reversal-per-effort ratio.',
    descriptionZh:
      '预测引擎仿真个性化的 90 天生物年龄轨迹。根据依从性水平调整预测，并识别单位努力逆转效率最高的 3 项干预杠杆。',
    metrics: [
      { label: 'Engine Module',        labelZh: '引擎模块',       value: 'predictive_engine.py' },
      { label: 'Simulation Horizon',   labelZh: '仿真时间跨度',   value: 'Day 0 → 30 → 60 → 90' },
      { label: 'Input Variables',      labelZh: '输入变量',       value: 'Adherence score + Pillar risk profile' },
      { label: 'Clock Impact',         labelZh: '时钟效果评估',   value: 'BioAge reversal: −1.6 yrs (80% adherence)' },
    ],
    evidenceLevel:  'B+',
    clockTarget:    'Digital Twin BioAge Trajectory',
    clockTargetZh:  '数字孪生生物年龄轨迹',
    engineModule:   'predictive_engine.py',
    engineModuleZh: '预测引擎（数字孪生）',
    apiEndpoint:    'POST /api/v1/analyze/v4',
  },
];
