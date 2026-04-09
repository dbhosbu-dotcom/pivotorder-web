'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─── Data ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id:       'api',
    index:    '01',
    tag:      'Integration Layer',
    title:    'API Access',
    titleZh:  'API 接口接入',
    body:
      'RESTful JSON API with sub-2s latency. Submit a multi-omic biomarker payload and receive a ' +
      'consensus biological age delta plus ranked EBM intervention pathways. ' +
      'Rate limits and SLA tiers negotiated per institution.',
    bodyZh:   '低延迟 RESTful JSON API，提交多组学生物标志物，返回共识生物年龄落差及循证干预路径，速率限制与 SLA 按机构协商。',
    specs: [
      { label: 'Protocol',    value: 'REST / JSON  ·  HTTPS only' },
      { label: 'Latency',     value: '< 2 000 ms p99' },
      { label: 'Auth',        value: 'API Key  ·  mTLS available' },
      { label: 'Data Return', value: 'age_delta · pathways · evidence_refs' },
    ],
  },
  {
    id:       'whitelabel',
    index:    '02',
    tag:      'Report Layer',
    title:    'White-Label Report Generation',
    titleZh:  '白标报告生成',
    body:
      'Generate PHI-scrubbed, institution-branded clinical strategy reports in PDF or structured JSON. ' +
      'Fully neutral — no PivotOrder branding surfaces to end patients unless requested. ' +
      'Custom header, logo, and disclaimer fields supported.',
    bodyZh:   '生成 PHI 脱敏的机构品牌临床策略报告（PDF 或结构化 JSON），完全中立，可配置机构抬头、Logo 与免责声明字段。',
    specs: [
      { label: 'Output',      value: 'PDF  ·  JSON  ·  HL7 FHIR R4' },
      { label: 'Branding',    value: 'White-label or co-branded' },
      { label: 'Languages',   value: 'English  ·  Simplified Chinese' },
      { label: 'Compliance',  value: 'HIPAA-ready  ·  GDPR-ready' },
    ],
  },
  {
    id:       'cohort',
    index:    '03',
    tag:      'Research Layer',
    title:    'Cohort Analysis',
    titleZh:  '研究队列分析',
    body:
      'Aggregate anonymised biological age trajectories across patient cohorts. ' +
      'Identify intervention response clusters, outlier populations, and longitudinal drift patterns. ' +
      'Delivered as structured data exports or interactive dashboard access.',
    bodyZh:   '聚合患者队列匿名化生物年龄轨迹，识别干预响应聚类、异常人群与纵向漂移模式，以结构化数据导出或交互式仪表板形式交付。',
    specs: [
      { label: 'Min Cohort',  value: '50 individuals' },
      { label: 'Output',      value: 'CSV  ·  Parquet  ·  Dashboard' },
      { label: 'Anonymity',   value: 'k-Anonymity ≥ 5  ·  Differential Privacy' },
      { label: 'Turnaround',  value: 'Batch: 24 h  ·  Streaming: real-time' },
    ],
  },
];

const INTEGRATORS = [
  'Hospital Information Systems (HIS)',
  'Electronic Medical Records (EMR / EHR)',
  'Preventive Health Platforms',
  'Clinical Research Organisations (CRO)',
  'Longevity & Wellness Clinics',
  'Medical Device OEM',
];

