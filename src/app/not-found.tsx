'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [isZh, setIsZh] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pivotorder-lang');
      setIsZh(stored !== 'en');
    } catch {
      setIsZh(true);
    }
  }, []);

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
        background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', maxWidth: '560px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* 404 display */}
          <div style={{
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0.1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
          }}>
            404
          </div>

          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,215,0,0.6)',
            marginBottom: '32px',
          }}>
            {isZh ? '页面未找到' : 'PAGE NOT FOUND'}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800,
            color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.3,
          }}>
            {isZh ? '这条代谢路径不存在' : 'This metabolic pathway does not exist'}
          </h1>

          <p style={{
            fontSize: '1rem', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7, marginBottom: '48px',
          }}>
            {isZh
              ? '你访问的页面可能已被移除、改名，或者从未存在过。请返回首页重新开始。'
              : 'The page you\'re looking for may have been removed, renamed, or never existed. Return to the homepage to start over.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                padding: '14px 32px', borderRadius: '10px',
                backgroundColor: 'var(--color-accent)', color: '#000',
                fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}
            >
              {isZh ? '← 返回首页' : '← Back to Home'}
            </Link>
            <Link
              href="/engine"
              style={{
                padding: '14px 32px', borderRadius: '10px',
                border: '1.5px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
                fontWeight: 600, fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              {isZh ? '上传体检报告' : 'Upload Report'}
            </Link>
          </div>

          {/* Decorative pillar count */}
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
