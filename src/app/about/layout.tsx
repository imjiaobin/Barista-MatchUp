import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '品牌故事 — Pourfolio',
  description: 'Pourfolio 源自一個簡單的觀察：優秀的咖啡師與值得被呈現的品牌活動之間，缺少一座橋樑。',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
