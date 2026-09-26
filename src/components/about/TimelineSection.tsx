'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

const milestones = [
  { year: '現在', event: '品牌正式啟動，建立咖啡師審核機制，開始接受媒合申請' },
  { year: '接下來', event: '完成首批精選咖啡師入駐，媒合服務全面開放' },
  { year: '未來', event: '推出品牌咖啡師常態合作方案，拓展至全台主要城市' },
  { year: '願景', event: '讓每一位優秀咖啡師都有屬於自己的 Pourfolio' },
]

export default function TimelineSection() {
  return (
    <section className="py-24 px-6 bg-olive text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="section-label text-cream mb-3">我們的方向</p>
          <h2 className="text-3xl md:text-4xl font-light">每一步，都是一杯好咖啡的距離</h2>
        </motion.div>

        <div className="space-y-12">
          {milestones.map(({ year, event }, i) => (
            <motion.div
              key={year}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-8 items-start"
            >
              <span className="text-cream text-lg font-light shrink-0 w-16">{year}</span>
              <div className="flex-1 border-t border-white/20 pt-4">
                <p className="text-white/80 leading-relaxed">{event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
