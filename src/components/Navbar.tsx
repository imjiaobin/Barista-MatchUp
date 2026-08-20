'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
        <Link href="/" className="text-xl font-medium tracking-[0.2em] text-indigo">
          Pourfolio
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, path }) => {
            const Icon = navIcons[path]
            return (
              <li key={path}>
                <Link
                  href={path}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`group inline-flex items-center font-[525] text-sm tracking-widest uppercase transition-colors duration-200 ${
                    isActive(path) ? 'text-brown' : 'text-stone-800 hover:text-brown'
                  }`}
                >
                  <span className="relative">
                    {label}
                    <span
                      className={`absolute bottom-0 left-0 h-px w-full bg-brown origin-left transition-transform duration-300 ease-out ${
                        isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </span>
                  <span className="inline-flex items-center overflow-hidden w-4 h-4 ml-1">
                    <motion.span
                      initial={false}
                      animate={hoveredPath === path || isActive(path) ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="inline-flex"
                    >
                      <Icon size={16} />
                    </motion.span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <Link href="/contact" className="hidden md:block btn-primary text-xs py-2 px-5">
          立即諮詢
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-700"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
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
