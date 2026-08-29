import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '聯絡我們 — Pourfolio',
  description: '告訴我們你的活動需求，我們會依風格與規模媒合最合適的咖啡師與方案。',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
