import SolutionsHero from '@/components/solutions/SolutionsHero';
import SolutionsGrid from '@/components/solutions/SolutionsGrid';
import SolutionsCta from '@/components/solutions/SolutionsCta';

export const metadata = {
  title: 'Clinical Intervention Pathways — PivotOrder',
  description:
    'Agnostic, data-driven clinical intervention protocols based on your multi-omic biological age delta. Metabolic, epigenetic, microbiome, and autonomic pathways.',
};

export default function SolutionsPage() {
  return (
    <div style={{ backgroundColor: '#0A0C10', minHeight: 'calc(100vh - 68px)' }}>
      <SolutionsHero />
      <SolutionsGrid />
      <SolutionsCta />
    </div>
  );
}
