import WorkbenchHero from '@/components/home/WorkbenchHero';
import MoneyMathStrip from '@/components/home/MoneyMathStrip';
import DeliveryProofSection from '@/components/home/DeliveryProofSection';
import ParadigmSection from '@/components/home/ParadigmSection';
import PillarsPreviewSection from '@/components/home/PillarsPreviewSection';
import CtaSection from '@/components/home/CtaSection';
import { buildPageMetadata, HOME_METADATA } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: HOME_METADATA.title,
  description: HOME_METADATA.description,
  path: '/',
  ogDescription: HOME_METADATA.ogDescription,
});

export default function HomePage() {
  return (
    <>
      <WorkbenchHero />
      <MoneyMathStrip />
      <DeliveryProofSection />
      <ParadigmSection />
      <PillarsPreviewSection />
      <CtaSection />
    </>
  );
}
