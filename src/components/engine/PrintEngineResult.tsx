'use client';

/* ═══════════════════════════════════════════════════════════════════════
   PrintEngineResult — print-only engine analysis report
   Hidden on screen (.print-only), shown only when window.print() fires.
   Rendered inside EngineForm so it shares the result data via props.
═══════════════════════════════════════════════════════════════════════ */

export interface PrintOptimizationItem {
  category: string;
  categoryZh: string;
  recommendation: string;
  recommendationZh: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PrintPillarRow {
  caseId: string;
  nameZh: string;
  nameEn: string;
  risk: 'normal' | 'medium' | 'high';
}

interface Props {
  chronologicalAge: number;
  biologicalAge: number;
  delta: number;
  confidenceInterval?: [number, number];
  optimizationPlan: PrintOptimizationItem[];
  pillarResults: PrintPillarRow[];
  isZh: boolean;
  isMock: boolean;
}

export default function PrintEngineResult({
  chronologicalAge,
  biologicalAge,
  delta,
  confidenceInterval,
  optimizationPlan,
  pillarResults,
  isZh,
  isMock,
}: Props) {
  const today   = new Date().toLocaleDateString('en-CA');
  const todayZh = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  const META = isZh
    ? [
        ['报告日期',   todayZh],
        ['引擎版本',   'PivotOrder 引擎 v2.4.1'],
        ['分析类型',   isMock ? '模拟演示数据' : '多组学生物标志物分析'],
        ['循证依据',   '10,247+ 篇同行评审文献'],
        ['匿名化状态', '已脱敏——不含任何个人识别信息'],
      ]
    : [
        ['Report Date',          today],
        ['Engine Version',       'PivotOrder Engine v2.4.1'],
        ['Analysis Type',        isMock ? 'Mock Demo Data' : 'Multi-Omic Biomarker Analysis'],
        ['Evidence Base',        '10,247+ peer-reviewed publications'],
        ['Anonymization Status', 'PHI Scrubbed — No personal identifiers present'],
      ];

  const riskLabel = (r: string) => {
    if (r === 'high')   return isZh ? '高风险' : 'High Risk';
    if (r === 'medium') return isZh ? '需关注' : 'Watch';
    return isZh ? '正常' : 'Normal';
  };

  const priorityLabel = (p?: string) => {
    if (!p) return '';
    if (p === 'HIGH')   return isZh ? '高优先' : 'HIGH';
    if (p === 'MEDIUM') return isZh ? '中优先' : 'MEDIUM';
    return isZh ? '低优先' : 'LOW';
  };

  return (
    <div className="print-only print-report">

      {/* ── HEADER ── */}
      <div className="pr-header">
        <div>
          <div className="pr-brand">PivotOrder</div>
          <div className="pr-slogan">
            {isZh ? '解码数据 · 重建秩序' : 'DECODING THE DATA · RESTORING THE ORDER'}
          </div>
        </div>
        <div className="pr-header-right">
          <div className="pr-tag">
            {isZh ? '个人生物年龄分析报告' : 'PERSONAL BIOLOGICAL AGE REPORT'}
          </div>
          <div className="pr-tag">
            {isZh
              ? isMock ? '模拟数据 · 仅供参考' : '引擎 v2.4.1 · 循证等级 A'
              : isMock ? 'DEMO DATA · FOR REFERENCE ONLY' : 'ENGINE v2.4.1 · EVIDENCE LEVEL A'}
          </div>
        </div>
      </div>

      <hr className="pr-rule pr-rule--thick" />

      {/* ── TITLE ── */}
      <div className="pr-title-block">
        <h1 className="pr-h1">
          {isZh ? '生物年龄分析报告' : 'Biological Age Analysis Report'}
        </h1>
        <p className="pr-h1-zh">
          {isZh ? 'Biological Age Analysis · PivotOrder Engine' : '多组学生物年龄推演 · PivotOrder 引擎'}
        </p>
      </div>

      {/* ── META TABLE ── */}
      <table className="pr-meta-table">
        <tbody>
          {META.map(([label, value]) => (
            <tr key={label}>
              <td className="pr-meta-label">{label}</td>
              <td className="pr-meta-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="pr-rule" />

      {/* ── BIO AGE RESULT ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">
          {isZh ? '生物年龄向量 · BIOLOGICAL AGE VECTOR' : 'BIOLOGICAL AGE VECTOR · 生物年龄向量'}
        </h2>

        <table className="pr-meta-table">
          <tbody>
            <tr>
              <td className="pr-meta-label">{isZh ? '时序年龄' : 'Chronological Age'}</td>
              <td className="pr-meta-value" style={{ fontWeight: 600 }}>{chronologicalAge} {isZh ? '岁' : 'yrs'}</td>
            </tr>
            <tr>
              <td className="pr-meta-label">{isZh ? '预测生物年龄' : 'Predicted Biological Age'}</td>
              <td className="pr-meta-value" style={{ fontWeight: 700, color: '#B8960C' }}>
                {biologicalAge.toFixed(1)} {isZh ? '岁' : 'yrs'}
              </td>
            </tr>
            <tr>
              <td className="pr-meta-label">{isZh ? '年龄落差' : 'Age Delta'}</td>
              <td className="pr-meta-value" style={{ fontWeight: 700, color: delta < 0 ? '#166534' : '#991B1B' }}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)} {isZh ? '岁' : 'yrs'}
              </td>
            </tr>
            {confidenceInterval && (
              <tr>
                <td className="pr-meta-label">{isZh ? '95% 置信区间' : '95% CI'}</td>
                <td className="pr-meta-value">[{confidenceInterval[0]} — {confidenceInterval[1]}]</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <hr className="pr-rule" />

      {/* ── 10-PILLAR SUMMARY ── */}
      {pillarResults.length > 0 && (
        <section className="pr-section">
          <h2 className="pr-section-label">
            {isZh ? '十大代谢支柱风险评估 · 10-PILLAR METABOLIC AUDIT' : '10-PILLAR METABOLIC AUDIT · 十大代谢支柱风险评估'}
          </h2>
          <table className="pr-metrics-table">
            <tbody>
              <tr>
                <td className="pr-metric-label">{isZh ? '支柱' : 'PILLAR'}</td>
                <td className="pr-metric-label">{isZh ? '英文名称' : 'LABEL'}</td>
                <td className="pr-metric-label">{isZh ? '风险等级' : 'RISK'}</td>
              </tr>
              {pillarResults.map((p) => (
                <tr key={p.caseId}>
                  <td className="pr-metric-value">{p.nameZh}</td>
                  <td className="pr-metric-value" style={{ color: '#6B7280', fontSize: '6.5pt' }}>{p.nameEn}</td>
                  <td className="pr-metric-value" style={{ fontWeight: 700, color: p.risk === 'high' ? '#991B1B' : p.risk === 'medium' ? '#92400E' : '#166534' }}>
                    {riskLabel(p.risk)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <hr className="pr-rule" />

      {/* ── OPTIMIZATION PLAN ── */}
      {optimizationPlan.length > 0 && (
        <section className="pr-section">
          <h2 className="pr-section-label">
            {isZh ? '干预优化方案 · INTERVENTION PRIORITY MAP' : 'INTERVENTION PRIORITY MAP · 干预优化方案'}
          </h2>
          {optimizationPlan.map((item, i) => (
            <div key={i} className="pr-pathway" style={{ marginBottom: '8pt' }}>
              <div className="pr-pathway-header">
                <span className="pr-pathway-index">
                  {isZh ? `干预项目 ${String(i + 1).padStart(2, '0')}` : `ITEM ${String(i + 1).padStart(2, '0')}`}
                </span>
                {item.priority && (
                  <span className="pr-pathway-evidence">{priorityLabel(item.priority)}</span>
                )}
              </div>
              <h3 className="pr-pathway-title" style={{ fontSize: '11pt' }}>
                {isZh ? item.categoryZh : item.category}
              </h3>
              <p className="pr-pathway-title-zh">{isZh ? item.category : item.categoryZh}</p>
              <hr className="pr-rule pr-rule--light" />
              <p className="pr-body">{isZh ? item.recommendationZh : item.recommendation}</p>
              <p className="pr-body-zh">{isZh ? item.recommendation : item.recommendationZh}</p>
            </div>
          ))}
        </section>
      )}

      <hr className="pr-rule" />

      {/* ── DISCLAIMER ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">
          {isZh ? '免责声明' : 'DISCLAIMER'}
        </h2>
        <p className="pr-body">
          {isZh
            ? '本报告由 PivotOrder 多组学融合引擎生成，仅供研究与信息参考，不构成医学诊断或治疗建议。PivotOrder 不背书任何具体商业产品或疗法。如有健康问题，请咨询持牌医疗专业人士。'
            : 'This report is generated by the PivotOrder multi-omic fusion engine for research and informational purposes only. It does not constitute medical advice, diagnosis, or treatment. PivotOrder does not endorse any specific commercial products or therapies. Consult a licensed medical professional for health concerns.'}
        </p>
      </section>

      {/* ── FOOTER ── */}
      <div className="pr-footer">
        <span>
          {isZh
            ? `PivotOrder 生物年龄分析报告 · 生成日期：${todayZh} · 引擎 v2.4.1`
            : `PivotOrder Biological Age Report · Generated ${today} · Engine v2.4.1`}
        </span>
        <span>
          {isZh ? '无商业关联 · 已脱敏 · 仅供科研使用' : 'No commercial affiliation · PHI Scrubbed · Research use only'}
        </span>
      </div>
    </div>
  );
}
