'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { workbenchRegisterUrl } from '@/lib/site';

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#FFFFFF',
            marginBottom: '12px',
            maxWidth: '720px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
          }}
        >
          先发出第一条 H5，再谈第一条付费咨询
        </h2>

        <p
          style={{
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            maxWidth: '540px',
            marginBottom: '36px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.2s',
          }}
        >
          链接先发到自己微信。有人留资再报价，成交后再出报告。
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s',
          }}
        >
          <a
            href={workbenchRegisterUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-dark)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            免费搭建工作室
          </a>

          <Link href="/guides" className="btn-secondary-dark">
            看营养师指南
          </Link>
        </div>
      </div>
    </section>
  );
}
