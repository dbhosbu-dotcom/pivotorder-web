'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const STORY = isZh ? [
    {
      year: '2019',
      title: '起源：代谢组学数据的混乱',
      body: '在温哥华的一个研究项目中，团队成员在整理多批次临床生化数据时发现：标准参考范围将大量"亚健康"数据错误地归类为"正常"。这促使我们思考——标准检验报告真的够用吗？',
    },
    {
      year: '2021',
      title: '算法框架建立',
      body: '经过两年的文献研究与数据建模，PivotOrder 十大支柱协议（10-Pillar Protocol）的核心框架成形。通过整合代谢、内分泌、免疫、氧化应激等系统的因果关联，构建了第一个多维代谢审计引擎。',
    },
    {
      year: '2023',
      title: '独立第三方验证',
      body: '算法在小型临床队列上进行回顾性验证，与同期随访结果对比，生物年龄预测误差达到临床可接受标准。同年正式决定以独立 SaaS 形式向公众开放，不与任何药品或保健品公司绑定。',
    },
    {
      year: '2025',
      title: '公开访问启动',
      body: 'PivotOrder 开放公众注册，任何人均可上传标准体检报告获取十大支柱分析。核心承诺不变：独立、透明、以科学为先导。',
    },
  ] : [
    {
      year: '2019',
      title: 'Origin: The Chaos in Metabolic Data',
      body: 'During a research project in Vancouver, team members noticed that standard reference ranges were incorrectly classifying large amounts of "sub-optimal" data as "normal." This prompted the question—are standard lab reports really enough?',
    },
    {
      year: '2021',
      title: 'Algorithm Framework Established',
      body: 'After two years of literature research and data modeling, the core framework of the PivotOrder 10-Pillar Protocol took shape. By integrating causal links across metabolic, endocrine, immune, and oxidative stress systems, the first multi-dimensional metabolic audit engine was built.',
    },
    {
      year: '2023',
      title: 'Independent Third-Party Validation',
      body: 'The algorithm was retrospectively validated on small clinical cohorts, compared against follow-up outcomes, achieving clinically acceptable biological age prediction accuracy. That year, the team decided to launch as an independent SaaS—with no ties to any pharmaceutical or supplement companies.',
    },
    {
      year: '2025',
      title: 'Public Access Launched',
      body: 'PivotOrder opens to public registration. Anyone can upload a standard health checkup report and receive a full 10-Pillar analysis. The core commitment remains: independent, transparent, science-first.',
    },
  ];

  const VALUES = isZh ? [
    {
      icon: '⚖️',
      title: '独立性',
      body: 'PivotOrder 与任何制药公司、保健品品牌、医疗机构均无商业利益关系。我们的结论只来自数据，不来自赞助方。',
    },
    {
      icon: '🔬',
      title: '科学优先',
      body: '每一个算法逻辑均有文献溯源。我们不生产健康焦虑，而是将发表研究转化为可操作的、个人层级的代谢洞察。',
    },
    {
      icon: '🛡️',
      title: '数据隐私',
      body: '你的体检数据仅用于生成你的分析报告。数据不用于销售、不参与商业模型训练、不与第三方共享。',
    },
    {
      icon: '📖',
      title: '透明度',
      body: '我们的算法框架、支柱定义和阈值参数均在科学文档中公开说明，欢迎同行评审和学术合作。',
    },
  ] : [
    {
      icon: '⚖️',
      title: 'Independence',
      body: 'PivotOrder has no commercial relationships with pharmaceutical companies, supplement brands, or healthcare institutions. Our conclusions come from data alone.',
    },
    {
      icon: '🔬',
      title: 'Science-First',
      body: 'Every algorithmic logic is traceable to published research. We do not manufacture health anxiety—we translate published science into actionable, individual-level metabolic insights.',
    },
    {
      icon: '🛡️',
      title: 'Data Privacy',
      body: 'Your health data is used solely to generate your analysis report. It is never sold, used for commercial model training, or shared with third parties.',
    },
    {
      icon: '📖',
      title: 'Transparency',
      body: 'Our algorithm framework, pillar definitions, and threshold parameters are publicly documented. We welcome peer review and academic collaboration.',
    },
  ];

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        paddingTop: '120px', paddingBottom: '80px',
        backgroundColor: 'var(--color-bg-dark)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-ultra)',
              border: '1px solid rgba(255,215,0,0.3)', borderRadius: '40px',
              padding: '5px 14px', marginBottom: '28px',
            }}>
              {isZh ? '关于 PIVOTORDER' : 'ABOUT PIVOTORDER'}
            </span>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900,
              color: '#FFFFFF', lineHeight: 1.15, marginBottom: '24px',
            }}>
              {isZh
                ? <>独立算法，<br />将标准体检升维为代谢审计</>
                : <>Independent Algorithm,<br />Elevating Standard Checkups into Metabolic Audits</>}
            </h1>

            <p style={{
              fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, maxWidth: '580px', margin: '0 auto',
            }}>
              {isZh
                ? 'PivotOrder 是一个专注于多维代谢分析的独立研究型算法平台，起源于温哥华的临床数据研究项目，致力于将发表文献转化为个人层级的可执行健康洞察。'
                : 'PivotOrder is an independent research-grade metabolic analysis platform, originating from a clinical data research project in Vancouver, dedicated to translating published science into actionable, individual-level health insights.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '56px', textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800,
            color: 'var(--color-text-heading)', marginBottom: '12px',
          }}>
            {isZh ? '我们的故事' : 'Our Story'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
            {isZh ? '从一个数据问题出发，到一个独立算法平台' : 'From a data problem to an independent algorithm platform'}
          </p>
        </motion.div>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: '80px', top: '24px', bottom: '24px',
            width: '1px', backgroundColor: 'var(--color-border)',
          }} />

          {STORY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                display: 'flex', gap: '32px', marginBottom: '48px',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                minWidth: '64px', textAlign: 'right',
                paddingTop: '4px',
              }}>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent)',
                  letterSpacing: '0.05em',
                }}>
                  {item.year}
                </span>
              </div>

              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                border: '3px solid var(--color-bg)',
                boxShadow: '0 0 0 2px var(--color-accent)',
                flexShrink: 0, marginTop: '3px',
              }} />

              <div style={{ flex: 1, paddingBottom: '8px' }}>
                <h3 style={{
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--color-text-heading)', marginBottom: '8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem', color: 'var(--color-text-secondary)',
                  lineHeight: 1.7, margin: 0,
                }}>
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{
        backgroundColor: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800,
              color: 'var(--color-text-heading)', marginBottom: '12px',
            }}>
              {isZh ? '我们的核心承诺' : 'Our Core Commitments'}
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: '32px 24px', borderRadius: '16px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--color-text-heading)', marginBottom: '10px',
                }}>
                  {v.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem', color: 'var(--color-text-secondary)',
                  lineHeight: 1.7, margin: 0,
                }}>
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech & Independence statement */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '48px 40px', borderRadius: '20px',
            backgroundColor: 'var(--color-bg-dark)',
            border: '1px solid rgba(255,215,0,0.15)',
          }}
        >
          <span style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--color-accent)', marginBottom: '20px',
          }}>
            {isZh ? '独立性声明' : 'INDEPENDENCE STATEMENT'}
          </span>
          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.9, marginBottom: '20px',
          }}>
            {isZh
              ? 'PivotOrder 作为独立第三方算法平台，与任何临床机构、保健品公司、医疗器械厂商均无商业关联。我们的算法输出不构成医疗诊断，亦不应作为医学治疗的唯一依据。'
              : 'PivotOrder operates as an independent third-party algorithmic platform with no commercial ties to any clinical institution, supplement company, or medical device manufacturer. Our algorithm outputs do not constitute medical diagnoses and should not serve as the sole basis for medical treatment.'}
          </p>
          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.9, margin: 0,
          }}>
            {isZh
              ? '我们的定位是：将人群级别的发表研究，精准映射到个人的生化数据上，帮助用户和他们的医生做出更知情的健康决策。'
              : 'Our positioning: to precisely map population-level published research onto individual biochemical data, helping users and their physicians make more informed health decisions.'}
          </p>
        </motion.div>
      </section>

      {/* Contact / CTA */}
      <section style={{
        textAlign: 'center', padding: '64px 24px 100px',
        borderTop: '1px solid var(--color-border-subtle)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontSize: '1.8rem', fontWeight: 800,
            color: 'var(--color-text-heading)', marginBottom: '12px',
          }}>
            {isZh ? '联系我们' : 'Get in Touch'}
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: '1rem',
            marginBottom: '32px', lineHeight: 1.7,
          }}>
            {isZh
              ? '学术合作、临床数据接入、媒体咨询，欢迎通过以下方式联系我们。'
              : 'For academic collaboration, clinical data integration, or media inquiries, reach us at:'}
          </p>
          <a
            href="mailto:contact@pivotorder.com"
            style={{
              display: 'inline-block',
              padding: '14px 36px', borderRadius: '10px',
              backgroundColor: 'var(--color-accent)', color: '#000',
              fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', marginBottom: '16px',
            }}
          >
            contact@pivotorder.com
          </a>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
            <Link href="/science" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              {isZh ? '科学依据 →' : 'Science →'}
            </Link>
            <Link href="/enterprise" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              {isZh ? '机构接入 →' : 'Enterprise →'}
            </Link>
            <Link href="/pricing" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              {isZh ? '查看定价 →' : 'View Pricing →'}
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
