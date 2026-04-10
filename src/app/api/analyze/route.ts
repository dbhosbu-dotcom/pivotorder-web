import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60; // Vercel Pro: allow up to 60s for Claude Vision analysis

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ─── Pillar definitions with trigger thresholds ────────────────────── */
const PILLAR_SYSTEM = `
CASE A — Normal Weight Obesity (NWO) / 隐性肥胖代谢溢出
Markers & Triggers: FBG > 5.4 mmol/L | FINS > 8.0 µIU/mL | TG > 1.2 mmol/L | HDL-C < 1.3 mmol/L | TG/HDL > 1.5
Mechanism: Insulin resistance with visceral fat accumulation despite normal BMI.

CASE B — PCOS + Metabolic Endotoxemia / 激素轴与LPS穿透 (Female)
Markers & Triggers: DHEA-S > 300 µg/dL | Hcy > 10 µmol/L | LPS > 1.0 EU/mL
Mechanism: Androgen axis dysregulation with gut endotoxin-mediated TLR4 activation.

CASE C — T4→T3 Conversion Failure / 甲减转换障碍
Markers & Triggers: TSH > 3.0 mIU/L | fT3 < 4.5 pmol/L | fT4 < 13.0 pmol/L
Mechanism: Deiodinase axis failure converting T4 to inactive rT3 instead of active T3.

CASE D — HPA Axis Dysregulation / 皮质醇监工
Markers & Triggers: Cortisol AM > 500 nmol/L or < 200 nmol/L | DHEA-S < 100 µg/dL
Mechanism: Chronic stress driving cortisol circadian rhythm disruption.

CASE E — Gut Barrier & LPS-TLR4 Cascade / 肠道海关
Markers & Triggers: hsCRP > 1.0 mg/L | NLR > 2.2 | LPS > 1.0 EU/mL
Mechanism: Elevated gut permeability driving systemic TLR4 activation (most upstream pillar).

CASE F — Epigenetics + Methylation / 表观逆转
Markers & Triggers: Hcy > 10.0 µmol/L | B12 < 300 pmol/L | Folate < 13 nmol/L
Mechanism: SAM-SAH imbalance accelerating DNA methylation clock (DNAmAge drift).

CASE G — Autophagy & Mitophagy / 细胞翻新
Markers & Triggers: mTOR persistently elevated | p62/SQSTM1 elevated
Mechanism: Impaired cellular self-cleaning allowing damaged mitochondria accumulation.

CASE H — Chronic Disease Shield (GKI) / 慢病盾牌
Markers & Triggers: GKI > 9 | BHB < 0.2 mmol/L | FBG > 5.4 mmol/L
Mechanism: Poor metabolic flexibility; glucose-dependent state without ketone backup.

CASE I — Blood Rheology + Chronometabolism / 血流变与时间代谢
Markers & Triggers: Fibrinogen > 3.5 g/L | NLR > 2.2
Mechanism: Inflammatory blood viscosity markers linked to all-cause mortality.

CASE J — Immune-Mitochondrial Axis (cGAS-STING) / 免疫线粒体轴
Markers & Triggers: IFN-β > 10 pg/mL | hsCRP > 1.0 mg/L | IL-6 > 3.5 pg/mL
Mechanism: Mitochondrial DNA leak triggering chronic IFN-I elevation; upstream of Case C.

CAUSAL DEPENDENCIES (resolve upstream first):
- Case J → Case C (mtDNA leak suppresses deiodinase)
- Case E → Case B (LPS reduces choline binding 60%)
- Case E → Case C (systemic inflammation disrupts TSH receptor)
- Case G → Case F (damaged mitochondria block methylation reprogramming)
`;

