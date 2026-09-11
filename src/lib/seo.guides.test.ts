import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readSrc(relativePath: string) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const REQUIRED_SLUGS = [
  'nutritionist-get-clients',
  'how-to-price-consult',
  'white-label-report',
] as const;

test('guides expose the three locked slugs', () => {
  const guides = readSrc('content/guides.ts');
  for (const slug of REQUIRED_SLUGS) {
    assert.match(guides, new RegExp(`slug: '${slug}'`));
  }
});

test('guides stay on the compliance rails', () => {
  const guides = readSrc('content/guides.ts');
  assert.equal(guides.includes('迪哥'), false);
  assert.match(guides, /不自动私信/);
  assert.match(guides, /不构成医学诊断/);
  assert.match(guides, /workbenchRegisterUrl/);
});

test('sitemap includes guides index and each slug', () => {
  const site = readSrc('lib/site.ts');
  assert.match(site, /'\/guides'/);
  for (const slug of REQUIRED_SLUGS) {
    assert.match(site, new RegExp(`'/guides/${slug}'`));
  }
});

test('homepage metadata matches the locked China copy', () => {
  const site = readSrc('lib/site.ts');
  assert.match(site, /营养师获客与收费工作台｜白标报告 · 枢序健康/);
  assert.match(site, /不构成医学诊断/);
  assert.match(site, /不自动私信/);
});

test('hero and solutions keep GTM-locked acquisition copy', () => {
  const hero = readSrc('components/home/WorkbenchHero.tsx');
  const solutions = readSrc('locales/zh.ts');
  assert.match(hero, /证拿到了。客户从哪来，咨询费怎么收？/);
  assert.match(hero, /免费搭建工作室/);
  assert.match(hero, /发 H5 获客/);
  assert.match(solutions, /获客、收费、交付，持证营养师的开张三步/);
});

test('GTM acceptance blockers stay patched', () => {
  const math = readSrc('components/home/MoneyMathStrip.tsx');
  const delivery = readSrc('components/home/DeliveryProofSection.tsx');
  const cta = readSrc('components/home/CtaSection.tsx');
  const pricing = readSrc('app/pricing/page.tsx');
  const solutionsHero = readSrc('components/solutions/SolutionsHero.tsx');
  const funnel = readSrc('components/solutions/SolutionsFunnelCards.tsx');
  const printReport = readSrc('components/solutions/PrintReport.tsx');
  const solutionsGrid = readSrc('components/solutions/SolutionsGrid.tsx');
  const homepage = readSrc('app/page.tsx');
  const hero = readSrc('components/home/WorkbenchHero.tsx');

  assert.match(math, /一条咨询费，对照工作台月费/);
  assert.match(math, /咨询费 × 月成交单数/);
  assert.match(math, /演示 200 元 × 5 单 = 1000 元，对照独立档 99 元\/月/);
  assert.match(math, /这是公式，不是保证接到 5 单/);
  assert.match(math, /H5 只是留资页，客户不会自动进来/);

  assert.equal(delivery.includes('38.2'), false);
  assert.equal(/\b47\b/.test(delivery), false);
  assert.match(delivery, /交得出去/);
  assert.match(delivery, /上传检验单/);
  assert.match(delivery, /AI 整理/);
  assert.match(delivery, /白标草稿/);
  assert.match(delivery, /确认后发送/);
  assert.match(delivery, /报告仅供健康管理参考，发送前须你确认/);

  assert.match(cta, /先发出第一条 H5，再谈第一条付费咨询/);
  assert.match(cta, /链接先发到自己微信。有人留资再报价，成交后再出报告。/);
  assert.match(cta, /免费搭建工作室/);
  assert.match(cta, /看营养师指南/);
  assert.match(cta, /href="\/guides"/);
  assert.equal(cta.includes('上传体检报告'), false);
  assert.equal(cta.includes('开始分析'), false);
  assert.equal(cta.includes('你的生物学不是平均值'), false);
  assert.match(cta, /workbenchRegisterUrl/);

  assert.match(pricing, /一条咨询费，对照工作台月费/);
  assert.match(pricing, /独立/);
  assert.match(pricing, /工作室/);
  assert.match(pricing, /机构/);
  assert.match(pricing, /¥99/);
  assert.match(pricing, /¥299/);
  assert.match(pricing, /¥899/);
  assert.match(pricing, /免费搭建工作室/);
  assert.match(pricing, /也可先体验解读质量，不是工作室主生意。/);
  assert.equal(pricing.includes('专业版'), false);
  assert.equal(/¥29(?!\d)/.test(pricing), false);

  assert.match(funnel, /给考证后还没客源的人/);
  assert.match(funnel, /第一条付费咨询怎么成交/);
  assert.equal(solutionsHero.includes('临床路径'), false);
  assert.equal(solutionsHero.includes('三大核心算力引擎'), false);
  assert.equal(solutionsHero.includes('ENGINE_TRIAD'), false);
  assert.equal(printReport.includes('临床路径'), false);
  assert.equal(printReport.includes('诊所'), false);
  assert.equal(printReport.includes('Evidence Level A'), false);
  assert.equal(printReport.includes('EVIDENCE LEVEL A'), false);
  assert.equal(solutionsGrid.includes('Evidence '), false);

  assert.equal(homepage.includes('前 3 次体检报告解读，完全免费'), false);
  assert.equal(hero.includes('前 3 次体检报告解读，完全免费'), false);
  assert.equal(cta.includes('前 3 次体检报告解读，完全免费'), false);
});

test('homepage middle and nav drop leftover paradigm/pillars copy', () => {
  const homepage = readSrc('app/page.tsx');
  const funnel = readSrc('components/home/StudioFunnelSection.tsx');
  const navbar = readSrc('components/layout/Navbar.tsx');
  const footer = readSrc('components/layout/Footer.tsx');
  const zh = readSrc('locales/zh.ts');

  assert.match(homepage, /StudioFunnelSection/);
  assert.equal(homepage.includes('ParadigmSection'), false);
  assert.equal(homepage.includes('PillarsPreviewSection'), false);

  assert.match(funnel, /获客、收费、交付/);
  assert.match(funnel, /开张三步/);
  assert.equal(funnel.includes('Data Points'), false);
  assert.equal(funnel.includes('10-PILLAR'), false);
  assert.equal(funnel.includes('十大代谢支柱'), false);
  assert.equal(funnel.includes('诊所'), false);
  assert.equal(funnel.includes('临床'), false);

  assert.match(navbar, /获客·收费·交付/);
  assert.equal(navbar.includes('干预方案'), false);
  assert.match(footer, /获客·收费·交付/);
  assert.equal(footer.includes('干预方案'), false);
  assert.match(zh, /solutions:\s+'获客·收费·交付'/);
});
