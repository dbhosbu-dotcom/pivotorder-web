import type { Metadata } from 'next';
import Link from 'next/link';
import EngineForm from '@/components/engine/EngineForm';

export const metadata: Metadata = {
  title: '上传体检报告｜枢序健康',
  description: '上传体检报告，生成可跟进的健康管理参考。个人体验按隐私政策默认留存 180 天。',
};

const STATS = [
  { num: '10万+', label: '报告解读' },
  { num: '98.6%', label: 'OCR准确率' },
  { num: '90天', label: '干预参考' },
];

const INSTITUTIONS = ['美年大健康', '爱康国宾', '瑞慈体检', '慈铭体检', '三甲医院'];

const DEMO_STEPS = [
  '智能OCR识别',
  '提取127项指标',
  '10大支柱评估',
  '生成生活方式参考 / 90天跟进草稿',
];

export default function UploadPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          padding: '64px 0 48px',
          color: '#fff',
        }}
      >
        <div className="container-site">
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '28px',
            }}
          >
            上传体检报告
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '28px',
            }}
          >
            {STATS.map((item) => (
              <div key={item.label} style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.num}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
            你的体检报告，可以整理成一份可跟进的健康管理参考
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', marginBottom: '24px' }}>
            基于127项生化指标 · 10大支柱评估 · 健康管理参考草稿
          </p>

          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginBottom: '12px' }}>
            支持多种格式　PDF · JPG · PNG · 手机拍照直传
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
            已兼容主流体检机构
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            {INSTITUTIONS.map((name) => (
              <span
                key={name}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  fontSize: '0.75rem',
                }}
              >
                {name}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '24px',
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            {DEMO_STEPS.map((step) => (
              <span
                key={step}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {step}
              </span>
            ))}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', maxWidth: '720px', lineHeight: 1.7 }}>
            文件上传至服务器完成本次解读。个人体验按
            <Link href="/privacy" style={{ color: '#FFD700', textDecoration: 'underline' }}>
              《隐私政策》
            </Link>
            默认留存 180 天，可随时申请删除；工作室客户资料进入该工作室档案。
          </p>
        </div>
      </div>

      <EngineForm />
    </div>
  );
}
