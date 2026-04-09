'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'error',
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount with animation
    const t1 = requestAnimationFrame(() => setVisible(true));
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, duration);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, [duration, onClose]);

  const colors = {
    error:   { bg: '#1A0808', border: '#EF4444', icon: '✕', label: '#EF4444' },
    success: { bg: '#071A0E', border: '#22C55E', icon: '✓', label: '#22C55E' },
    info:    { bg: '#07101A', border: '#60A5FA', icon: 'ℹ', label: '#60A5FA' },
  };
  const c = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '16px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 9999,
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '480px',
        width: 'calc(100vw - 48px)',
        boxShadow: `0 8px 40px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Icon */}
      <span
        style={{
          color: c.label,
          fontWeight: 700,
          fontSize: '0.875rem',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        {c.icon}
      </span>

      {/* Message */}
      <span
        style={{
          fontSize: '0.875rem',
          color: '#FFFFFF',
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {message}
      </span>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 350); }}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer',
          fontSize: '1rem',
          flexShrink: 0,
          padding: '0 0 0 4px',
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
