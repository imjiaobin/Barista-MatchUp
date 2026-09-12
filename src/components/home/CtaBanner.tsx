'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import cta from '../../assets/hero-1.jpg'

export default function CtaBanner() {
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <Image
        src={cta}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <p className="text-white text-xs md:text-xl tracking-[0.25em] uppercase mb-4">開始你的活動</p>
        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
          讓咖啡師成為你品牌<br />最有溫度的一面
        </h2>
        <Link
          href="/contact"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="inline-flex items-center gap-1.5 px-10 py-4 bg-brown text-white text-sm md:text-lg rounded-sm tracking-widest uppercase hover: transition-colors duration-200"
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
                <FiMessageCircle size={16} />
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
                <FiArrowRight size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </motion.div>
    </section>
  )
}
