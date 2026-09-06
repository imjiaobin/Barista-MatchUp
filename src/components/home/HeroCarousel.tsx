'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import hero1 from '../../assets/hero-1.jpg'
import hero3 from '../../assets/hero-3.jpg'
import hero5 from '../../assets/hero-5.jpg'

export interface HeroSlideContent {
  tag: string
  line1: string
  line2: string
  body: string
}

const slideImages = [hero1, hero3, hero5]

export default function HeroCarousel({ slides }: { slides: HeroSlideContent[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-white flex flex-col justify-center overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 items-stretch min-h-[calc(100vh-4rem)]">

        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <p className="section-label md:text-[16px] mb-6">{slides[current].tag}</p>
              <h1 className="text-5xl md:text-7xl font-light text-stone-900 leading-[1.05] tracking-tight mb-8">
                {slides[current].line1}<br />
                <span className="text-brown">{slides[current].line2}</span>
              </h1>
              <p className="text-stone-500 text-s md:text-lg leading-relaxed max-w-md mb-10">
                {slides[current].body.split('，')[0]}，
                <br className="md:hidden" />
                {slides[current].body.slice(slides[current].body.indexOf('，') + 1)}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">立即諮詢</Link>
                <Link href="/events" className="btn-outline">查看活動經歷</Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="flex items-center gap-4 mt-14">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-brown' : 'w-4 bg-stone-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={prev}
                className="w-9 h-9 border border-stone-200 hover:border-brown flex items-center justify-center transition-colors duration-200 text-stone-400 hover:text-brown"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 border border-stone-200 hover:border-brown flex items-center justify-center transition-colors duration-200 text-stone-400 hover:text-brown"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Image / carousel slide side — desktop: grid column, mobile: absolute background */}
        <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={slideImages[current]}
                  alt={slides[current].tag}
                  fill
                  priority={current === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              {/* Subtle dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/15" />
              {/* Mobile: fade image into white text area */}
              <div className="md:hidden absolute inset-0 bg-gradient-to-r from-white from-[55%] to-white/10" />

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
