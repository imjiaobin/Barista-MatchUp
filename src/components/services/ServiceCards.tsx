'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCoffee, FiUsers, FiStar, FiCalendar } from 'react-icons/fi'

const services = [
  {
    icon: <FiUsers size={22} />,
    title: '咖啡師媒合',
    subtitle: 'Barista Matching',
    desc: '根據活動規模、風格、預算與日期，從嚴格審核的精選咖啡師中，配對最適合的人選。',
    features: ['風格偏好評估', '檔期即時查詢', '多輪媒合確認'],
  },
  {
    icon: <FiCalendar size={22} />,
    title: '活動企劃協力',
    subtitle: 'Event Planning',
    desc: '提供活動現場的咖啡吧設計、設備租賃建議、飲品菜單規劃，確保執行無虞。',
    features: ['場地動線建議', '設備清單規劃', '現場流程安排'],
  },
  {
    icon: <FiStar size={22} />,
    title: '品牌聯名策劃',
    subtitle: 'Brand Collaboration',
    desc: '將咖啡師的獨特風格與品牌活動深度融合，創造專屬紀念飲品與話題體驗。',
    features: ['專屬配方開發', '包裝視覺建議', '社群素材協作'],
  },
  {
    icon: <FiCoffee size={22} />,
    title: '常態合作方案',
    subtitle: 'Ongoing Partnership',
    desc: '適合有定期辦公室咖啡、週期性活動需求的企業，提供長期穩定的咖啡師資源。',
    features: ['季度方案規劃', '固定咖啡師配置', '優先排程保障'],
  },
]

export default function ServiceCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [enteredIndexes, setEnteredIndexes] = useState<Record<number, boolean>>({})

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {services.map(({ icon, title, subtitle, desc, features }, i) => {
          const isHovered = hoveredIndex === i
          const hasEntered = enteredIndexes[i] ?? false
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              onViewportEnter={() => {
                // 用 setTimeout 錯開每張卡片進場的時間，而不是靠 transition.delay——
                // 因為 delay 是綁在下面同一個 transition 上，hover 時也會共用到同一個
                // transition，若把 stagger delay 放在 transition 裡，hover 反而也會被
                // 延遲觸發。
                setTimeout(() => setEnteredIndexes((prev) => ({ ...prev, [i]: true })), i * 100)
              }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                opacity: hasEntered ? 1 : 0,
                y: hasEntered ? (isHovered ? -8 : 0) : 24,
                boxShadow: isHovered
                  ? '0 24px 48px -24px rgba(29, 22, 15, 0.25)'
                  : '0 0px 0px 0px rgba(29, 22, 15, 0)',
              }}
              transition={{ duration: hasEntered ? 0.25 : 0.4, ease: 'easeOut' }}
              className="relative overflow-hidden p-10 border-2 border-stone-200 hover:border-caramel transition-colors duration-300"
            >
              <motion.div
                animate={{
                  scale: isHovered ? 1.12 : 1,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-cream/50 text-caramel flex items-center justify-center"
              >
                {icon}
              </motion.div>

              <div className="relative pr-16">
                <p className="text-xs tracking-widest text-caramel uppercase mb-1">{subtitle}</p>
                <h3 className="text-xl font-medium text-espresso mb-4">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">{desc}</p>
                <ul className="flex flex-col gap-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-espresso">
                      <span className="w-1 h-1 rounded-full bg-espresso inline-block" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
