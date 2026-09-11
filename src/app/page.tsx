import WorkbenchHero from '@/components/home/WorkbenchHero';
import DeliveryProofSection from '@/components/home/DeliveryProofSection';
import StudioFunnelSection from '@/components/home/StudioFunnelSection';
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
      <DeliveryProofSection />
      <StudioFunnelSection />
      <CtaSection />
    </>
  );
}
