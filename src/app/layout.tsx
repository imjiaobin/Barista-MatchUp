import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_TC } from 'next/font/google'
import SiteChrome from '../components/SiteChrome'
import '../styles/global.scss'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
})

// Inter 沒有中文字形，所以中文字會落到字型堆疊的下一個字型。如果沒有這個
// fallback 設定，中文字就會套用作業系統預設的 CJK 字型，這種字型通常只有
// Regular/Bold 兩種字重——中間所有 Tailwind 的字重（font-medium、任意數值的
// font-[450]/font-[525] 等）就會全部渲染成同一個樣子，因為瀏覽器只能套用
// 最接近的既有字重。`weight: 'variable'` 會載入完整的可變字重範圍，
// 讓中文字的這些中間字重也能正確顯示出差異。
const notoSansTC = Noto_Sans_TC({
  weight: 'variable',
  style: ['normal'],
  variable: '--font-noto-sans-tc',
})

export const metadata: Metadata = {
  title: 'Pourfolio — 專業咖啡師活動媒合',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable}`}>
      <body className="flex flex-col min-h-screen">
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  )
}
