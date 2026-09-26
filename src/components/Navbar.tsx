'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '../assets/PourFolio-logo-no-tagline.svg'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { PiHouse, PiBookOpen, PiCoffee, PiCalendarDots, PiEnvelopeSimple } from 'react-icons/pi'
import type { IconType } from 'react-icons'

const links = [
  { label: '首頁', path: '/' },
  { label: '品牌故事', path: '/about' },
  { label: '服務項目', path: '/services' },
  { label: '活動經歷', path: '/events' },
  // 咖啡師媒合頁面先隱藏，待後續功能規劃完成後再放回 nav
  // { label: '咖啡師', path: '/baristas' },
  { label: '聯絡我們', path: '/contact' },
]

const navIcons: Record<string, IconType> = {
  '/': PiHouse,
  '/about': PiBookOpen,
  '/services': PiCoffee,
  '/events': PiCalendarDots,
  '/contact': PiEnvelopeSimple,
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [ctaHovered, setCtaHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Pourfolio" className="h-11 w-auto" priority unoptimized />
        </Link>

        {/* 桌面版導覽連結 */}
        <ul className="hidden md:flex items-center gap-2">
          {links.map(({ label, path }) => {
            const Icon = navIcons[path]
            return (
              <li key={path}>
                <Link
                  href={path}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className="group relative block w-28 h-9 text-sm tracking-widest uppercase"
                >
                  {/* hover/active 時從 nav 頂部落下的色塊。這個連結本身
                      在 64px 高的 nav 裡是垂直置中的（自己 36px 的框上下
                      各留 14px 間距），所以這個色塊要往上多延伸 14px 才能
                      碰到 nav 的頂部，底部則維持貼齊連結本身的底邊。 */}
                  <span
                    className={`absolute inset-x-0 -top-3.5 h-[50px] bg-brown rounded-b-lg origin-top transition-transform duration-300 ease-out ${
                      isActive(path) ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                    }`}
                  />
                  {/* 內容疊層跟上面色塊用一模一樣的框（同樣的 -top/height），
                      這樣文字/圖示才能精準置中在色塊裡 */}
                  <span className="absolute inset-x-0 -top-3.5 h-[50px] z-10 flex items-center justify-center gap-1">
                    <span
                      className={`transition-colors duration-300 ${
                        isActive(path) ? 'text-white' : 'text-stone-800 group-hover:text-white'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="inline-flex items-center overflow-hidden w-4 h-4">
                      <motion.span
                        initial={false}
                        animate={hoveredPath === path || isActive(path) ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`inline-flex transition-colors duration-300 ${
                          isActive(path) ? 'text-white' : 'text-stone-800 group-hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                      </motion.span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <Link
          href="/contact"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="hidden md:inline-flex items-center gap-1.5 btn-primary text-xs py-2 px-5 hover:bg-opacity-100 hover:translate-y-0 hover:scale-[1.03]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!ctaHovered && (
              <motion.span
                key="icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="inline-flex"
              >
                <FiMessageCircle size={14} />
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span layout="position" transition={{ duration: 0.2, ease: 'easeOut' }} className="inline-block">
            立即諮詢
          </motion.span>
          <AnimatePresence mode="popLayout" initial={false}>
            {ctaHovered && (
              <motion.span
                key="arrow"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="inline-flex"
              >
                <FiArrowRight size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* 手機版漢堡選單按鈕 */}
        <button
          className="md:hidden text-stone-700"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </nav>

      {/* 手機版選單 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-stone-50/95 backdrop-blur-md border-t border-stone-200 px-6 py-6 flex flex-col gap-4 shadow-lg"
          >
            {links.map(({ label, path }) => {
              const Icon = navIcons[path]
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 font-[450] text-sm tracking-widest uppercase ${
                    isActive(path) ? 'text-brown' : 'text-stone-500'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-2">
              立即諮詢
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
