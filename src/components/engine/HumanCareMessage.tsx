'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const CARE_POOL = [
  {
    tag_zh: '身心共振',
    tag_en: 'Mind-Body Resonance',
    zh: '这份报告不是要给你增加新的压力，而是要帮你找回那种「轻盈感」。我们不谈疾病，只谈如何帮你把那颗乱了跳动的心，重新调回舒适的频率。',
    en: "This report isn't here to add pressure — it's here to help you rediscover that sense of ease. We're not talking about disease. We're talking about recalibrating your rhythm back to where it feels right.",
  },
  {
    tag_zh: '理性之光',
    tag_en: 'Light of Reason',
    zh: '你的身体并非「坏了」，而是在某种负荷下开启了「低效模式」。PivotOrder 作为独立第三方，愿做你找回身体主动权的那盏指路灯。',
    en: "Your body isn't broken — it's running in low-efficiency mode under accumulated load. PivotOrder, as an independent third party, aims to be the guiding light that helps you reclaim agency over your own biology.",
  },
  {
    tag_zh: '温和重塑',
    tag_en: 'Gentle Remodelling',
    zh: '真正的抗衰是与细胞的深度和解。别急，美好的改变往往发生在最微小的平衡点上，我们陪你一点点抚平内分泌的涟漪。',
    en: "True longevity is a deep reconciliation with your cells. Don't rush — the most beautiful changes often happen at the smallest tipping points. We'll walk with you, gently smoothing out the ripples in your endocrine landscape.",
  },
  {
    tag_zh: '数据背后',
    tag_en: 'Behind the Numbers',
    zh: '每一个指标背后，都有一个努力生活的人。数字是工具，不是评判。我们在这里，是为了让这些数字为你服务，而不是让你为数字焦虑。',
    en: "Behind every biomarker is a person doing their best. Numbers are tools, not verdicts. We're here to make the data work for you — not to make you anxious about the data.",
  },
  {
    tag_zh: '细胞的语言',
    tag_en: 'Language of Cells',
    zh: '你的细胞一直在说话，只是我们不常听懂。今天，算法帮你翻译了这份沉默的独白。接下来，是你与身体对话的时刻。',
    en: "Your cells have always been speaking. We rarely know how to listen. Today, the algorithm has translated that silent monologue. What comes next is your conversation with your own biology.",
  },
];

interface Props {
  seed?: number;
}

export default function HumanCareMessage({ seed }: Props) {
  const { lang } = useLanguage();

  const message = useMemo(() => {
    const idx = seed !== undefined
      ? Math.abs(seed) % CARE_POOL.length
      : Math.floor(Math.random() * CARE_POOL.length);
    return CARE_POOL[idx];
  }, [seed]);

  const tag  = lang === 'zh' ? message.tag_zh : message.tag_en;
  const text = lang === 'zh' ? message.zh      : message.en;

  return (
    <div
      style={{
        backgroundColor: '#FFF8CC',
        borderRadius: '12px',
        padding: '24px 28px',
        marginTop: '32px',
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: '3px',
          alignSelf: 'stretch',
          backgroundColor: '#FFD700',
          borderRadius: '2px',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1 }}>
        {/* Tag */}
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D4A500',
            marginBottom: '10px',
          }}
        >
          {tag}
        </p>

        {/* Message text */}
        <p
          style={{
            fontSize: '0.9375rem',
            color: '#4A4A4A',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {text}
        </p>

        {/* PivotOrder signature */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#B0B4BC',
            marginTop: '12px',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.04em',
          }}
        >
          — PivotOrder · Decoding the Data, Restoring the Order.
        </p>
      </div>
    </div>
  );
}
