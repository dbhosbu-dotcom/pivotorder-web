'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const sections = isZh ? [
    {
      title: '1. 我们收集哪些信息',
      body: `当你注册 PivotOrder 账户时，我们收集以下信息：
• 基础账户信息：姓名、邮箱地址、密码（哈希存储）
• 个人生物信息：出生年份、生物性别、所在地区
• 体检报告内容：你上传的血液检验指标数值

我们不收集身份证号、银行卡信息或任何与你法律身份直接关联的数据。`,
    },
    {
      title: '2. 我们如何使用你的信息',
      body: `收集的信息仅用于以下目的：
• 为你生成个性化的十大支柱代谢分析报告
• 存储你的历史分析记录，支持趋势追踪
• 发送与账户相关的通知（如订阅到期提醒）
• 改进算法模型（仅使用去标识化、匿名化数据）

我们不会将你的个人数据用于广告推送、第三方数据销售或任何商业目的之外的模型训练。`,
    },
    {
      title: '3. 数据存储与安全',
      body: `• 所有数据存储在受保护的服务器上，采用 AES-256 加密
• 密码经过不可逆哈希处理（bcrypt），我们无法读取你的密码
• 数据传输使用 TLS 1.3 加密
• 我们定期进行安全审计，并及时修复已知漏洞

如发生数据安全事件，我们将在发现后 72 小时内通知受影响的用户。`,
    },
    {
      title: '4. 数据共享',
      body: `PivotOrder 不向第三方出售、出租或共享你的个人数据，以下情况除外：
• 你明确授权的情况（如你选择与医生共享报告）
• 法律要求（如法院命令或监管要求）
• 防止欺诈或保护系统安全所必要的情况

我们使用的第三方服务商（如云存储提供商）仅能访问履行服务所必要的最少数据，并受数据处理协议约束。`,
    },
    {
      title: '5. 你的数据权利',
      body: `你对自己的数据拥有以下权利：
• 访问权：查看我们持有的关于你的所有数据
• 更正权：更新不准确的个人信息
• 删除权：要求永久删除你的账户及所有关联数据
• 可携带性：以结构化格式导出你的分析历史

如需行使上述权利，请发送邮件至 privacy@pivotorder.com，我们将在 30 天内回复。`,
    },
    {
      title: '6. Cookie 政策',
      body: `我们使用必要的功能性 Cookie 以维持登录状态和语言偏好。我们不使用第三方追踪 Cookie 或广告 Cookie。

你可以在浏览器设置中管理 Cookie，但禁用功能性 Cookie 可能影响网站的正常使用。`,
    },
    {
      title: '7. 政策更新',
      body: `我们可能会不定期更新本隐私政策，以反映服务变化或法规要求。重大变更将通过邮件或网站公告提前通知用户。

继续使用 PivotOrder 服务即表示你接受更新后的隐私政策。`,
    },
    {
      title: '8. 联系我们',
      body: `如有任何关于隐私的问题或疑虑，请通过以下方式联系我们：
邮箱：privacy@pivotorder.com
地址：Vancouver, BC, Canada`,
    },
  ] : [
    {
      title: '1. Information We Collect',
      body: `When you register a PivotOrder account, we collect the following information:
• Basic account information: name, email address, password (hashed)
• Personal biological information: birth year, biological sex, region
• Health checkup report content: blood test values you upload

We do not collect ID numbers, bank card information, or any data directly linking to your legal identity.`,
    },
    {
      title: '2. How We Use Your Information',
      body: `Collected information is used solely for:
• Generating your personalized 10-Pillar metabolic analysis report
• Storing your analysis history for trend tracking
• Sending account-related notifications (e.g., subscription expiry reminders)
• Improving algorithm models (using only de-identified, anonymized data)

We do not use your personal data for advertising, third-party data sales, or model training beyond these purposes.`,
    },
    {
      title: '3. Data Storage & Security',
      body: `• All data is stored on protected servers with AES-256 encryption
• Passwords are irreversibly hashed (bcrypt)—we cannot read your password
• Data transmission uses TLS 1.3 encryption
• We conduct regular security audits and promptly address known vulnerabilities

In the event of a data security incident, we will notify affected users within 72 hours of discovery.`,
    },
    {
      title: '4. Data Sharing',
      body: `PivotOrder does not sell, rent, or share your personal data with third parties, except:
• With your explicit authorization (e.g., if you choose to share a report with your doctor)
• As required by law (e.g., court order or regulatory requirement)
• As necessary to prevent fraud or protect system security

Third-party service providers we use (e.g., cloud storage) access only the minimum data necessary and are bound by data processing agreements.`,
    },
    {
      title: '5. Your Data Rights',
      body: `You have the following rights regarding your data:
• Access: View all data we hold about you
• Correction: Update inaccurate personal information
• Deletion: Request permanent deletion of your account and all associated data
• Portability: Export your analysis history in a structured format

To exercise these rights, email privacy@pivotorder.com. We will respond within 30 days.`,
    },
    {
      title: '6. Cookie Policy',
      body: `We use necessary functional cookies to maintain login state and language preferences. We do not use third-party tracking or advertising cookies.

You can manage cookies in your browser settings, but disabling functional cookies may affect normal website usage.`,
    },
    {
      title: '7. Policy Updates',
      body: `We may update this Privacy Policy periodically to reflect service changes or regulatory requirements. Significant changes will be communicated to users via email or website announcement in advance.

Continued use of PivotOrder services constitutes acceptance of the updated Privacy Policy.`,
    },
    {
      title: '8. Contact Us',
      body: `For any privacy questions or concerns, please contact us:
Email: privacy@pivotorder.com
Address: Vancouver, BC, Canada`,
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
              {isZh ? '隐私政策' : 'Privacy Policy'}
            </h1>

            <p style={{
              fontSize: '1rem', color: 'var(--color-text-secondary)',
              lineHeight: 1.8, marginBottom: '56px',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '32px',
            }}>
              {isZh
                ? 'PivotOrder（"我们"）非常重视用户隐私。本政策说明我们如何收集、使用和保护你使用 PivotOrder 服务时提供的个人信息。'
                : 'PivotOrder ("we") takes user privacy seriously. This policy explains how we collect, use, and protect personal information you provide when using PivotOrder services.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
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
              <Link href="/terms" style={{ color: 'var(--color-accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
                {isZh ? '服务条款 →' : 'Terms of Use →'}
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
