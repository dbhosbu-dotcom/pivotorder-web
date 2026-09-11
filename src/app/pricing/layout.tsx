import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: '营养师工作室定价：¥99 / ¥299 / ¥899｜枢序健康',
  description:
    '枢序健康工作室档位：独立档 ¥99/月、专业档 ¥299/月、机构档 ¥899/月。H5 留资、报价与白标草稿同一工作台，确认后发送。不承诺获客单数。',
  path: '/pricing',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
