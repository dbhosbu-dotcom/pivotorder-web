/**
 * pathwayData.ts — Single source of truth for clinical pathway content.
 * Imported by both SolutionsGrid (display) and SolutionsCta (PDF export).
 */

export interface Pathway {
  id:            string;
  index:         string;
  tag:           string;
  tagColor:      string;
  title:         string;
  titleZh:       string;
  description:   string;
  descriptionZh: string;
  metrics:       { label: string; value: string }[];
  evidenceLevel: string;
  clockTarget:   string;
}

export const PATHWAYS: Pathway[] = [
  {
    id:    'metabolic',
    index: '01',
    tag:   'Amino Acid & Lipid Kinetics',
    tagColor: '#60A5FA',
    title:    'Metabolic Pathway Optimization',
    titleZh:  '代谢通路优化',
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
    clockTarget:   'PhenoAge · Metabolomic Clock',
  },
  {
    id:    'epigenetic',
    index: '02',
    tag:   'DNA Methylation',
    tagColor: '#FFD700',
    title:    'Epigenetic Clock Reset',
    titleZh:  '表观遗传时钟干预',
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
    clockTarget:   'Horvath 2.0 · GrimAge',
  },
  {
    id:    'microbiome',
    index: '03',
    tag:   'Gut-Brain Axis',
    tagColor: '#34D399',
    title:    'Microbiome Ecological Engineering',
    titleZh:  '微生态工程',
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
    clockTarget:   'Microbiome Diversity Clock',
  },
  {
    id:    'autonomic',
    index: '04',
    tag:   'HRV Biofeedback',
    tagColor: '#C084FC',
    title:    'Autonomic Resilience Training',
    titleZh:  '自主神经适应性训练',
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
    clockTarget:   'HRV Autonomic Model',
  },
];
