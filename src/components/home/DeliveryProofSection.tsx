'use client';

import { useEffect, useRef, useState } from 'react';
import { useT, useLanguage } from '@/context/LanguageContext';

function useCountDown(from: number, to: number, duration: number, started: boolean) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const diff = from - to;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((from - diff * eased).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, from, to, duration]);

  return value;
}

const TOOLTIP_DETAILS_ZH = [
  '• 导入体检材料',
  '• 结构化健康管理草稿',
  '• 工作室 Logo 与署名',
  '• 你确认后才发送',
];
const TOOLTIP_DETAILS_EN = [
  '• Import checkup materials',
  '• Structured health-management draft',
  '• Studio logo and signature',
  '• Send only after you confirm',
];

export default function DeliveryProofSection() {
  const t = useT();
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const tooltipDetails = isZh ? TOOLTIP_DETAILS_ZH : TOOLTIP_DETAILS_EN;
  const [animStarted, setAnimStarted] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFadeIn(true);
          setAnimStarted(true);
        }
      },
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const phenotypicAge = useCountDown(47, 38.2, 2200, animStarted);
  const showDecimal = phenotypicAge < 47;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '72px 24px 88px',
        backgroundColor: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-site" style={{ maxWidth: '900px' }}>
        <p
          className="text-caption"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          {isZh ? '交付示意' : 'Delivery proof'}
        </p>
        <h2
          className="text-h3"
          style={{
            color: 'var(--color-text-heading)',
            marginBottom: '10px',
          }}
        >
          {isZh
            ? '白标草稿可以把体检材料整理成可编辑报告'
            : 'White-label drafts turn checkup materials into an editable report'}
        </h2>
        <p
          className="text-body-m"
          style={{
            maxWidth: '560px',
            marginBottom: '40px',
            lineHeight: 1.75,
          }}
        >
          {isZh
            ? '以下为工作台交付能力示意，不是疗效承诺。报告仅供健康管理参考，发送前须你确认。'
            : 'This is a delivery-capability illustration, not an efficacy claim. Reports are health-management references and send only after you confirm.'}
        </p>

        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '6px',
                color: 'var(--color-text-muted)',
              }}
            >
              {t.hero.chrono_label}
            </p>
            <span
              className="text-display-xl"
              style={{
                color: 'var(--color-text-muted)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              47
            </span>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--color-border-subtle)',
              marginBottom: '20px',
              maxWidth: '320px',
            }}
          />

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <p
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '6px',
                color: 'var(--color-text-muted)',
              }}
            >
              {t.hero.bio_label}
            </p>
            <span
              className="text-display-xl"
              style={{
                color: 'var(--color-accent)',
                display: 'block',
                lineHeight: 1,
                cursor: 'default',
                userSelect: 'none',
              }}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              {showDecimal ? phenotypicAge.toFixed(1) : '47.0'}
            </span>

            {tooltipVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                }}
              >
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-heading)', fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
                  {isZh ? '白标交付步骤：' : 'White-label delivery:'}
                </p>
                {tooltipDetails.map((line) => (
                  <p key={line} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 400, lineHeight: 1.7, margin: 0 }}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
