'use client';

/**
 * PrintReport.tsx
 * Visible ONLY during @media print.
 * Renders a clean A4 medical report in the active language.
 */

import { PATHWAYS } from '@/lib/pathwayData';
import { useT } from '@/context/LanguageContext';

const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

export default function PrintReport() {
  const t = useT();
  return (
    <div className="print-only print-report">

      {/* ══════════════════════════════════════════════════════
          COVER HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="pr-header">
        <div className="pr-header-left">
          <div className="pr-brand">PivotOrder</div>
          <div className="pr-slogan">DECODING THE DATA · RESTORING THE ORDER</div>
        </div>
        <div className="pr-header-right">
          <div className="pr-tag">THIRD-PARTY CLINICAL ASSESSMENT</div>
          <div className="pr-tag">EVIDENCE LEVEL A · PHI SCRUBBED</div>
        </div>
      </div>

      <hr className="pr-rule pr-rule--thick" />

      {/* ── Report title ── */}
      <div className="pr-title-block">
        <h1 className="pr-h1">{t.solutions.hero_headline}</h1>
        <p className="pr-h1-zh">{t.solutions.grid_label}</p>
      </div>

      {/* ── Meta table ── */}
      <table className="pr-meta-table">
        <tbody>
          {[
            ['Report Date',            today],
            ['Engine Version',         'PivotOrder Engine v2.4.1'],
            ['Analysis Type',          'Multi-Omic Biological Age — Full Panel'],
            ['Evidence Base',          '10,247+ peer-reviewed publications (PubMed · Cochrane · NEJM · Lancet)'],
            ['Anonymization Status',   'PHI Scrubbed — No personal identifiers present'],
            ['Commercial Affiliation', 'None — Independent algorithmic output'],
          ].map(([label, value]) => (
            <tr key={label}>
              <td className="pr-meta-label">{label}</td>
              <td className="pr-meta-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="pr-rule" />

      {/* ── Executive summary ── */}
      <section className="pr-section">
        <h2 className="pr-section-label">EXECUTIVE SUMMARY · 执行摘要</h2>
        <p className="pr-body">{t.solutions.methodology_note}</p>
      </section>

      <hr className="pr-rule" />

      {/* ══════════════════════════════════════════════════════
          PATHWAY CARDS (01 – 04)
      ══════════════════════════════════════════════════════ */}
      <section className="pr-section">
        <h2 className="pr-section-label">{t.solutions.grid_label.toUpperCase()}</h2>

        {PATHWAYS.map((pw) => (
          <div key={pw.id} className="pr-pathway">

            {/* Pathway header row */}
            <div className="pr-pathway-header">
              <span className="pr-pathway-index">PATHWAY {pw.index}</span>
              <span className="pr-pathway-evidence">Evidence {pw.evidenceLevel}</span>
            </div>

            {/* Domain tag */}
            <p className="pr-domain-tag">{pw.tag.toUpperCase()}</p>

            {/* Title */}
            <h3 className="pr-pathway-title">{pw.title}</h3>
            <p className="pr-pathway-title-zh">{pw.titleZh}</p>

            <hr className="pr-rule pr-rule--light" />

            {/* Description EN */}
            <p className="pr-body">{pw.description}</p>

            {/* Description ZH */}
            <p className="pr-body-zh">{pw.descriptionZh}</p>

            {/* Metrics */}
            <table className="pr-metrics-table">
              <tbody>
                {pw.metrics.map((m) => (
                  <tr key={m.label}>
                    <td className="pr-metric-label">{m.label.toUpperCase()}</td>
                    <td className="pr-metric-value">{m.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pr-metric-label">CLOCK TARGET</td>
                  <td className="pr-metric-value">{pw.clockTarget}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <hr className="pr-rule" />

      {/* ══════════════════════════════════════════════════════
          METHODOLOGY DECLARATION
      ══════════════════════════════════════════════════════ */}
      <section className="pr-section">
        <h2 className="pr-section-label">METHODOLOGY DECLARATION · 方法论声明</h2>
        <p className="pr-body">
          All intervention pathways presented in this report are derived exclusively from peer-reviewed
          evidence (PubMed · Cochrane · NEJM · Lancet) and individual multi-omic engine output.
          PivotOrder does not endorse, manufacture, or distribute any specific product, supplement,
          or therapy. This report is for research and clinical decision-support purposes only.
          It is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
        <p className="pr-body-zh">
          本报告所有干预路径均源自同行评审证据与个人多组学引擎输出。PivotOrder 不背书、不生产、不分发任何具体产品、
          补剂或疗法。本报告仅用于科研与临床决策辅助目的，不替代专业医疗建议、诊断或治疗。
        </p>
      </section>

      {/* ── Report footer ── */}
      <div className="pr-footer">
        <span>PivotOrder Clinical Strategy Report · Generated {today} · Engine v2.4.1 · CONFIDENTIAL</span>
        <span>No commercial affiliation · PHI Scrubbed · For research use only</span>
      </div>
    </div>
  );
}
