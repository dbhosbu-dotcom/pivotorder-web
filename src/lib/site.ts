/** Public marketing origin for pivotorder.cn (枢序健康). */
export const SITE_ORIGIN = 'https://pivotorder.cn';

export const HOME_METADATA = {
  title: '营养师获客与收费工作台｜白标报告 · 枢序健康',
  description:
    '枢序健康帮营养师做获客留资、咨询收费交付与白标健康报告：H5 测评沉淀线索，工作台出可编辑白标草稿，确认后发送。免费开通工作室。健康管理参考，不构成医学诊断，不承诺获客效果。',
  ogDescription:
    '获客测评、咨询交付与白标报告同一条链路。你确认才发送；不诊断、不治疗、不自动私信。',
} as const;

export const SITE_NAME = '枢序健康';

/** Nutritionist workbench signup. Follow-up stays human-confirmed. */
export const workbenchRegisterUrl = 'https://app.pivotorder.cn/register';

export const PUBLIC_SITEMAP_ROUTES = [
  '/',
  '/guides',
  '/guides/nutritionist-get-clients',
  '/guides/how-to-price-consult',
  '/guides/white-label-report',
  '/solutions',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/science',
  '/pricing',
  '/pillars',
  '/enterprise',
  '/upload',
] as const;

export type PublicSitemapRoute = (typeof PUBLIC_SITEMAP_ROUTES)[number];

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
