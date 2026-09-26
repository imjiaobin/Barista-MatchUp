import Link from 'next/link'
import Image from 'next/image'
import { FiInstagram, FiMail } from 'react-icons/fi'
import logo from '../assets/PourFolio-logo-no-tagline.svg'

export default function Footer() {
  return (
    <footer className="bg-olive text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Image src={logo} alt="Pourfolio" className="h-7 w-auto mb-3 brightness-0 invert" unoptimized />
          <p className="text-sm leading-relaxed">
            專業咖啡師 × 精準活動媒合
            <br />
            讓每一次倒杯，都成為品牌故事的一部分。
          </p>
        </div>

        <div>
          <p className="section-label text-white/40 mb-4">頁面</p>
          <ul className="flex flex-col gap-2 text-sm">
            {[
              { label: '品牌故事', path: '/about' },
              { label: '服務項目', path: '/services' },
              { label: '活動經歷', path: '/events' },
              // 咖啡師介紹頁面先隱藏，待後續功能規劃完成後再放回
              // { label: '咖啡師介紹', path: '/baristas' },
              { label: '聯絡我們', path: '/contact' },
            ].map(({ label, path }) => (
              <li key={path}>
                <Link href={path} className="hover:text-white transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label text-white/40 mb-4">聯繫</p>
          <div className="flex flex-col gap-3 text-sm">
            <a href="mailto:hello@pourfolio.tw" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <FiMail size={14} /> hello@pourfolio.tw
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <FiInstagram size={14} /> @pourfolio.tw
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center text-xs text-white/30">
          <span>© 2026 Pourfolio. All rights reserved.</span>
          <span>台灣 · Taiwan</span>
        </div>
      </div>
    </footer>
  )
}
