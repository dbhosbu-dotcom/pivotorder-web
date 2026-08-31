import type { Metadata } from 'next';
import LegalPageShell, { LegalP, LegalSection } from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: '用户协议｜枢序健康',
  description: '枢序健康用户协议：个人体验授权与工作室商业授权说明。',
};

const TOC = [
  { id: 'scope', title: '1. 协议范围' },
  { id: 'registration', title: '2. 账号注册' },
  { id: 'service', title: '3. 服务内容' },
  { id: 'conduct', title: '4. 用户行为规范' },
  { id: 'ip', title: '5. 知识产权与授权' },
  { id: 'disclaimer', title: '6. 免责声明' },
  { id: 'modification', title: '7. 协议修改' },
  { id: 'dispute', title: '8. 争议解决' },
];

export default function TermsPage() {
  return (
    <LegalPageShell title="用户协议" updated="2026年8月31日" toc={TOC}>
      <LegalSection id="scope" title="1. 协议范围">
        <LegalP>
          本协议是您与枢序健康（以下简称&quot;我们&quot;）之间关于使用枢序健康网站及相关服务所订立的协议。
          请您仔细阅读本协议，一旦您使用我们的服务，即表示您同意接受本协议的所有条款。
        </LegalP>
      </LegalSection>

      <LegalSection id="registration" title="2. 账号注册">
        <LegalP>
          您需要注册账号才能使用部分服务。您承诺提供真实、准确的注册信息，并负责维护账号安全。
          如发现账号异常，请立即联系我们。
        </LegalP>
      </LegalSection>

      <LegalSection id="service" title="3. 服务内容">
        <LegalP>
          我们提供基于AI的体检报告解读、健康数据分析、营养建议等服务。
          我们保留随时修改、中断或终止服务的权利，会提前通知您。
        </LegalP>
      </LegalSection>

      <LegalSection id="conduct" title="4. 用户行为规范">
        <LegalP>
          您承诺不利用我们的服务从事违法违规活动，不上传虚假或他人隐私数据。
          违反规定可能导致账号被封禁。
        </LegalP>
      </LegalSection>

      <LegalSection id="ip" title="5. 知识产权与授权">
        <LegalP>
          5.1 平台权利：我们拥有平台软件、模型、界面与商标（含「枢序健康™」「PivotOrder®」）的知识产权。本协议不转让所有权。
        </LegalP>
        <LegalP style={{ marginTop: '16px' }}>
          5.2 个人体验授权（非商业）：若您只使用个人读报告入口（含免费体验及个人订阅），您获得有限、不可转让、非商业的使用授权，仅限您本人查阅健康管理参考。不得将个人入口的输出用于对外经营、白标交付或向第三方收费。
        </LegalP>
        <LegalP style={{ marginTop: '16px' }}>
          5.3 工作室商业授权：若您开通营养师 / 工作室 / 机构工作台，在有效订阅（含免费版额度内）且遵守资质认证规则的前提下，您可将平台生成的报告草稿、客户档案与随访工具用于自己的执业或机构经营，包括认证通过后按套餐以您的品牌对外交付白标健康管理参考报告。不得转售平台本身、不得把接口转授给未开通工作台的第三方，也不得去掉法律必要的免责声明。
        </LegalP>
      </LegalSection>

      <LegalSection id="disclaimer" title="6. 免责声明">
        <LegalP>
          我们提供的服务仅供参考，不构成医疗诊断或治疗建议。
          如有健康问题，请及时就医。
        </LegalP>
      </LegalSection>

      <LegalSection id="modification" title="7. 协议修改">
        <LegalP>
          我们保留修改本协议的权利。修改后的协议将在网站上公布，
          继续使用服务视为接受新协议。
        </LegalP>
      </LegalSection>

      <LegalSection id="dispute" title="8. 争议解决">
        <LegalP>
          本协议适用中华人民共和国法律。如有争议，双方应友好协商解决；
          协商不成的，提交我们所在地有管辖权的法院诉讼解决。
        </LegalP>
      </LegalSection>
    </LegalPageShell>
  );
}
