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

export default function AboutContent({ storyParagraphs }: { storyParagraphs: string[] }) {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            品牌故事
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight max-w-2xl"
          >
            一杯咖啡，<br />
            <span className="text-brown italic">連結彼此</span>
          </motion.h1>
        </div>
      </section>

      {/* Story split */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-brown/60 to-indigo" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-olive/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <p className="section-label mb-6">我們的起點</p>
            {storyParagraphs.map((paragraph, i) => (
              <p key={i} className="text-stone-600 leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <p className="section-label mb-3">品牌核心</p>
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

      {/* Timeline */}
      <section className="py-24 px-6 bg-indigo text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <p className="section-label text-olive mb-3">我們的方向</p>
            <h2 className="text-3xl md:text-4xl font-light">每一步，都是一杯好咖啡的距離</h2>
          </motion.div>

          <div className="space-y-12">
            {[
              { year: '現在', event: '品牌正式啟動，建立咖啡師審核機制，開始接受媒合申請' },
              { year: '接下來', event: '完成首批精選咖啡師入駐，媒合服務全面開放' },
              { year: '未來', event: '推出品牌咖啡師常態合作方案，拓展至全台主要城市' },
              { year: '願景', event: '讓每一位優秀咖啡師都有屬於自己的 Pourfolio' },
            ].map(({ year, event }, i) => (
              <motion.div
                key={year}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-8 items-start"
              >
                <span className="text-olive text-lg font-light shrink-0 w-16">{year}</span>
                <div className="flex-1 border-t border-white/20 pt-4">
                  <p className="text-white/80 leading-relaxed">{event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
