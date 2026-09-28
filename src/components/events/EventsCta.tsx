'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiEdit3 } from 'react-icons/fi'
import FadeIn from '../FadeIn'

export default function EventsCta() {
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <section className="py-20 px-6 bg-stone-50">
      <FadeIn className="max-w-2xl mx-auto text-center">
        <p className="section-label md:text-lg mb-4">下一場，換你的品牌</p>
        <h2 className="section-title mb-4">讓我們一起策劃專屬活動</h2>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          告訴我們你的活動需求，我們會依風格與規模媒合最合適的咖啡師與方案。
        </p>
        <Link
          href="/contact"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-caramel text-white text-xs md:text-sm rounded-sm tracking-widest uppercase transition-colors duration-200"
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
                <FiEdit3 size={16} />
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span layout="position" transition={{ duration: 0.2, ease: 'easeOut' }} className="inline-block">
            填寫需求表單
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
                <FiArrowRight size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </FadeIn>
    </section>
  )
}
