import Link from 'next/link';
import { notFound } from 'next/navigation';
import ComplianceNotice from '@/components/compliance/ComplianceNotice';
import JsonLd from '@/components/seo/JsonLd';
import { GUIDES, getGuideBySlug, listGuideSlugs } from '@/content/guides';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  webPageJsonLd,
} from '@/lib/seo';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listGuideSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuideSlugPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const path = `/guides/${guide.slug}`;
  const related = GUIDES.filter((item) => item.slug !== guide.slug);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <JsonLd
        data={[
          webPageJsonLd({
            name: guide.h1,
            description: guide.description,
            path,
          }),
          articleJsonLd({
            headline: guide.h1,
            description: guide.description,
            path,
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
          }),
          breadcrumbJsonLd([
            { name: '首页', path: '/' },
            { name: '营养师指南', path: '/guides' },
            { name: guide.cardTitle, path },
          ]),
          faqJsonLd(guide.faqs),
        ]}
      />

      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, #EEF1F4 100%)',
          padding: '56px 0 40px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site" style={{ maxWidth: '800px' }}>
          <nav aria-label="面包屑" style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
            <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              首页
            </Link>
            <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
            <Link href="/guides" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              营养师指南
            </Link>
          </nav>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.375rem)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            {guide.h1}
          </h1>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
        <article style={{ maxWidth: '720px' }}>
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '14px',
                }}
              >
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.85,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '12px',
                  }}
                >
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ol
                  style={{
                    margin: '12px 0 0',
                    paddingLeft: '22px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.85,
                  }}
                >
                  {section.list.map((item) => (
                    <li key={item} style={{ marginBottom: '8px' }}>
                      {item}
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          ))}

          <section
            style={{
              marginTop: '8px',
              padding: '28px 24px',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                marginBottom: '8px',
              }}
            >
              {guide.ctaLabel}
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                marginBottom: '18px',
              }}
            >
              {guide.ctaBody}
            </p>
            <a href={guide.ctaHref} className="btn-primary">
              {guide.ctaLabel} <span>→</span>
            </a>
            <ComplianceNotice compact />
          </section>

          <section style={{ marginTop: '48px' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                marginBottom: '16px',
              }}
            >
              常见问题
            </h2>
            <dl>
              {guide.faqs.map((faq) => (
                <div key={faq.question} style={{ marginBottom: '20px' }}>
                  <dt
                    style={{
                      fontWeight: 600,
                      color: 'var(--color-text-heading)',
                      marginBottom: '6px',
                    }}
                  >
                    {faq.question}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.75,
                    }}
                  >
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section style={{ marginTop: '40px' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                marginBottom: '14px',
              }}
            >
              相关指南
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.9 }}>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/guides/${item.slug}`} style={{ color: 'var(--color-text-heading)' }}>
                    {item.cardTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/solutions" style={{ color: 'var(--color-text-heading)' }}>
                  获客 / 收费 / 交付解决方案
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
