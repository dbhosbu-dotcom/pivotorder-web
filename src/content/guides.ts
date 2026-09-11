import { workbenchRegisterUrl } from '@/lib/site';

export type GuideFaq = {
  question: string;
  answer: string;
};

export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type Guide = {
  slug: 'nutritionist-get-clients' | 'how-to-price-consult' | 'white-label-report';
  title: string;
  description: string;
  h1: string;
  cardTitle: string;
  cardSummary: string;
  publishedAt: string;
  updatedAt: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  ctaLabel: string;
  ctaBody: string;
  ctaHref: string;
};

export const GUIDES: readonly Guide[] = [
  {
    slug: 'nutritionist-get-clients',
    title: '营养师怎么获客：H5 测评留资与工作室跟进｜枢序健康',
    description:
      '考证营养师怎么接单、怎么把内容流量变成可跟进客户？用 H5 测评沉淀线索，再用人跟进与白标报告交付。健康管理参考，不构成医学诊断。',
    h1: '营养师怎么获客：先留资，再跟进交付',
    cardTitle: '营养师怎么获客',
    cardSummary: '内容触达之后，用 H5 测评留下可跟进线索，再由你确认沟通与交付。',
    publishedAt: '2026-09-11',
    updatedAt: '2026-09-11',
    sections: [
      {
        id: 'overview',
        title: '先把访客变成线索',
        paragraphs: [
          '营养师获客，关键不是「发更多内容」，而是把访客变成可跟进的线索，再用人完成咨询与交付。',
        ],
      },
      {
        id: 'answer',
        title: '直答',
        paragraphs: [
          '常见可行路径是——内容触达 → H5/问卷留资 → 人工确认沟通 → 报告或方案交付 → 复访跟进。不要承诺「自动加好友、自动私信、保证成交」。',
        ],
      },
      {
        id: 'steps',
        title: '五步落地',
        paragraphs: ['按这个顺序搭，比先堆渠道更稳：'],
        list: [
          '明确服务边界（营养与健康管理支持，不代替医生诊断或开药）',
          '低门槛入口（测评/问卷链接）',
          '只收集必要信息并说明隐私',
          '48小时内人工跟进',
          '白标品牌化交付',
        ],
      },
      {
        id: 'boundary',
        title: '边界',
        paragraphs: [
          '健康管理参考，不构成医学诊断、治疗或疗效承诺；不自动群发、不自动私信。线索跟进必须由你本人确认后发出。',
        ],
      },
    ],
    faqs: [
      {
        question: '考证后怎么开始接单？',
        answer:
          '先写清服务边界，再发低门槛 H5 或问卷链接留资。线索进工作室后，由你在 48 小时内人工确认跟进，再用白标报告或方案交付。平台不自动加好友、不自动私信。',
      },
      {
        question: 'H5 测评可以承诺成交吗？',
        answer:
          '不可以。H5 只负责把访客变成可跟进线索，不保证获客量或成交。报告仅供健康管理参考，不构成医学诊断。',
      },
      {
        question: '跟进能不能自动发私信？',
        answer:
          '不能。枢序健康要求跟进由营养师人工确认后发送，不提供自动私信或自动群发。',
      },
    ],
    ctaLabel: '免费开通营养师工作室',
    ctaBody: '免费开通营养师工作室：配置品牌、发布 H5 测评、沉淀线索后由你确认跟进。',
    ctaHref: workbenchRegisterUrl,
  },
  {
    slug: 'how-to-price-consult',
    title: '营养师咨询怎么收费：初诊、报告解读与跟进定价｜枢序健康',
    description:
      '营养师咨询与体检报告解读怎么定价？用服务包拆分初诊、报告解读、复访跟进，写清边界与交付物。健康管理参考，不构成医学诊断。',
    h1: '营养师咨询怎么收费：先拆服务包，再定价格带',
    cardTitle: '营养师咨询怎么收费',
    cardSummary: '按初诊、报告解读与跟进周期打包，写清交付物和不含什么。',
    publishedAt: '2026-09-11',
    updatedAt: '2026-09-11',
    sections: [
      {
        id: 'overview',
        title: '收费难，往往因为在卖时间',
        paragraphs: [
          '咨询收费难，往往因为卖的是时间，而不是可交付结果。把「聊多久」改成「交付什么」，价格才站得住。',
        ],
      },
      {
        id: 'answer',
        title: '直答',
        paragraphs: [
          '按初诊沟通 + 资料/报告解读 + 跟进周期打包；报告解读可单报，但须写明健康管理参考、非诊断。',
        ],
      },
      {
        id: 'steps',
        title: '定价步骤',
        paragraphs: ['可以按这个顺序写价目，而不是先报一个整数：'],
        list: [
          '列出交付物（沟通纪要、报告解读笔记、复访节点）',
          '分档（单次解读 / 初诊包 / 周期跟进）',
          '写清不含什么（不开药、不替代就诊、不承诺疗效）',
          '用工具控制出稿成本，但发送必须人工确认',
          '半公开价目，方便转介绍时对齐预期',
        ],
      },
      {
        id: 'examples',
        title: '示例区间（非承诺、非报价）',
        paragraphs: [
          '以下仅为便于拆包的示例区间，不是市场均价，也不构成枢序健康的报价或收益承诺：',
        ],
        list: [
          '初诊沟通：可按一次完整问诊与目标对齐计',
          '体检资料 / 报告解读：可单报，须标注健康管理参考',
          '复访跟进：按 2–4 周周期打包，写清回复方式与次数上限',
        ],
      },
      {
        id: 'boundary',
        title: '边界',
        paragraphs: [
          '收费对应的是咨询与健康管理服务，不是诊断、治疗或疗效保证。工作台可帮你控成本、出草稿，发送前仍须你确认。',
        ],
      },
    ],
    faqs: [
      {
        question: '报告解读可以单独收费吗？',
        answer:
          '可以单独报价，但必须写明交付物是健康管理参考解读，不构成医学诊断，也不承诺疗效。',
      },
      {
        question: '要不要把价格完全公开？',
        answer:
          '更稳妥的是半公开价目：写清分档与不含项目，具体数字可按资料完整度与跟进周期调整。不要用「保证回本」当卖点。',
      },
      {
        question: '工具出稿能不能代替人工确认？',
        answer:
          '不能。工具只降低整理成本；发给客户前必须由你确认。平台不自动私信、不自动群发。',
      },
    ],
    ctaLabel: '免费注册工作室',
    ctaBody: '免费注册工作室，把报价路径、线索和白标草稿放进同一张工作台，你确认后再发给客户。',
    ctaHref: workbenchRegisterUrl,
  },
  {
    slug: 'white-label-report',
    title: '营养师白标报告：用自己的品牌交付健康管理参考｜枢序健康',
    description:
      '什么是营养师白标报告？上传体检单生成可编辑草稿，带工作室 Logo 与署名，确认后再发给客户。健康管理参考，不构成医学诊断。',
    h1: '营养师白标报告：客户看到你的品牌，不是平台壳',
    cardTitle: '营养师白标报告',
    cardSummary: '上传体检单生成可编辑草稿，套上工作室品牌，确认后再发送。',
    publishedAt: '2026-09-11',
    updatedAt: '2026-09-11',
    sections: [
      {
        id: 'overview',
        title: '白标是什么',
        paragraphs: [
          '白标 = 客户材料带你的 Logo 与署名。客户记住的是你的工作室，而不是平台外壳。',
        ],
      },
      {
        id: 'flow',
        title: '交付流程',
        paragraphs: ['一条可重复的路径是：导入材料 → 结构化草稿 → 套品牌模板 → 你确认后发送。'],
      },
      {
        id: 'steps',
        title: '四步落地',
        paragraphs: ['从第一次交付开始，就可以按这四步走：'],
        list: [
          '导入体检单或其他客户材料',
          '生成可编辑的结构化草稿',
          '套用工作室 Logo、色彩与署名',
          '你逐份确认后，再发给客户',
        ],
      },
      {
        id: 'boundary',
        title: '边界',
        paragraphs: [
          '白标报告仅供健康管理参考，不构成医学诊断、治疗或疗效承诺。未确认的草稿不得自动外发。',
        ],
      },
    ],
    faqs: [
      {
        question: '白标报告和平台报告有什么区别？',
        answer:
          '白标报告对外展示工作室 Logo 与署名，客户看到的是你的品牌。平台只提供可编辑草稿和工作台，不替代你确认发送。',
      },
      {
        question: '上传体检单后会不会直接发给客户？',
        answer:
          '不会。系统只生成可编辑草稿。你确认后才发送；平台不自动私信、不自动群发。',
      },
      {
        question: '白标报告能当诊断书吗？',
        answer:
          '不能。报告仅供健康管理参考，不构成医学诊断或治疗建议，也不能承诺疗效。',
      },
    ],
    ctaLabel: '免费入驻',
    ctaBody: '免费入驻工作室：上传材料出白标草稿，带上你的品牌，确认后再发给客户。',
    ctaHref: workbenchRegisterUrl,
  },
] as const;

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function listGuideSlugs(): Array<Guide['slug']> {
  return GUIDES.map((guide) => guide.slug);
}
