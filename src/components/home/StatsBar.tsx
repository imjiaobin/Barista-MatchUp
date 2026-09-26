'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '嚴選', label: '每位咖啡師皆審核把關' },
  { value: '48hr', label: '媒合回覆時效' },
  { value: '全台', label: '服務範圍' },
]

export default function StatsBar() {
  return (
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
            <p className="text-2xl md:text-3xl md:font-normal font-light text-olive tracking-tight">{value}</p>
            <p className="text-xs md:text-lg text-stone-400 tracking-widest uppercase mt-1">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
