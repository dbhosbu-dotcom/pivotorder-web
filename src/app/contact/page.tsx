'use client';

import { useState, type FormEvent } from 'react';

const CHANNELS = [
  {
    title: '在线客服',
    description: '工作日 9:00-18:00',
    value: '问问枢序 AI',
    href: 'mailto:support@pivotorder.cn',
    action: '发送邮件',
  },
  {
    title: '客服邮箱',
    description: '24小时内回复',
    value: 'support@pivotorder.cn',
    href: 'mailto:support@pivotorder.cn',
    action: '发送邮件',
  },
  {
    title: '邮件咨询',
    description: '24小时内回复',
    value: 'support@pivotorder.cn',
    href: 'mailto:support@pivotorder.cn',
    action: '邮件联系',
  },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const topic = subject || '咨询';
    const body = [`姓名：${name}`, `邮箱：${email}`, '', message].join('\n');
    window.location.href = `mailto:support@pivotorder.cn?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, #EEF1F4 100%)',
          padding: '64px 0 48px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-site">
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              marginBottom: '16px',
            }}
          >
            联系客服
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
            我们提供多种联系方式，随时为您解答疑问
          </p>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '64px', paddingBottom: '48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {CHANNELS.map((item) => (
            <div
              key={item.title}
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '8px',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {item.description}
              </p>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '24px',
                  marginTop: 'auto',
                }}
              >
                {item.value}
              </div>
              <a
                href={item.href}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {item.action}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-bg-subtle)', padding: '48px 0' }}>
        <div className="container-site">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{
                background: 'var(--color-bg)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '12px',
                }}
              >
                工作时间
              </h3>
              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                <p>客服热线：周一至周五 9:00-18:00</p>
                <p>在线客服：周一至周五 9:00-18:00</p>
                <p>邮件咨询：全年无休，24小时内回复</p>
              </div>
            </div>
            <div
              style={{
                background: 'var(--color-bg)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: '12px',
                }}
              >
                公司地址
              </h3>
              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                <p>枢序（北京）科技有限公司</p>
                <p>
                  注册地址以国家企业信用信息公示系统登记的住所为准。客服联络：support@pivotorder.cn（本页不作为法律文书送达地址）。
                </p>
                <p>
                  商务合作：
                  <a href="mailto:bd@pivotorder.cn" style={{ color: 'var(--color-text-heading)', fontWeight: 600 }}>
                    bd@pivotorder.cn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              发送消息
            </h2>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              填写表单，我们会尽快回复您
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    姓名
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="请输入您的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '1rem',
                    }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    邮箱
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="请输入您的邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '1rem',
                    }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    咨询主题
                  </span>
                  <select
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '1rem',
                      background: 'white',
                    }}
                  >
                    <option value="">请选择咨询主题</option>
                    <option value="产品咨询">产品咨询</option>
                    <option value="会员服务">会员服务</option>
                    <option value="技术支持">技术支持</option>
                    <option value="商务合作">商务合作</option>
                    <option value="其他">其他</option>
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-heading)' }}>
                    留言内容
                  </span>
                  <textarea
                    required
                    rows={5}
                    placeholder="请详细描述您的问题或建议..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '1rem',
                      resize: 'vertical',
                      minHeight: '120px',
                      fontFamily: 'inherit',
                    }}
                  />
                </label>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  发送消息
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
