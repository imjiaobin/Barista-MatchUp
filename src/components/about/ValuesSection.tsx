'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

const values = [
  { title: '專業', desc: '每位加入平台的咖啡師都經過嚴格審核，我們只媒合真正值得信賴的人選。' },
  { title: '精準', desc: '透過系統化的配對流程，讓活動風格與咖啡師的個性和專長高度契合。' },
  { title: '溫度', desc: '咖啡不只是飲品，是人與人之間最自然的連結媒介。' },
]

export default function ValuesSection() {
  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="section-label text-brown md:text-base mb-3">品牌核心</p>
          <h2 className="section-title">三個字，貫穿我們<br />所有的決策</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-1">
          {values.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-10"
            >
              <p className="text-6xl font-light text-stone-100 mb-6">0{i + 1}</p>
              <h3 className="text-2xl font-light text-indigo mb-4">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