/* ─── Prompt for Claude ─────────────────────────────────────────────── */
function buildAnalysisPrompt(age: number, gender: string, isImageUpload: boolean): string {
  return `You are PivotOrder's clinical analysis engine. ${isImageUpload ? 'Analyze this medical/lab report image.' : 'Analyze the provided biomarker values.'}

Patient context: Age ${age}, Sex ${gender}.

${PILLAR_SYSTEM}

PHENOAGE BIOLOGICAL AGE ESTIMATION:
Use these markers if present, scored 0–100 (higher = worse aging):
- Albumin (optimal: > 42 g/L)
- Creatinine (optimal: 62–106 µmol/L for men, 44–80 for women)
- Glucose/FBG (optimal: 4.2–5.1 mmol/L)
- CRP/hsCRP (optimal: < 0.5 mg/L)
- Lymphocyte % (optimal: 25–40%)
- Mean Corpuscular Volume (optimal: 82–92 fL)
- RBC Distribution Width (optimal: < 12%)
- Alkaline Phosphatase (optimal: 35–75 U/L)
- WBC (optimal: 3.5–6.0 × 10^9/L)
Bio-age delta = weighted score relative to chronological age ${age}. If too few PhenoAge markers are present, estimate from available metabolic markers and clinical patterns.

EBM CROSS-VALIDATION RULES (check each if data available):
1. TG/HDL ratio > 1.5 → insulin resistance proxy (Case A risk)
2. HOMA-IR (FBG × FINS / 22.5) > 2.5 → significant IR
3. TSH > 3.0 AND any of: low fT3, high Hcy, high hsCRP → Case C + Case J link
4. hsCRP > 1.0 AND NLR > 2.2 → dual-inflammation flag (Case E active)
5. Hcy > 10 AND B12 < 300 → methylation deficiency (Case F)
6. Multiple case triggers present → cascade risk (identify upstream blocker)

TASK:
${isImageUpload
  ? '1. Extract ALL visible biomarkers from the report image (name, value, unit). Be thorough — scan the entire image.'
  : '1. Use the biomarker data provided.'}
2. Evaluate each of the 10 Cases based on available markers and their PivotOrder trigger thresholds.
3. For cases with insufficient markers, use clinical reasoning and available proxy markers.
4. Estimate biological age vs chronological age ${age}.
5. Identify which EBM cross-validation rules fire.
6. Project a 90-day digital twin trajectory (assuming 80% adherence to recommendations).
7. Generate a prioritised intervention plan.

Return ONLY valid JSON (no markdown, no explanation) in EXACTLY this structure:

{
  "extracted_markers": [
    { "name": "FBG", "value": 5.6, "unit": "mmol/L", "pillar": "A", "status": "triggered" }
  ],
  "pillar_results": [
    {
      "caseId": "A",
      "nameZh": "隐性肥胖代谢溢出",
      "nameEn": "Normal Weight Obesity",
      "risk": "medium",
      "flags": [{ "marker": "FBG", "value": "5.6", "unit": "mmol/L", "trigger": "5.4" }],
      "mechanism": "中文机制说明（2–3句话，基于实际提取到的标志物）",
      "mechanismEn": "English mechanism explanation (2–3 sentences, based on actually extracted markers)",
      "suggestion": "中文干预建议（具体，临床级别）",
      "suggestionEn": "English intervention suggestion (specific, clinical-grade)",
      "dependency": "中文上游依赖说明（如适用，否则null）",
      "dependencyEn": "English upstream dependency note (if applicable, else null)"
    }
  ],
  "biological_age": {
    "chronological": ${age},
    "predicted": 0,
    "delta": 0,
    "confidence_interval": [0, 0],
    "phenoage_markers_used": ["list of markers used in calculation"],
    "calculation_note": "Brief explanation of how bio age was estimated"
  },
  "ebm_insights": [
    {
      "rule": "TG/HDL Ratio",
      "ruleZh": "TG/HDL 比值",
      "triggered": true,
      "value": "1.8",
      "threshold": "> 1.5",
      "finding": "Insulin resistance proxy elevated — visceral fat accumulation likely.",
      "findingZh": "胰岛素抵抗代理指标升高——内脏脂肪积累概率高。",
      "severity": "medium",
      "casesLinked": ["A"]
    }
  ],
  "digital_twin": {
    "baseline_age": 0,
    "day30_projection": 0,
    "day60_projection": 0,
    "day90_projection": 0,
    "reversal_potential": 0,
    "key_levers": ["Top 3 interventions driving the reversal"],
    "confidence": "moderate"
  },
  "optimization_plan": [
    {
      "category": "English category",
      "categoryZh": "中文类别",
      "recommendation": "English recommendation (specific, evidence-based, with dosing)",
      "recommendationZh": "中文建议（具体，有循证依据，包含剂量）",
      "priority": "HIGH",
      "caseLinked": "A"
    }
  ],
  "data_completeness": 75,
  "primary_driver": "Case E",
  "primary_driver_zh": "肠道海关"
}

IMPORTANT RULES:
- "risk" must be exactly "high", "medium", or "normal"
- "severity" must be "high", "medium", or "low"
- "priority" must be "HIGH", "MEDIUM", or "LOW"
- "confidence" must be "high", "moderate", or "low"
- All 10 cases (A–J) MUST appear in pillar_results, even if risk is "normal"
- Only include ebm_insights for rules that actually fire based on available data
- digital_twin projections should be in biological age years
- optimization_plan should have 4–6 items, ordered by priority
- If gender is Female, Case B is relevant; if Male, set Case B to risk "normal" with appropriate note
- Be medically accurate and conservative — this is clinical-grade output
- Return ONLY the JSON object, nothing else`;
}

/* ─── Response types ────────────────────────────────────────────────── */
export interface ExtractedMarker {
  name: string;
  value: number;
  unit: string;
  pillar: string;
  status: 'triggered' | 'optimal' | 'suboptimal' | 'unknown';
}

export interface EBMInsight {
  rule: string;
  ruleZh: string;
  triggered: boolean;
  value: string;
  threshold: string;
  finding: string;
  findingZh: string;
  severity: 'high' | 'medium' | 'low';
  casesLinked: string[];
}

