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
  const printReport = readSrc('components/solutions/PrintReport.tsx');

  assert.match(math, /咨询费 × 月成交单数/);
  assert.match(math, /200元/);
  assert.match(math, /5单/);
  assert.match(math, /1000元/);
  assert.match(math, /对照独立档 ¥99\/月/);
  assert.match(math, /公式演示，不是保证接到 5 单/);
  assert.match(math, /H5 只是留资页/);

  assert.equal(delivery.includes('38.2'), false);
  assert.equal(/\b47\b/.test(delivery), false);
  assert.match(delivery, /未确认 · 不发送/);
  assert.match(delivery, /健康管理参考草稿/);

  assert.match(cta, /免费搭建工作室/);
  assert.equal(cta.includes('上传体检报告'), false);
  assert.match(cta, /workbenchRegisterUrl/);

  assert.match(pricing, /¥99/);
  assert.match(pricing, /¥299/);
  assert.match(pricing, /¥899/);
  assert.match(pricing, /免费搭建工作室/);
  assert.match(pricing, /个人体验（非开张方案）/);

  assert.equal(solutionsHero.includes('临床路径'), false);
  assert.equal(printReport.includes('临床路径'), false);
  assert.equal(printReport.includes('诊所'), false);
});
