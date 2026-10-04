'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

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

interface ProcessSectionProps {
  label: string
  headingLine1: string
  headingLine2: string
  ctaText: string
}

export default function ProcessSection({ label, headingLine1, headingLine2, ctaText }: ProcessSectionProps) {
  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-16"
        >
          <div>
            <p className="section-label text-caramel mb-3 md:text-lg">{label}</p>
            <h2 className="text-3xl md:text-4xl font-light text-espresso">{headingLine1}<br />{headingLine2}</h2>
          </div>
          <Link
            href="/contact"
            className="group flex items-center gap-2 text-sm text-caramel md:text-lg md:font-[450] tracking-widest uppercase shrink-0"
          >
            <span className=" transition-transform duration-200 group-hover:-translate-x-1">{ctaText}</span>
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
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
                <div className="hidden md:block absolute top-0 left-full h-full w-px bg-caramel/10 translate-x-4" />
              )}
              <p className="text-5xl font-light text-mocha mb-4">{step}</p>
              <h3 className="text-espresso font-medium mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
