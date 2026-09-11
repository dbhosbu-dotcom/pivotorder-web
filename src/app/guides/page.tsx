import Link from 'next/link';
import ComplianceNotice from '@/components/compliance/ComplianceNotice';
import JsonLd from '@/components/seo/JsonLd';
import { GUIDES } from '@/content/guides';
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from '@/lib/seo';
import { workbenchRegisterUrl } from '@/lib/site';

const TITLE = '营养师指南：获客、收费与白标报告｜枢序健康';
const DESCRIPTION =
  '给考证营养师的获客留资、咨询收费与白标报告指南。H5 沉淀线索，工作台出草稿，你确认后才发送。健康管理参考，不构成医学诊断。';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/guides',
});

export default function GuidesIndexPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <JsonLd
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: '/guides',
            type: 'CollectionPage',
          }),
          breadcrumbJsonLd([
            { name: '首页', path: '/' },
            { name: '营养师指南', path: '/guides' },
          ]),
        ]}
      />

      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, #EEF1F4 100%)',
          padding: '64px 0 48px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site">
          <p
            style={{
              fontSize: '0.8125rem',
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted)',
              marginBottom: '12px',
            }}
          >
            营养师指南
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            获客、收费、交付，先写清楚再开工作室
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              lineHeight: 1.75,
            }}
          >
            三条短指南，对应同一条工作台：H5 留资、咨询报价、白标报告跟进。你确认后才发给客户。
          </p>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '56px', paddingBottom: '96px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
          }}
        >
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '28px 24px',
                backgroundColor: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  marginBottom: '10px',
                  lineHeight: 1.35,
                }}
              >
                {guide.cardTitle}
              </h2>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: '20px',
                }}
              >
                {guide.cardSummary}
              </p>
              <Link
                href={`/guides/${guide.slug}`}
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  textDecoration: 'none',
                }}
              >
                阅读指南 →
              </Link>
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: '48px',
            padding: '28px 24px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          <p
            style={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              marginBottom: '8px',
            }}
          >
            免费开通营养师工作室
          </p>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '18px',
              maxWidth: '560px',
            }}
          >
            配置品牌、发布 H5 测评、沉淀线索后由你确认跟进。报告仅供健康管理参考。
          </p>
          <a href={workbenchRegisterUrl} className="btn-primary">
            免费搭建工作室 <span>→</span>
          </a>
          <ComplianceNotice compact />
        </div>
      </div>
    </div>
  );
}
