'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export interface FounderContent {
  name: string
  role: string
  tag: string
  bio: string
}

const founderBackgrounds = [
  'linear-gradient(155deg, #607456 0%, #4E220F 100%)',
  'linear-gradient(155deg, #F7F1DE 0%, #4E220F 100%)',
]

const FOUNDER_SLANT = '56px'
const founderClipPaths = [
  `polygon(0 0, calc(100% - ${FOUNDER_SLANT}) 0, 100% 100%, 0 100%)`,
  `polygon(0 0, 100% 0, 100% 100%, ${FOUNDER_SLANT} 100%)`,
]

export default function FoundersSection({ founders }: { founders: FounderContent[] }) {
  const [hoveredFounder, setHoveredFounder] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="section-label mb-3 md:text-xl">創辦團隊</p>
            <h2 className="section-title">帶著職人經歷，<br /><span className="text-brown font-[20px]">打造</span> <span className="hover:text-indigo transition-all duration-200">Pourfolio</span></h2>
          </div>
          <Link
            href="/about"
            className="group flex items-center gap-2 text-sm md:text-lg md:font-[450] text-brown tracking-widest uppercase shrink-0"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">品牌故事</span>
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
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
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.15 } }}
                      exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
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
                <p className="text-brown text-sm md:text-md tracking-widest uppercase mb-3">{tag}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
