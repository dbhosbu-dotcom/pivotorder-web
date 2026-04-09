'use client';

import { PATHWAYS } from '@/lib/pathwayData';
import { useT, useLanguage } from '@/context/LanguageContext';

/* ═══════════════════════════════════════════════════════════════
   PrintReport — hidden on screen, rendered during window.print()
   Chinese-first when lang = 'zh', English-first otherwise.
═══════════════════════════════════════════════════════════════ */

export default function PrintReport() {
  const t   = useT();
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const today   = new Date().toLocaleDateString('en-CA');
  const todayZh = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const META = isZh
    ? [
        ['报告日期',   todayZh],
        ['引擎版本',   'PivotOrder 引擎 v2.4.1'],
        ['分析类型',   '多组学生物年龄——完整检测面板'],
        ['循证依据',   '10,247+ 篇同行评审文献（PubMed · Cochrane · NEJM）'],
        ['匿名化状态', '已脱敏——不含任何个人识别信息'],
        ['商业关联',   '无——独立算法输出，无商业关联'],
      ]
    : [
        ['Report Date',            today],
        ['Engine Version',         'PivotOrder Engine v2.4.1'],
        ['Analysis Type',          'Multi-Omic Biological Age — Full Panel'],
        ['Evidence Base',          '10,247+ peer-reviewed publications (PubMed · Cochrane · NEJM)'],
        ['Anonymization Status',   'PHI Scrubbed — No personal identifiers present'],
        ['Commercial Affiliation', 'None — Independent algorithmic output'],
      ];

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
            {isZh ? '第三方临床评估报告' : 'THIRD-PARTY CLINICAL ASSESSMENT'}
          </div>
          <div className="pr-tag">
            {isZh ? '循证等级 A · 已脱敏' : 'EVIDENCE LEVEL A · PHI SCRUBBED'}
          </div>
        </div>
      </div>

      <hr className="pr-rule pr-rule--thick" />

      {/* ── TITLE BLOCK ── */}
      <div className="pr-title-block">
        <h1 className="pr-h1">
          {isZh ? '临床干预路径报告' : t.solutions.hero_headline}
        </h1>
        <p className="pr-h1-zh">
          {isZh ? 'Clinical Intervention Pathways' : t.solutions.grid_label}
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

      {/* ── EXECUTIVE SUMMARY ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">
          {isZh ? '执行摘要 · EXECUTIVE SUMMARY' : 'EXECUTIVE SUMMARY · 执行摘要'}
        </h2>
        {isZh ? (
          <>
            <p className="pr-body">
              本报告呈现四项基于循证医学的临床干预路径，完全源自多组学生物标志物分析。
              每项路径均依据同行评审文献推导，并针对 PivotOrder 引擎计算的个体生物年龄落差进行校准。
              本报告不背书任何具体商业产品、品牌或疗法。
            </p>
            <p className="pr-body-zh">
              This report presents four evidence-based clinical intervention pathways generated exclusively
              from multi-omic biomarker analysis. Each pathway is derived from peer-reviewed literature and
              calibrated against the individual biological age delta computed by the PivotOrder Engine.
              No commercial products, brands, or therapies are endorsed herein.
            </p>
          </>
        ) : (
          <>
            <p className="pr-body">
              This report presents four evidence-based clinical intervention pathways generated exclusively
              from multi-omic biomarker analysis. Each pathway is derived from peer-reviewed literature and
              calibrated against the individual biological age delta computed by the PivotOrder Engine.
              No commercial products, brands, or therapies are endorsed herein.
            </p>
            <p className="pr-body-zh">
              本报告呈现四项基于循证医学的临床干预路径，完全源自多组学生物标志物分析。
              不背书任何商业产品或疗法。
            </p>
          </>
        )}
      </section>

      <hr className="pr-rule" />

      {/* ── PATHWAY CARDS ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">
          {isZh
            ? `多组学干预矩阵 · ${t.solutions.grid_label.toUpperCase()}`
            : `${t.solutions.grid_label.toUpperCase()} · 多组学干预矩阵`}
        </h2>

        {PATHWAYS.map((pw) => (
          <div key={pw.id} className="pr-pathway">

            {/* Index + Evidence badge */}
            <div className="pr-pathway-header">
              <span className="pr-pathway-index">
                {isZh ? `干预路径 ${pw.index}` : `PATHWAY ${pw.index}`}
              </span>
              <span className="pr-pathway-evidence">
                {isZh ? `循证等级 ${pw.evidenceLevel}` : `Evidence ${pw.evidenceLevel}`}
              </span>
            </div>

            {/* Domain tag */}
            <p className="pr-domain-tag">
              {isZh ? pw.tagZh.toUpperCase() : pw.tag.toUpperCase()}
            </p>

            {/* Title: swap primary/secondary by language */}
            <h3 className="pr-pathway-title">
              {isZh ? pw.titleZh : pw.title}
            </h3>
            <p className="pr-pathway-title-zh">
              {isZh ? pw.title : pw.titleZh}
            </p>

            <hr className="pr-rule pr-rule--light" />

            {/* Description: swap primary/secondary by language */}
            <p className="pr-body">
              {isZh ? pw.descriptionZh : pw.description}
            </p>
            <p className="pr-body-zh">
              {isZh ? pw.description : pw.descriptionZh}
            </p>

            {/* Metrics table */}
            <table className="pr-metrics-table">
              <tbody>
                {pw.metrics.map((m) => (
                  <tr key={m.label}>
                    <td className="pr-metric-label">
                      {(isZh ? m.labelZh : m.label).toUpperCase()}
                    </td>
                    <td className="pr-metric-value">{m.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pr-metric-label">
                    {isZh ? '时钟靶点' : 'CLOCK TARGET'}
                  </td>
                  <td className="pr-metric-value">
                    {isZh ? pw.clockTargetZh : pw.clockTarget}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <hr className="pr-rule" />

      {/* ── METHODOLOGY DECLARATION ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">
          {isZh
            ? '方法论声明 · METHODOLOGY DECLARATION'
            : 'METHODOLOGY DECLARATION · 方法论声明'}
        </h2>
        {isZh ? (
          <>
            <p className="pr-body">
              本报告所有干预路径均源自同行评审证据（PubMed · Cochrane · NEJM · Lancet）与个人多组学引擎输出。
              PivotOrder 不背书、不生产、不分发任何具体产品、补剂或疗法。
              本报告仅用于科研与临床决策辅助目的，不替代专业医疗建议、诊断或治疗。
            </p>
            <p className="pr-body-zh">
              All pathways are derived exclusively from peer-reviewed evidence and individual multi-omic engine output.
              PivotOrder does not endorse, manufacture, or distribute any specific product, supplement, or therapy.
              For research and clinical decision-support purposes only.
            </p>
          </>
        ) : (
          <>
            <p className="pr-body">
              All intervention pathways presented in this report are derived exclusively from peer-reviewed
              evidence (PubMed · Cochrane · NEJM · Lancet) and individual multi-omic engine output.
              PivotOrder does not endorse, manufacture, or distribute any specific product, supplement, or therapy.
              This report is for research and clinical decision-support purposes only.
              It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="pr-body-zh">
              本报告所有干预路径均源自同行评审证据与个人多组学引擎输出。不背书任何具体产品或疗法。
              仅供科研与临床决策辅助，不替代专业医疗建议。
            </p>
          </>
        )}
      </section>

      {/* ── FOOTER ── */}
      <div className="pr-footer">
        <span>
          {isZh
            ? `PivotOrder 临床干预路径报告 · 生成日期：${todayZh} · 引擎 v2.4.1 · 机密文件`
            : `PivotOrder Clinical Strategy Report · Generated ${today} · Engine v2.4.1 · CONFIDENTIAL`}
        </span>
        <span>
          {isZh
            ? '无商业关联 · 已脱敏 · 仅供科研使用'
            : 'No commercial affiliation · PHI Scrubbed · For research use only'}
        </span>
      </div>
    </div>
  );
}
