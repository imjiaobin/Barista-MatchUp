'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

const process = [
  { step: '01', title: '填寫需求表單', desc: '告訴我們活動日期、規模、風格與預算。' },
  { step: '02', title: '媒合推薦', desc: '我們在 48 小時內提供 2–3 位適合的咖啡師。' },
  { step: '03', title: '確認配對', desc: '與咖啡師進行視訊溝通，確認合作細節。' },
  { step: '04', title: '活動執行', desc: '咖啡師準時到場，Pourfolio 全程支援協調。' },
]

export default function ProcessSection() {
  return (
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
  )
}
