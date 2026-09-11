import SolutionsHero from '@/components/solutions/SolutionsHero';
import SolutionsGrid from '@/components/solutions/SolutionsGrid';
import SolutionsCta  from '@/components/solutions/SolutionsCta';
import PrintReport   from '@/components/solutions/PrintReport';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: '营养师获客、收费与白标交付｜枢序健康',
  description:
    '枢序健康把获客留资、咨询收费与白标报告放进同一条工作台：H5 测评沉淀线索，报价路径写清交付物，白标草稿确认后发送。健康管理参考，不构成医学诊断。',
  path: '/solutions',
});

export default function SolutionsPage() {
  return (
    <>
      {/* ── Screen view ── */}
      <div className="no-print" style={{ backgroundColor: '#0A0C10', minHeight: 'calc(100vh - 68px)' }}>
        <SolutionsHero />
        <SolutionsGrid />
        <SolutionsCta />
      </div>

      {/* ── Print-only A4 medical report ── */}
      <PrintReport />
    </>
  );
}
