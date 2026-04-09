'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [isZh, setIsZh] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pivotorder-lang');
      setIsZh(stored !== 'en');
    } catch {
      setIsZh(true);
    }
    // Log error for monitoring
    console.error('[PivotOrder Error]', error);
  }, [error]);

  return (
    <main style={{
      backgroundColor: 'var(--color-bg-dark)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', maxWidth: '560px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Error icon */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            backgroundColor: 'rgba(239,68,68,0.12)',
            border: '1.5px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            fontSize: '1.8rem',
          }}>
            ⚠
          </div>

          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(239,68,68,0.7)',
            marginBottom: '20px',
          }}>
            {isZh ? '发生了一个错误' : 'SOMETHING WENT WRONG'}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800,
            color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.3,
          }}>
            {isZh ? '引擎遇到了意外情况' : 'The engine encountered an unexpected issue'}
          </h1>

          <p style={{
            fontSize: '1rem', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7, marginBottom: '16px',
          }}>
            {isZh
              ? '抱歉，加载页面时出现了错误。你可以尝试刷新，或者返回首页。'
              : 'Sorry, an error occurred while loading the page. You can try refreshing, or return to the homepage.'}
          </p>

          {error.digest && (
            <p style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)',
              marginBottom: '40px', fontFamily: 'monospace',
            }}>
              {isZh ? '错误标识：' : 'Error ID: '}{error.digest}
            </p>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
            <button
              onClick={reset}
              style={{
                padding: '14px 32px', borderRadius: '10px',
                backgroundColor: 'var(--color-accent)', color: '#000',
                fontWeight: 700, fontSize: '0.95rem',
                border: 'none', cursor: 'pointer',
              }}
            >
              {isZh ? '重新加载' : 'Try Again'}
            </button>
            <Link
              href="/"
              style={{
                padding: '14px 32px', borderRadius: '10px',
                border: '1.5px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
                fontWeight: 600, fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              {isZh ? '返回首页' : 'Back to Home'}
            </Link>
          </div>

          <p style={{
            marginTop: '56px', fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
          }}>
            PIVOTORDER · 10-PILLAR METABOLIC PROTOCOL
          </p>
        </motion.div>
      </div>
    </main>
  );
}
