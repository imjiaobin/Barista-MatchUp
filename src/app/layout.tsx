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

// Inter has no Chinese glyphs, so Chinese text falls through to the next
// font in the stack. Without this, that fallback lands on the OS's default
// CJK font, which typically only ships Regular/Bold faces — every Tailwind
// weight in between (font-medium, the arbitrary font-[450]/font-[525], etc.)
// then renders identically since the browser snaps to the nearest face it
// actually has. `weight: 'variable'` pulls in the full weight axis so those
// in-between weights render distinctly for Chinese text too.
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