export interface DigitalTwin {
  baseline_age: number;
  day30_projection: number;
  day60_projection: number;
  day90_projection: number;
  reversal_potential: number;
  key_levers: string[];
  confidence: 'high' | 'moderate' | 'low';
}

export interface AnalyzeV4Response {
  extracted_markers: ExtractedMarker[];
  pillar_results: {
    caseId: string;
    nameZh: string;
    nameEn: string;
    risk: 'high' | 'medium' | 'normal';
    flags: { marker: string; value: string; unit: string; trigger: string }[];
    mechanism: string;
    mechanismEn: string;
    suggestion: string;
    suggestionEn: string;
    dependency: string | null;
    dependencyEn: string | null;
  }[];
  biological_age: {
    chronological: number;
    predicted: number;
    delta: number;
    confidence_interval: [number, number];
    phenoage_markers_used: string[];
    calculation_note: string;
  };
  ebm_insights: EBMInsight[];
  digital_twin: DigitalTwin;
  optimization_plan: {
    category: string;
    categoryZh: string;
    recommendation: string;
    recommendationZh: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    caseLinked: string;
  }[];
  data_completeness: number;
  primary_driver: string;
  primary_driver_zh: string;
}

/* ─── Route handler ─────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    let age = 40;
    let gender = 'Male';
    let fileBase64: string | null = null;
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | null = null;
    let isImageUpload = false;
    let isPDF = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      age    = parseInt((formData.get('age') as string) ?? '40', 10);
      gender = (formData.get('gender') as string) ?? 'Male';
      const file = formData.get('file') as File | null;

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        fileBase64 = buffer.toString('base64');
        const name = file.name.toLowerCase();
        if (name.endsWith('.pdf')) {
          isPDF = true;
        } else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
          mediaType = 'image/jpeg';
          isImageUpload = true;
        } else if (name.endsWith('.png')) {
          mediaType = 'image/png';
          isImageUpload = true;
        } else if (name.endsWith('.webp')) {
          mediaType = 'image/webp';
          isImageUpload = true;
        } else {
          mediaType = 'image/jpeg';
          isImageUpload = true;
        }
      }
    } else {
      const body = await req.json();
      age    = body.age    ?? body.currentAge ?? 40;
      gender = body.gender ?? 'Male';
    }

    const prompt = buildAnalysisPrompt(age, gender, isImageUpload || isPDF);

    // Build message content
    type MessageContent = { type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } } | { type: 'document'; source: { type: 'base64'; media_type: string; data: string } };
    const messageContent: MessageContent[] = [];

    if (fileBase64) {
      if (isPDF) {
        messageContent.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
        });
      } else if (isImageUpload && mediaType) {
        messageContent.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: fileBase64 },
        });
      }
    }

    messageContent.push({ type: 'text', text: prompt });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: messageContent as Parameters<typeof client.messages.create>[0]['messages'][0]['content'],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Claude did not return valid JSON');
    }

    const analysisResult: AnalyzeV4Response = JSON.parse(jsonMatch[0]);

    // Ensure all 10 pillars exist
    const ALL_CASE_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (const caseId of ALL_CASE_IDS) {
      if (!analysisResult.pillar_results.find((p) => p.caseId === caseId)) {
        analysisResult.pillar_results.push({
          caseId,
          nameZh: PILLAR_NAMES_ZH[caseId] ?? caseId,
          nameEn: PILLAR_NAMES_EN[caseId] ?? caseId,
          risk: 'normal',
          flags: [],
          mechanism: '暂无足够标志物评估此支柱',
          mechanismEn: 'Insufficient markers to evaluate this pillar',
          suggestion: '定期监测相关标志物',
          suggestionEn: 'Monitor relevant markers regularly',
          dependency: null,
          dependencyEn: null,
        });
      }
    }

    // Sort pillars: high → medium → normal
    analysisResult.pillar_results.sort((a, b) => {
      const order = { high: 0, medium: 1, normal: 2 };
      return order[a.risk] - order[b.risk];
    });

    return NextResponse.json(analysisResult);
  } catch (err) {
    console.error('[/api/analyze]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analysis failed' },
      { status: 500 },
    );
  }
}

const PILLAR_NAMES_ZH: Record<string, string> = {
  A: '隐性肥胖代谢溢出', B: '激素轴与LPS穿透', C: '甲减转换障碍',
  D: '皮质醇监工', E: '肠道海关', F: '表观逆转',
  G: '细胞翻新', H: '慢病盾牌', I: '血流变与时间代谢', J: '免疫线粒体轴',
};
const PILLAR_NAMES_EN: Record<string, string> = {
  A: 'Normal Weight Obesity', B: 'PCOS + Metabolic Endotoxemia', C: 'T4→T3 Conversion Failure',
  D: 'HPA Axis Dysregulation', E: 'Gut Barrier & LPS-TLR4', F: 'Epigenetics + Methylation',
  G: 'Autophagy & Mitophagy', H: 'Chronic Disease Shield (GKI)', I: 'Blood Rheology + Chrono', J: 'Immune-Mitochondrial Axis',
};
