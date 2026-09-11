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
  assert.match(solutions, /获客、收费、交付，放进同一张工作台/);
});
