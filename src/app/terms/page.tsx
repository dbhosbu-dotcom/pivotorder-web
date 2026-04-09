'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const sections = isZh ? [
    {
      title: '1. 服务说明',
      body: `PivotOrder 是一个代谢健康数据分析平台，提供以下服务：
• 体检报告解读与十大支柱代谢审计
• 生物年龄评估与健康趋势追踪
• 个性化干预方案建议
• API 接口（企业版）

我们的分析结果基于已发表的科学研究，仅作为健康参考信息，不构成医疗诊断、治疗方案或医学建议。`,
    },
    {
      title: '2. 账户注册与责任',
      body: `• 你必须年满 18 岁方可注册使用本服务
• 你对账户安全和所有账户活动负责
• 你提供的信息必须真实、准确
• 发现账户被未授权使用，请立即通知我们

每个用户只能注册一个账户。禁止以任何形式分享账户或使用自动化方式访问服务。`,
    },
    {
      title: '3. 免费与付费服务',
      body: `免费版：
• 每个账户可进行 3 次完整体检报告分析，永久有效
• 超过 3 次后需升级至专业版

专业版（¥99/月）：
• 提供无限次分析
• 按月收费，可随时取消，取消后当月服务继续有效直至周期结束
• 我们不提供退款，除非服务存在实质性错误或技术故障

企业版：
• 定制定价，合同另议`,
    },
    {
      title: '4. 医疗免责声明',
      body: `重要提示：

PivotOrder 的分析结果不是医疗诊断，不能替代专业医生的诊断意见。

• 我们的算法不具备医疗器械资质
• 分析结果不应作为任何药物使用、停用或调整的依据
• 如有任何健康问题或症状，请务必咨询持牌医疗专业人员
• 我们对依据我们分析结果做出的医疗决策不承担任何法律责任`,
    },
    {
      title: '5. 知识产权',
      body: `• PivotOrder 平台的所有代码、算法、设计、内容均属于 PivotOrder 所有
• 你上传的体检报告数据归你所有
• 我们生成的分析报告可供你个人使用，不可未经授权进行商业复制或再发布
• 禁止对平台进行逆向工程、抓取数据或干扰系统正常运行`,
    },
    {
      title: '6. 服务限制与中断',
      body: `• 我们不保证服务 100% 无中断运行
• 我们可能因维护、升级或不可抗力暂时中断服务，会尽量提前通知
• 我们保留在不事先通知的情况下修改或终止任何功能的权利
• 免费版服务可能在提前 30 天通知后进行调整`,
    },
    {
      title: '7. 责任限制',
      body: `在法律允许的最大范围内，PivotOrder 对以下情况不承担责任：
• 因使用或无法使用本服务造成的任何间接损失
• 依据分析结果做出的健康或医疗决策的后果
• 因第三方行为、网络问题或不可抗力导致的数据丢失

我们的总体赔偿责任不超过你在过去 12 个月内向 PivotOrder 支付的费用。`,
    },
    {
      title: '8. 适用法律',
      body: `本服务条款受加拿大不列颠哥伦比亚省法律管辖。任何争议应首先通过协商解决，协商不成则提交温哥华有管辖权的法院处理。`,
    },
    {
      title: '9. 条款更新',
      body: `我们可能会不定期更新本服务条款。重大变更将提前 30 天通过邮件通知注册用户。继续使用服务即表示接受更新后的条款。

如不接受变更，你可以在变更生效前终止账户。`,
    },
    {
      title: '10. 联系我们',
      body: `如有任何关于服务条款的问题，请联系：
邮箱：legal@pivotorder.com`,
    },
  ] : [
    {
      title: '1. Service Description',
      body: `PivotOrder is a metabolic health data analysis platform providing:
• Health checkup report interpretation and 10-Pillar metabolic audit
• Biological age assessment and health trend tracking
• Personalized intervention plan recommendations
• API access (Enterprise)

Our analysis results are based on published scientific research and serve as health reference information only. They do not constitute medical diagnosis, treatment plans, or medical advice.`,
    },
    {
      title: '2. Account Registration & Responsibility',
      body: `• You must be at least 18 years old to register
• You are responsible for account security and all account activity
• Information you provide must be truthful and accurate
• Notify us immediately if you discover unauthorized account use

Each user may only register one account. Sharing accounts or using automated methods to access the service is prohibited.`,
    },
    {
      title: '3. Free & Paid Services',
      body: `Free Plan:
• Each account can perform 3 complete report analyses, permanently
• Upgrade to Pro required after 3 analyses

Pro Plan (¥99/month):
• Unlimited analyses
• Billed monthly, cancel anytime. Service continues until period end after cancellation
• We do not provide refunds unless there is a material error or technical failure

Enterprise Plan:
• Custom pricing, contract separately negotiated`,
    },
    {
      title: '4. Medical Disclaimer',
      body: `Important Notice:

PivotOrder analysis results are not medical diagnoses and cannot replace the diagnostic opinion of a qualified physician.

• Our algorithm does not hold medical device certification
• Analysis results should not be used as the basis for starting, stopping, or adjusting any medication
• For any health concerns or symptoms, consult a licensed healthcare professional
• We accept no legal liability for medical decisions made based on our analysis results`,
    },
    {
      title: '5. Intellectual Property',
      body: `• All code, algorithms, designs, and content on the PivotOrder platform are owned by PivotOrder
• Health checkup data you upload belongs to you
• Analysis reports we generate are for your personal use; unauthorized commercial reproduction or redistribution is prohibited
• Reverse engineering the platform, scraping data, or interfering with system operations is prohibited`,
    },
    {
      title: '6. Service Limitations & Interruptions',
      body: `• We do not guarantee 100% uninterrupted service
• We may temporarily suspend service for maintenance, upgrades, or force majeure events; we will provide advance notice when possible
• We reserve the right to modify or discontinue any feature without prior notice
• Free plan services may be adjusted with 30 days advance notice`,
    },
    {
      title: '7. Limitation of Liability',
      body: `To the maximum extent permitted by law, PivotOrder is not liable for:
• Any indirect damages arising from use or inability to use the service
• Consequences of health or medical decisions made based on analysis results
• Data loss caused by third-party actions, network issues, or force majeure

Our total liability shall not exceed the fees you paid to PivotOrder in the preceding 12 months.`,
    },
    {
      title: '8. Governing Law',
      body: `These Terms of Service are governed by the laws of British Columbia, Canada. Any disputes shall first be resolved through negotiation; if unresolved, they shall be submitted to a court of competent jurisdiction in Vancouver.`,
    },
    {
      title: '9. Terms Updates',
      body: `We may update these Terms of Service periodically. Significant changes will be communicated to registered users by email 30 days in advance. Continued use of the service constitutes acceptance of the updated terms.

If you do not accept the changes, you may terminate your account before they take effect.`,
    },
    {
      title: '10. Contact Us',
      body: `For any questions about these Terms of Service, please contact:
Email: legal@pivotorder.com`,
    },
  ];

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ paddingTop: '120px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span style={{
              display: 'inline-block', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              marginBottom: '16px',
            }}>
              {isZh ? '最后更新：2025年1月' : 'Last updated: January 2025'}
            </span>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
              color: 'var(--color-text-heading)', lineHeight: 1.15,
              marginBottom: '16px',
            }}>
              {isZh ? '服务条款' : 'Terms of Use'}
            </h1>

            <p style={{
              fontSize: '1rem', color: 'var(--color-text-secondary)',
              lineHeight: 1.8, marginBottom: '56px',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '32px',
            }}>
              {isZh
                ? '请在使用 PivotOrder 服务前仔细阅读本服务条款。注册或使用本服务即表示你同意遵守这些条款。'
                : 'Please read these Terms of Use carefully before using PivotOrder services. By registering or using the service, you agree to comply with these terms.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <h2 style={{
                    fontSize: '1.1rem', fontWeight: 700,
                    color: 'var(--color-text-heading)', marginBottom: '12px',
                  }}>
                    {s.title}
                  </h2>
                  <div style={{
                    fontSize: '0.925rem', color: 'var(--color-text-secondary)',
                    lineHeight: 1.9, whiteSpace: 'pre-line',
                  }}>
                    {s.body}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{
              marginTop: '60px', paddingTop: '32px',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex', gap: '24px', flexWrap: 'wrap',
            }}>
              <Link href="/privacy" style={{ color: 'var(--color-accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
                {isZh ? '隐私政策 →' : 'Privacy Policy →'}
              </Link>
              <Link href="/about" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
                {isZh ? '关于我们 →' : 'About Us →'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
