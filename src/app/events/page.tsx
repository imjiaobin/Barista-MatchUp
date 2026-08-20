'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

const categories = ['全部', '企業活動', '品牌快閃', '產品發表', '婚禮 / 私人派對']

// 範例資料，待補上實際歷屆活動內容後替換
const events = [
  {
    title: '新創品牌週年尾牙',
    date: '2024.12',
    location: '台北',
    cat: '企業活動',
    summary: '為科技新創團隊打造的年度尾牙咖啡吧，結合手沖與特調飲品站，串聯整場活動氣氛。',
    grad: 'from-brown/70 to-indigo',
  },
  {
    title: '香氛品牌期間限定店',
    date: '2024.09',
    location: '台中',
    cat: '品牌快閃',
    summary: '兩週快閃店期間常駐咖啡師，依香氛調性設計對應風味的特調飲品，強化品牌體驗記憶點。',
    grad: 'from-indigo/80 to-stone-700',
  },
  {
    title: '手作質感婚禮午茶',
    date: '2024.06',
    location: '台北',
    cat: '婚禮 / 私人派對',
    summary: '戶外證婚後的午茶時段，以手沖吧檯取代制式茶會，成為賓客最常提起的驚喜環節。',
    grad: 'from-olive/70 to-indigo',
  },
  {
    title: '3C 品牌新品發表會',
    date: '2024.03',
    location: '高雄',
    cat: '產品發表',
    summary: '媒合擅長拉花與視覺呈現的咖啡師，飲品造型與新品配色呼應，成為媒體拍攝焦點。',
    grad: 'from-stone-600 to-olive/80',
  },
  {
    title: '選物店期間限定咖啡吧',
    date: '2023.11',
    location: '台北',
    cat: '品牌快閃',
    summary: '與選物店合作的常態快閃咖啡吧，累積穩定回頭客群，後續延伸為長期合作方案。',
    grad: 'from-brown/50 to-olive',
  },
  {
    title: '企業內部教育訓練茶會',
    date: '2023.08',
    location: '新竹',
    cat: '企業活動',
    summary: '全天訓練課程中安排的咖啡休息時段，以輕鬆的沖煮體驗緩和高密度課程節奏。',
    grad: 'from-indigo/60 to-brown',
  },
]

export default function Events() {
  const [active, setActive] = useState('全部')

  const filtered = active === '全部' ? events : events.filter((e) => e.cat === active)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            活動故事
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight max-w-2xl"
          >
            每一場活動，<br />
            <span className="text-brown italic">都值得被記住</span>
          </motion.h1>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-stone-500 leading-relaxed max-w-md mt-8"
          >
            這裡蒐錄 Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃，記錄每一次咖啡與品牌相遇的時刻。
          </motion.p>
        </div>
      </section>

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
              {filtered.map(({ title, date, location, cat, summary, grad }, i) => (
                <motion.div
                  key={title}
                  custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className={`group relative aspect-[4/5] bg-gradient-to-b ${grad} overflow-hidden cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 tracking-wide">
                      {cat}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{date} · {location}</p>
                    <p className="text-white font-medium text-lg mb-2">{title}</p>
                    <p className="text-white/80 text-xs leading-relaxed overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300">
                      {summary}
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

      {/* CTA */}
      <section className="py-20 px-6 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="section-label mb-4">下一場，換你的品牌</p>
          <h2 className="section-title mb-4">讓我們一起策劃專屬活動</h2>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            告訴我們你的活動需求，我們會依風格與規模媒合最合適的咖啡師與方案。
          </p>
          <Link href="/contact" className="btn-primary">填寫需求表單</Link>
        </motion.div>
      </section>
    </>
  )
}
