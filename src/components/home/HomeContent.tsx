'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import hero1 from '../../assets/hero-1.jpg'
import hero3 from '../../assets/hero-3.jpg'
import hero5 from '../../assets/hero-5.jpg'

export interface HeroSlideContent {
  tag: string
  line1: string
  line2: string
  body: string
}

export interface FounderContent {
  name: string
  role: string
  tag: string
  bio: string
}

const slideImages = [hero1, hero3, hero5]

const steps = [
  { num: '01', title: '填寫需求', desc: '告訴我們活動日期、規模、預算與風格，只需 3 分鐘。' },
  { num: '02', title: '討論細節', desc: '48 小時內，我們推薦 2–3 位最適合的咖啡師供你選擇。' },
  { num: '03', title: '確認合作', desc: '與咖啡師視訊溝通，確認風格、菜單與現場細節。' },
  { num: '04', title: '完美執行', desc: '活動當天，咖啡師準時到場，Pourfolio 全程支援協調。' },
]

const stats = [
  { value: '嚴選', label: '每位咖啡師皆審核把關' },
  { value: '48hr', label: '媒合回覆時效' },
  { value: '全台', label: '服務範圍' },
]

const founderBackgrounds = [
  'linear-gradient(155deg, #584b42 0%, #537d91 100%)',
  'linear-gradient(155deg, #a4d1c8 0%, #537d91 100%)',
]

const FOUNDER_SLANT = '56px'
const founderClipPaths = [
  `polygon(0 0, calc(100% - ${FOUNDER_SLANT}) 0, 100% 100%, 0 100%)`,
  `polygon(0 0, 100% 0, 100% 100%, ${FOUNDER_SLANT} 100%)`,
]

interface HomeContentProps {
  slides: HeroSlideContent[]
  founders: FounderContent[]
}

export default function HomeContent({ slides, founders }: HomeContentProps) {
  const [current, setCurrent] = useState(0)
  const [hoveredFounder, setHoveredFounder] = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <>
      {/* ── Hero Carousel ───────────────────────────────────────────── */}
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

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <section className="bg-stone-100 border-y border-stone-100 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-stone-200">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center py-4"
            >
              <p className="text-2xl md:text-3xl md:font-normal font-light text-brown tracking-tight">{value}</p>
              <p className="text-xs md:text-[14px] text-stone-400 tracking-widest uppercase mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Coffee Drip Flow Steps ──────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <p className="section-label md:text-[18px] mb-3">媒合流程</p>
            <h2 className="section-title">四個步驟，一次完美的<br />咖啡師媒合體驗</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="flex md:gap-12">

                {/* Left: dot + connecting line (desktop only) */}
                <div className="hidden md:flex flex-col items-center w-20 shrink-0">
                  {/* Top line segment — connects from previous dot (hidden on first) */}
                  {i > 0
                    ? <div className="w-px h-[60px] bg-stone-200" />
                    : <div className="h-[60px]" />
                  }
                  <motion.div
                    className="w-4 h-4 rounded-full bg-[#f77754] shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.2, type: 'spring' as const, stiffness: 380 }}
                  />
                  {/* Bottom line segment — hidden on last */}
                  {i < steps.length - 1
                    ? <motion.div
                        className="w-px flex-1 bg-stone-200"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        style={{ transformOrigin: 'top' }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                      />
                    : <div className="flex-1" />
                  }
                </div>

                {/* Right: step content */}
                <motion.div
                  className={`flex-1 py-10 ${i < steps.length - 1 ? 'border-b border-stone-100' : ''}`}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.18, duration: 0.4 }}
                >
                  {/* Mobile indicator */}
                  <div className="md:hidden w-8 h-8 rounded-full bg-brown flex items-center justify-center shrink-0 mb-3">
                    <span className="text-white text-xs font-semibold">{i + 1}</span>
                  </div>
                  <span className="hidden md:block text-xs md:text-lg text-brown tracking-[0.25em] uppercase mb-1">{num}</span>
                  <h3 className="text-xl font-medium text-stone-800 mb-2">{title}</h3>
                  <p className="text-sm md:text-md text-stone-500 leading-relaxed">{desc}</p>
                </motion.div>

              </div>
            ))}

            {/* Link row */}
            <div className="flex md:gap-12">
              <div className="hidden md:block w-20 shrink-0" />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="pt-8"
              >
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-sm md:text-md md:font-bold text-brown tracking-widest uppercase hover:gap-4 transition-all duration-200"
                >
                  了解完整服務 <FiArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founders ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <p className="section-label mb-3 md:text-lg">創辦團隊</p>
              <h2 className="section-title">帶著職人經歷，<br /><span className="text-brown font-[20px]">打造</span> <span className="hover:text-indigo transition-all duration-200">Pourfolio</span></h2>
            </div>
            <Link
              href="/about"
              className="flex items-center gap-2 text-sm md:text-md md:font-bold text-brown tracking-widest uppercase hover:gap-4 transition-all duration-200 shrink-0"
            >
              品牌故事 <FiArrowRight />
            </Link>
          </motion.div>

          {/* Desktop: complementary trapezoids with hover expand/compress */}
          <div className="hidden md:flex gap-[2px] h-[560px]">
            {founders.map(({ name, role, tag, bio }, i) => {
              const isHovered = hoveredFounder === i
              const isCompressed = hoveredFounder !== null && hoveredFounder !== i
              return (
                <div
                  key={name}
                  onMouseEnter={() => setHoveredFounder(i)}
                  onMouseLeave={() => setHoveredFounder(null)}
                  style={{
                    background: founderBackgrounds[i],
                    clipPath: founderClipPaths[i],
                    flexGrow: isHovered ? 3 : isCompressed ? 1 : 2,
                    flexBasis: 0,
                    minWidth: 0,
                    transition: 'flex-grow 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  className="relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-black/10" />

                  <motion.div
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.25 }}
                    className={`absolute bottom-0 left-0 right-0 py-8 pr-8 ${i === 1 ? 'pl-24' : 'pl-8'}`}
                  >
                    <p className="text-white font-medium text-xl whitespace-nowrap">{name}</p>
                    <p className="text-white/70 text-xs tracking-wide mt-1 whitespace-nowrap">{role}</p>
                  </motion.div>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className={`absolute inset-0 flex flex-col justify-end bg-black/25 py-8 pr-8 ${i === 1 ? 'pl-24' : 'pl-8'}`}
                      >
                        <p className="text-white font-medium text-xl mb-3">{name}</p>
                        <p className="text-white text-xs tracking-widest uppercase mb-3">{tag}</p>
                        <p className="text-white/85 text-sm leading-relaxed max-w-md">{bio}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Mobile: stacked cards, bio always visible (no hover on touch) */}
          <div className="md:hidden space-y-6">
            {founders.map(({ name, role, tag, bio }, i) => (
              <div key={name} className="bg-white">
                <div className="relative aspect-[16/9]" style={{ background: founderBackgrounds[i] }}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-medium text-lg">{name}</p>
                    <p className="text-white/70 text-xs tracking-wide">{role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-brown text-xs tracking-widest uppercase mb-3">{tag}</p>
                  <p className="text-sm text-stone-500 leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-brown">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-white/50 text-xs md:text-lg tracking-[0.25em] uppercase mb-4">開始你的活動</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
            讓咖啡師成為你品牌<br />最有溫度的一面
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-brown text-sm md:text-lg rounded-sm tracking-widest uppercase hover:bg-stone-50 transition-colors duration-200"
          >
            立即諮詢
          </Link>
        </motion.div>
      </section>
    </>
  )
}
