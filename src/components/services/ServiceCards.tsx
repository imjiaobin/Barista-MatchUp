'use client'

import { motion } from 'framer-motion'
import { FiCoffee, FiUsers, FiStar, FiCalendar } from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

const services = [
  {
    icon: <FiUsers size={24} />,
    title: '咖啡師媒合',
    subtitle: 'Barista Matching',
    desc: '根據活動規模、風格、預算與日期，從嚴格審核的精選咖啡師中，配對最適合的人選。',
    features: ['風格偏好評估', '檔期即時查詢', '多輪媒合確認'],
  },
  {
    icon: <FiCalendar size={24} />,
    title: '活動企劃協力',
    subtitle: 'Event Planning',
    desc: '提供活動現場的咖啡吧設計、設備租賃建議、飲品菜單規劃，確保執行無虞。',
    features: ['場地動線建議', '設備清單規劃', '現場流程安排'],
  },
  {
    icon: <FiStar size={24} />,
    title: '品牌聯名策劃',
    subtitle: 'Brand Collaboration',
    desc: '將咖啡師的獨特風格與品牌活動深度融合，創造專屬紀念飲品與話題體驗。',
    features: ['專屬配方開發', '包裝視覺建議', '社群素材協作'],
  },
  {
    icon: <FiCoffee size={24} />,
    title: '常態合作方案',
    subtitle: 'Ongoing Partnership',
    desc: '適合有定期辦公室咖啡、週期性活動需求的企業，提供長期穩定的咖啡師資源。',
    features: ['季度方案規劃', '固定咖啡師配置', '優先排程保障'],
  },
]

export default function ServiceCards() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {services.map(({ icon, title, subtitle, desc, features }, i) => (
          <motion.div
            key={title}
            custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="p-10 border border-stone-200 hover:border-brown transition-colors duration-300 group"
          >
            <div className="text-olive mb-6 group-hover:scale-110 transition-transform duration-200 inline-block">
              {icon}
            </div>
            <p className="text-xs tracking-widest text-stone-400 uppercase mb-1">{subtitle}</p>
            <h3 className="text-xl font-medium text-stone-800 mb-4">{title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">{desc}</p>
            <ul className="flex flex-col gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                  <span className="w-1 h-1 rounded-full bg-olive inline-block" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
