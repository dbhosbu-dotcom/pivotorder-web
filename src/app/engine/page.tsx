import EngineForm from '@/components/engine/EngineForm';

export const metadata = {
  title: 'The Engine — PivotOrder',
  description:
    'Run a full multi-omic biological age analysis or explore with mock data. PHI scrubbing active.',
};

export default function EnginePage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        backgroundColor: '#0A0C10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0D0F14',
          padding: '48px 24px 40px',
          textAlign: 'center',
        }}
      >
        {/* System status pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(34,197,94,0.7)',
            }}
          />
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            SYSTEM ONLINE &nbsp;·&nbsp; Engine v2.4.1 &nbsp;·&nbsp; PHI Scrubbing: ACTIVE
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}
        >
          The PivotOrder Engine
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.4)',
            maxWidth: '480px',
            margin: '0 auto 8px',
            lineHeight: 1.65,
          }}
        >
          Multi-omic biological age analysis. Your data. Scrubbed. Analyzed. Transformed.
        </p>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'rgba(255,255,255,0.2)',
            maxWidth: '480px',
            margin: '0 auto',
          }}
        >
          你的数据。脱敏。分析。重构。
        </p>
      </div>

      {/* ── Form / Result area ── */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
        }}
      >
        <EngineForm />
      </div>
    </div>
  );
}
