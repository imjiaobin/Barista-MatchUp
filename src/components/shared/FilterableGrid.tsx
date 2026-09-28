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
  // 選填：開啟後篩選標籤可以多選（categories[0]，通常是「全部」，變成
  // 「清空所有已選標籤」的按鈕）。預設關閉，維持原本單選的行為，
  // 這樣共用這個元件的 /baristas 頁面不會被連動影響。
  multiSelect?: boolean
}

// /events 和 /baristas 共用這個元件：兩者都是「分類篩選標籤 + 動畫卡片
// 網格」的頁面，差別只在卡片長什麼樣子——這部分交給呼叫端透過
// `renderCard` 自行決定。
export default function FilterableGrid<T>({
  categories, items, itemCategory, itemKey, gridClassName, renderCard, countLabel, multiSelect = false,
}: FilterableGridProps<T>) {
  const allLabel = categories[0]
  const [active, setActive] = useState(allLabel)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleTag = (cat: string) => {
    if (cat === allLabel) {
      setSelected(new Set())
      return
    }
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const isActive = (cat: string) =>
    multiSelect ? (cat === allLabel ? selected.size === 0 : selected.has(cat)) : active === cat

  const filtered = multiSelect
    ? selected.size === 0 ? items : items.filter((item) => selected.has(itemCategory(item)))
    : active === allLabel ? items : items.filter((item) => itemCategory(item) === active)

  // AnimatePresence 用這個 key 判斷篩選結果是否變動，多選時用已選標籤
  // 排序後拼成字串，單選時直接用 active 分類名稱。
  const animKey = multiSelect ? Array.from(selected).sort().join(',') : active

  return (
    <>
      {/* 篩選標籤 */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => (multiSelect ? toggleTag(cat) : setActive(cat))}
              className={`shrink-0 px-5 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-200 ${
                isActive(cat)
                  ? 'bg-brown text-white'
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
              key={animKey}
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
