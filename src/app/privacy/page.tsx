import type { Metadata } from 'next';
import LegalPageShell, { LegalP, LegalSection, LegalUl } from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: '隐私政策｜枢序健康',
  description: '枢序健康隐私政策：说明个人信息如何收集、使用、留存与保护。',
};

const TOC = [
  { id: 'intro', title: '1. 引言' },
  { id: 'collection', title: '2. 信息收集' },
  { id: 'usage', title: '3. 信息使用' },
  { id: 'protection', title: '4. 信息保护' },
  { id: 'sharing', title: '5. 信息共享' },
  { id: 'rights', title: '6. 用户权利' },
  { id: 'cookies', title: '7. Cookie政策' },
  { id: 'minors', title: '8. 未成年人保护' },
  { id: 'updates', title: '9. 政策更新' },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell title="隐私政策" updated="2026年8月31日" toc={TOC}>
      <LegalSection id="intro" title="1. 引言">
        <LegalP>
          枢序健康（&quot;我们&quot;）非常重视您的隐私保护。本隐私政策说明我们如何收集、
          使用、保护和处理您的个人信息。请仔细阅读，了解我们的隐私实践。
        </LegalP>
      </LegalSection>

      <LegalSection id="collection" title="2. 信息收集">
        <LegalP>我们可能收集的信息包括：</LegalP>
        <LegalUl>
          <li>账号信息：手机号、邮箱（用于注册和登录）</li>
          <li>体检报告：您上传的体检报告图片或PDF</li>
          <li>健康数据：从报告中提取的生化指标</li>
          <li>设备信息：IP地址、设备型号、浏览器类型</li>
          <li>使用数据：功能使用记录、操作日志</li>
        </LegalUl>
        <LegalP style={{ marginTop: '16px' }}>
          两类数据分开处理：个人读报告入口的资料按本政策留存；营养师工作台内的客户档案、报告与跟进记录归属该工作室，由该工作室在合规范围内管理，平台作为受托方处理。
        </LegalP>
      </LegalSection>

      <LegalSection id="usage" title="3. 信息使用">
        <LegalP>我们使用您的信息用于：</LegalP>
        <LegalUl>
          <li>提供体检报告解读和健康分析服务</li>
          <li>生成个性化的健康建议</li>
          <li>改进我们的AI算法和服务质量</li>
          <li>发送服务通知和营销信息（可退订）</li>
          <li>保障账号安全和防止欺诈</li>
        </LegalUl>
      </LegalSection>

      <LegalSection id="protection" title="4. 信息保护">
        <LegalP>我们采用多种安全措施保护您的信息：</LegalP>
        <LegalUl>
          <li>银行级SSL加密传输</li>
          <li>
            您上传的体检报告会经服务器处理（识别与指标提取）。个人体验入口的文件与解读结果默认留存
            180 天，您可随时申请删除；工作室为客户保存的档案按工作台《数据与安全》执行。
          </li>
          <li>数据库加密存储</li>
          <li>严格的内部访问控制</li>
          <li>定期安全审计</li>
        </LegalUl>
      </LegalSection>

      <LegalSection id="sharing" title="5. 信息共享">
        <LegalP>我们不会出售您的个人信息。仅在以下情况可能共享：</LegalP>
        <LegalUl>
          <li>获得您的明确同意</li>
          <li>法律法规要求</li>
          <li>保护我们的合法权益</li>
          <li>与授权合作伙伴（受保密协议约束）</li>
        </LegalUl>
      </LegalSection>

      <LegalSection id="rights" title="6. 用户权利">
        <LegalP>您拥有以下权利：</LegalP>
        <LegalUl>
          <li>访问和查看您的个人信息</li>
          <li>更正不准确的信息</li>
          <li>删除您的账号和数据</li>
          <li>导出您的健康数据</li>
          <li>撤回同意（不影响已进行的服务）</li>
        </LegalUl>
      </LegalSection>

      <LegalSection id="cookies" title="7. Cookie政策">
        <LegalP>
          我们使用Cookie来改善用户体验，包括保持登录状态、记住偏好设置、
          分析网站流量。您可以在浏览器设置中管理Cookie。
        </LegalP>
      </LegalSection>

      <LegalSection id="minors" title="8. 未成年人保护">
        <LegalP>
          我们的服务主要面向成年人。未满18岁的用户应在监护人指导下使用，
          并确保监护人同意本隐私政策。
        </LegalP>
      </LegalSection>

      <LegalSection id="updates" title="9. 政策更新">
        <LegalP>
          我们可能更新本隐私政策。重大变更会提前通知您。建议您定期查看本页面，
          了解最新隐私实践。
        </LegalP>
        <LegalP style={{ marginTop: '16px' }}>
          如有隐私相关问题，请联系：privacy@pivotorder.cn
        </LegalP>
      </LegalSection>
    </LegalPageShell>
  );
}
