import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const links = [
  { label: '首頁', path: '/' },
  { label: '品牌故事', path: '/about' },
  { label: '服務項目', path: '/services' },
  { label: '咖啡師', path: '/baristas' },
  { label: '聯絡我們', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-light tracking-[0.2em] text-indigo">
          Pourfolio
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `relative inline-block text-sm tracking-widest uppercase transition-colors duration-200
                   after:content-[''] after:absolute after:bottom-0 after:left-0
                   after:h-px after:w-full after:bg-brown after:origin-left
                   after:transition-transform after:duration-300 after:ease-out
                   ${isActive
                     ? 'text-brown after:scale-x-100'
                     : 'text-stone-500 hover:text-brown after:scale-x-0 hover:after:scale-x-100'
                   }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink to="/contact" className="hidden md:block btn-primary text-xs py-2 px-5">
          立即媒合
        </NavLink>

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
            {links.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm tracking-widest uppercase ${
                    isActive ? 'text-brown' : 'text-stone-500'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-2">
              立即媒合
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
