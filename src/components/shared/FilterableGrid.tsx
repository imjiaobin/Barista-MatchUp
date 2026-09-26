'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

interface FilterableGridProps<T> {
  categories: readonly string[]
  items: T[]
  itemCategory: (item: T) => string
  itemKey: (item: T) => string
  gridClassName: string
  renderCard: (item: T, index: number) => React.ReactNode
  countLabel: (count: number) => string
}

// /events 和 /baristas 共用這個元件：兩者都是「分類篩選標籤 + 動畫卡片
// 網格」的頁面，差別只在卡片長什麼樣子——這部分交給呼叫端透過
// `renderCard` 自行決定。
export default function FilterableGrid<T>({
  categories, items, itemCategory, itemKey, gridClassName, renderCard, countLabel,
}: FilterableGridProps<T>) {
  const [active, setActive] = useState(categories[0])

  const filtered = active === categories[0] ? items : items.filter((item) => itemCategory(item) === active)

  return (
    <>
      {/* 篩選標籤 */}
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

      {/* 卡片網格 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={gridClassName}
            >
              {filtered.map((item, i) => (
                <motion.div key={itemKey(item)} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  {renderCard(item, i)}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-stone-400 text-sm mt-16"
          >
            {countLabel(filtered.length)}
          </motion.p>
        </div>
      </section>
    </>
  )
}
