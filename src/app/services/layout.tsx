import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服務項目 — Pourfolio',
  description: '咖啡師媒合、企劃協力、品牌聯名、常態方案 — Pourfolio 的四項核心服務。',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
