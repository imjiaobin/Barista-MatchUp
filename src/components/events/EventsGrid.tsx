'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Event } from '../../db/schema'
import { EVENT_CATEGORIES, gradientClassName } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

const categories = ['全部', ...EVENT_CATEGORIES]

function formatDate(isoDate: string) {
  const [year, month] = isoDate.split('-')
  return `${year}.${month}`
}

export default function EventsGrid({ events }: { events: Event[] }) {
  const [active, setActive] = useState('全部')

  const filtered = active === '全部' ? events : events.filter((e) => e.category === active)

  return (
    <>
      {/* Filter */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 px-5 py-2 text-xs tracking-widest uppercase transition-all duration-200 ${
                active === cat
                  ? 'bg-indigo text-white'
                  : 'border border-stone-200 text-stone-500 hover:border-brown hover:text-brown'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className={`group relative aspect-[4/5] bg-gradient-to-b ${gradientClassName(event.gradientPreset)} overflow-hidden cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 tracking-wide">
                      {event.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{formatDate(event.eventDate)} · {event.location}</p>
                    <p className="text-white font-medium text-lg mb-2">{event.title}</p>
                    <p className="text-white/80 text-xs leading-relaxed overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300">
                      {event.summary}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-stone-400 text-sm mt-16"
          >
            目前顯示 {filtered.length} 場活動 · 持續更新中
          </motion.p>
        </div>
      </section>
    </>
  )
}
