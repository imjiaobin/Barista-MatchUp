'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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

const process = [
  { step: '01', title: '填寫需求表單', desc: '告訴我們活動日期、規模、風格與預算。' },
  { step: '02', title: '媒合推薦', desc: '我們在 48 小時內提供 2–3 位適合的咖啡師。' },
  { step: '03', title: '確認配對', desc: '與咖啡師進行視訊溝通，確認合作細節。' },
  { step: '04', title: '活動執行', desc: '咖啡師準時到場，Pourfolio 全程支援協調。' },
]

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            服務項目
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            從媒合到落地，<br />
            <span className="text-olive italic">一站到位</span>
          </motion.h1>
        </div>
      </section>

      {/* Service cards */}
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

      {/* Process */}
      <section className="py-24 px-6 bg-indigo">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <p className="section-label text-olive mb-3">合作流程</p>
            <h2 className="text-3xl md:text-4xl font-light text-white">四個步驟，完成你的<br />完美咖啡活動</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-white/10 -translate-y-1/2" />
                )}
                <p className="text-5xl font-light text-white/20 mb-4">{step}</p>
                <h3 className="text-white font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
        >
          <p className="section-label mb-4">準備好了嗎？</p>
          <h2 className="section-title mb-8">開始你的第一次媒合</h2>
          <Link href="/contact" className="btn-primary">填寫需求表單</Link>
        </motion.div>
      </section>
    </>
  )
}
