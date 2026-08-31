import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '联系我们｜枢序健康',
  description: '枢序（北京）科技有限公司客服联络：support@pivotorder.cn',
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
