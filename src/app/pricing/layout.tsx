import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: '一条咨询费，对照工作台月费｜枢序健康',
  description:
    '独立 ¥99 / 工作室 ¥299 / 机构 ¥899。咨询费 × 月成交单数是公式演示，不是保证接到 5 单。H5 只是留资页。',
  path: '/pricing',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
