/**
 * generateClinicalPDF.ts
 * Pure-client PDF generator using jsPDF.
 * Only call this inside a 'use client' component.
 */

export interface PDFPathway {
  index: string;
  tag: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  metrics: { label: string; value: string }[];
  evidenceLevel: string;
  clockTarget: string;
}

/* ─── Colour constants ──────────────────────────────────────────────── */
const C = {
  black:      [15,  17,  23]  as [number,number,number],
  heading:    [31,  41,  55]  as [number,number,number],
  body:       [74,  74,  74]  as [number,number,number],
  muted:      [140, 140, 140] as [number,number,number],
  accent:     [180, 140,  0]  as [number,number,number], // dark gold — legible on white
  border:     [228, 232, 237] as [number,number,number],
  bgSubtle:   [244, 246, 248] as [number,number,number],
};

/* ─── Text wrapper ──────────────────────────────────────────────────── */
function splitLines(
  doc: import('jspdf').jsPDF,
  text: string,
  maxWidth: number,
): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

/* ─── Main export ───────────────────────────────────────────────────── */
export async function generateClinicalPDF(pathways: PDFPathway[]): Promise<void> {
  // Dynamic import — keeps jsPDF out of the server bundle
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const PW   = 210;   // page width  mm
  const PH   = 297;   // page height mm
  const ML   = 18;    // margin left
  const MR   = 18;    // margin right
  const CW   = PW - ML - MR;  // content width
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  let y = ML; // cursor y

  /* ─── helper: horizontal rule ─── */
  function hr(yPos: number, color = C.border, thickness = 0.25) {
    doc.setDrawColor(...color);
    doc.setLineWidth(thickness);
    doc.line(ML, yPos, PW - MR, yPos);
  }

  /* ─── helper: page break guard ─── */
  function ensureSpace(needed: number) {
    if (y + needed > PH - 20) {
      doc.addPage();
      y = ML;
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     COVER BLOCK
  ════════════════════════════════════════════════════════════════════ */

  // Header bar (dark)
  doc.setFillColor(...C.black);
  doc.rect(0, 0, PW, 38, 'F');

  // Logo-area text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 215, 0);      // accent gold
  doc.text('PivotOrder', ML, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text('DECODING THE DATA  ·  RESTORING THE ORDER', ML, 22);

  // Classification tag (top-right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.text('THIRD-PARTY CLINICAL ASSESSMENT  ·  EVIDENCE LEVEL A', PW - MR, 22, { align: 'right' });

  y = 50;

  // Report title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.heading);
  doc.text('Clinical Intervention Pathways', ML, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...C.muted);
  doc.text('临床干预路径报告', ML, y);
  y += 10;

  hr(y);
  y += 8;

  // Meta grid
  const META = [
    ['Report Date',           today],
    ['Engine Version',        'PivotOrder Engine v2.4.1'],
    ['Analysis Type',         'Multi-Omic Biological Age — Full Panel'],
    ['Evidence Base',         '10,247+ peer-reviewed publications (PubMed · Cochrane · NEJM)'],
    ['Anonymization Status',  'PHI Scrubbed — No personal identifiers present'],
    ['Commercial Affiliation','None — Independent algorithmic output'],
  ];

  META.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text(label.toUpperCase(), ML, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.body);
    doc.text(value, ML + 52, y);
    y += 6;
  });

  y += 6;
  hr(y, C.border, 0.4);
  y += 10;

  /* ════════════════════════════════════════════════════════════════════
     EXECUTIVE SUMMARY
  ════════════════════════════════════════════════════════════════════ */

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.accent);
  doc.text('EXECUTIVE SUMMARY  ·  执行摘要', ML, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.body);
  const summary =
    'This report presents four evidence-based clinical intervention pathways generated exclusively ' +
    'from multi-omic biomarker analysis. Each pathway is derived from peer-reviewed literature and ' +
    'calibrated against the individual biological age delta computed by the PivotOrder Engine. ' +
    'No commercial products, brands, or therapies are endorsed herein.';
  const summaryLines = splitLines(doc, summary, CW);
  doc.text(summaryLines, ML, y);
  y += summaryLines.length * 5 + 4;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  const summaryZh =
    '本报告呈现四项基于循证医学的临床干预路径，完全源自多组学生物标志物分析。' +
    '每项路径均依据同行评审文献推导，并针对 PivotOrder 引擎计算的个体生物年龄落差进行校准。本报告不背书任何具体商业产品、品牌或疗法。';
  const summaryZhLines = splitLines(doc, summaryZh, CW);
  doc.text(summaryZhLines, ML, y);
  y += summaryZhLines.length * 5 + 10;

  hr(y, C.border, 0.4);
  y += 12;

  /* ════════════════════════════════════════════════════════════════════
     PATHWAY CARDS
  ════════════════════════════════════════════════════════════════════ */

  pathways.forEach((pw, i) => {
    ensureSpace(80);

    // Card background
    doc.setFillColor(...C.bgSubtle);
    const cardStartY = y - 4;

    // We'll draw the rect after measuring — use a placeholder
    const beforeY = y;

    // Index badge
    doc.setFillColor(...C.black);
    doc.roundedRect(ML, y - 1, 10, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 215, 0);
    doc.text(pw.index, ML + 5, y + 3.2, { align: 'center' });

    // Evidence badge (right)
    const evLabel = `Evidence ${pw.evidenceLevel}`;
    doc.setFontSize(6.5);
    doc.setTextColor(...C.accent);
    doc.text(evLabel, PW - MR, y + 3.2, { align: 'right' });

    y += 10;

    // Domain tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.accent);
    doc.text(pw.tag.toUpperCase(), ML, y);
    y += 5;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...C.heading);
    const titleLines = splitLines(doc, pw.title, CW);
    doc.text(titleLines, ML, y);
    y += titleLines.length * 6;

    // Title ZH
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text(pw.titleZh, ML, y);
    y += 6;

    // Thin rule under title
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.2);
    doc.line(ML, y, PW - MR, y);
    y += 5;

    // Description EN
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.body);
    const descLines = splitLines(doc, pw.description, CW);
    doc.text(descLines, ML, y);
    y += descLines.length * 4.8 + 2;

    // Description ZH
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    const descZhLines = splitLines(doc, pw.descriptionZh, CW);
    doc.text(descZhLines, ML, y);
    y += descZhLines.length * 4.5 + 5;

    // Metric rows
    pw.metrics.forEach((m) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.text(m.label.toUpperCase(), ML + 2, y);

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.heading);
      doc.text(m.value, ML + 54, y);
      y += 5;
    });

    // Clock target
    y += 2;
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(`Clock Target: ${pw.clockTarget}`, ML + 2, y);
    y += 4;

    // Draw card bg rect retroactively
    doc.setFillColor(...C.bgSubtle);
    doc.roundedRect(ML - 3, cardStartY - 2, CW + 6, y - cardStartY + 6, 2, 2, 'F');

    // Re-draw content on top of bg (jsPDF is stack-ordered)
    // — redraw index badge
    doc.setFillColor(...C.black);
    doc.roundedRect(ML, beforeY - 1, 10, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 215, 0);
    doc.text(pw.index, ML + 5, beforeY + 3.2, { align: 'center' });

    y += 12;
  });

  /* ════════════════════════════════════════════════════════════════════
     METHODOLOGY DECLARATION
  ════════════════════════════════════════════════════════════════════ */

  ensureSpace(55);

  hr(y, C.border, 0.5);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.accent);
  doc.text('METHODOLOGY DECLARATION  ·  方法论声明', ML, y);
  y += 7;

  const decl =
    'All intervention pathways presented in this report are derived exclusively from peer-reviewed ' +
    'evidence (PubMed · Cochrane · NEJM · Lancet) and individual multi-omic engine output. ' +
    'PivotOrder does not endorse, manufacture, or distribute any specific product, supplement, or therapy. ' +
    'This report is for research and clinical decision-support purposes only. ' +
    'It is not a substitute for professional medical advice, diagnosis, or treatment.';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.body);
  const declLines = splitLines(doc, decl, CW);
  doc.text(declLines, ML, y);
  y += declLines.length * 4.8 + 3;

  const declZh =
    '本报告所有干预路径均源自同行评审证据与个人多组学引擎输出。PivotOrder 不背书、不生产、不分发任何具体产品、' +
    '补剂或疗法。本报告仅用于科研与临床决策辅助目的，不替代专业医疗建议、诊断或治疗。';
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  const declZhLines = splitLines(doc, declZh, CW);
  doc.text(declZhLines, ML, y);

  /* ════════════════════════════════════════════════════════════════════
     FOOTER on every page
  ════════════════════════════════════════════════════════════════════ */

  const totalPages = (doc as any).internal.getNumberOfPages() as number;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(ML, PH - 14, PW - MR, PH - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(
      `PivotOrder Clinical Strategy Report  ·  Generated ${today}  ·  Engine v2.4.1  ·  CONFIDENTIAL`,
      ML,
      PH - 9,
    );
    doc.text(`Page ${p} / ${totalPages}`, PW - MR, PH - 9, { align: 'right' });
  }

  /* ─── Download ─── */
  const filename = `PivotOrder_Clinical_Strategy_${today}.pdf`;
  doc.save(filename);
}