/* ─── Beta modal ─────────────────────────────────────────────────────── */
function BetaModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="API Beta Access"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal card */}
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#111318',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: 'clamp(28px,5vw,44px)',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px',
            padding: '5px 14px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'rgba(255,215,0,0.8)',
              letterSpacing: '0.08em',
            }}
          >
            PRIVATE BETA
          </span>
        </div>

        <h3
          style={{
            fontSize: 'clamp(1.125rem,2.5vw,1.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}
        >
          API Access is Currently in Private Beta
        </h3>

        <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.72, marginBottom: '8px' }}>
          We are onboarding a limited cohort of clinical institutions and research organisations.
          Access is by application only — no self-service sign-up during beta.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.28)',
            lineHeight: 1.65,
            marginBottom: '28px',
          }}
        >
          API 访问目前处于私密测试阶段，仅向申请通过的临床机构和研究组织开放，不提供自助注册。
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            padding: '16px 18px',
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.36)',
              marginBottom: '8px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            To request access, contact:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'rgba(255,215,0,0.75)',
            }}
          >
            enterprise@pivotorder.com
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.22)',
              marginTop: '4px',
            }}
          >
            Include: institution name · use case · estimated monthly call volume
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 500,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function EnterprisePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main style={{ backgroundColor: '#0A0C10', minHeight: 'calc(100vh - 68px)', color: '#FFFFFF' }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(72px,10vw,120px) 24px clamp(64px,8vw,96px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Classification badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            B2B Clinical Integration · 机构接入
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            lineHeight: 1.08,
            maxWidth: '820px',
            marginBottom: '24px',
          }}
        >
          Enterprise API &{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #F5CB00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Clinical Integration
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem,1.8vw,1.125rem)',
            color: 'rgba(255,255,255,0.46)',
            lineHeight: 1.72,
            maxWidth: '640px',
            marginBottom: '8px',
          }}
        >
          Empower your clinic or research facility with the 0.1% biological age engine.
          Neutral computing power and structured interfaces — no product routing, no commercial conflict.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.22)',
            marginBottom: '40px',
          }}
        >
          为您的诊所或研究机构接入 0.1% 生物年龄引擎 — 纯算力与接口，无商业产品导流，无利益冲突。
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#FFD700',
              color: '#0D0D0D',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              transition: 'background-color 0.2s',
            }}
          >
            Request API Documentation
          </button>
          <Link
            href="/science"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            View Scientific Foundation →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICE TIERS
      ══════════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(64px,8vw,96px) 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            marginBottom: '48px',
          }}
        >
          Integration Tiers · 接入层级
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {SERVICES.map((svc) => (
            <div
              key={svc.id}
              style={{
                backgroundColor: '#111318',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: 'clamp(24px,4vw,36px)',
                display: 'grid',
                gridTemplateColumns: 'clamp(52px,6vw,80px) 1fr',
                gap: '0 32px',
              }}
            >
              {/* Index */}
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(1.25rem,2.5vw,2rem)',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.1)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {svc.index}
                </span>
              </div>

              <div>
                {/* Tag */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,215,0,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  {svc.tag}
                </p>

                <h2
                  style={{
                    fontSize: 'clamp(1.125rem,2vw,1.375rem)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.015em',
                    marginBottom: '3px',
                  }}
                >
                  {svc.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.22)',
                    marginBottom: '16px',
                  }}
                >
                  {svc.titleZh}
                </p>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.46)',
                    lineHeight: 1.72,
                    maxWidth: '560px',
                    marginBottom: '6px',
                  }}
                >
                  {svc.body}
                </p>
                <p
                  style={{
                    fontSize: '0.775rem',
                    color: 'rgba(255,255,255,0.2)',
                    lineHeight: 1.65,
                    maxWidth: '520px',
                    marginBottom: '24px',
                  }}
                >
                  {svc.bodyZh}
                </p>

                {/* Spec rows */}
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {svc.specs.map((sp, i) => (
                    <div
                      key={sp.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '130px 1fr',
                        gap: '0 16px',
                        padding: '9px 14px',
                        borderBottom:
                          i < svc.specs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color: 'rgba(255,255,255,0.25)',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {sp.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {sp.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO INTEGRATES
      ══════════════════════════════════════════ */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0D0F14',
          padding: 'clamp(48px,6vw,72px) 24px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
              marginBottom: '28px',
            }}
          >
            Designed for · 适用机构类型
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '10px',
            }}
          >
            {INTEGRATORS.map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#FFD700',
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.46)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section
        style={{
          padding: 'clamp(64px,8vw,96px) 24px',
          textAlign: 'center',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            marginBottom: '20px',
          }}
        >
          Private Beta · 私密测试
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.375rem,2.8vw,1.875rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          Ready to integrate the engine?
        </h2>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'rgba(255,255,255,0.36)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          API access is currently invite-only. Reach out with your institution details
          and use case to begin the onboarding process.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 30px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#FFD700',
            color: '#0D0D0D',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background-color 0.2s',
          }}
        >
          Request API Documentation
        </button>
      </section>

      {/* ── Beta modal ── */}
      {modalOpen && <BetaModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}
