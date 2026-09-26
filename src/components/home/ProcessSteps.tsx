'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const steps = [
  { num: '01', title: '填寫需求', desc: '告訴我們活動日期、規模、預算與風格，只需 3 分鐘。' },
  { num: '02', title: '討論細節', desc: '48 小時內，我們推薦 2–3 位最適合的咖啡師供你選擇。' },
  { num: '03', title: '確認合作', desc: '與咖啡師視訊溝通，確認風格、菜單與現場細節。' },
  { num: '04', title: '完美執行', desc: '活動當天，咖啡師準時到場，Pourfolio 全程支援協調。' },
]

export default function ProcessSteps() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="section-label text-brown md:text-xl mb-3">媒合流程</p>
          <h2 className="section-title">四個步驟，一次完美的<br />咖啡師媒合體驗</h2>
        </motion.div>

        {/* 桌面版：橫向排列 —— 圓點之間用一條線橫向貫穿整排 */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="flex flex-col items-center text-center">
                <motion.span
                  className="block text-lg font-[400] text-brown tracking-[0.25em] uppercase mb-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.2, duration: 0.4 }}
                >
                  {num}
                </motion.span>
                <motion.h3
                  className="text-xl text-stone-800 mb-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.2, duration: 0.4 }}
                >
                  {title}
                </motion.h3>
                <div className="flex items-center w-full mb-6">
                  <motion.div
                    className={`flex-1 h-px bg-stone-200 ${i === 0 ? 'invisible' : ''}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    style={{ transformOrigin: 'right' }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.2 }}
                  />
                  <motion.div
                    className="w-4 h-4 rounded-full bg-caramel shrink-0 mx-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.2, type: 'spring' as const, stiffness: 380 }}
                  />
                  <motion.div
                    className={`flex-1 h-px bg-stone-200 ${i === steps.length - 1 ? 'invisible' : ''}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    style={{ transformOrigin: 'left' }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                  />
                </div>
                <motion.div
                  className="px-6"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.18, duration: 0.4 }}
                >
                  <p className="text-md text-stone-500 leading-relaxed">{desc}</p>
                </motion.div>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="text-center mt-16"
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 font-[450] text-sm md:text-lg text-brown tracking-widest uppercase"
            >
              <span className="transition-transform  duration-200 group-hover:-translate-x-1">了解完整服務</span>
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* 手機版：垂直排列，維持原樣 */}
        <div className="md:hidden max-w-3xl mx-auto">
          {steps.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              className={`py-10 ${i < steps.length - 1 ? 'border-b border-stone-100' : ''}`}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.4 }}
            >
              <div className="w-8 h-8 rounded-full bg-caramel flex items-center justify-center shrink-0 mb-3">
                <span className="text-white text-xs ">{i + 1}</span>
              </div>
              <h3 className="text-xl text-stone-800 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="pt-8"
          >
            <Link
              href="/services"
              className="flex items-center gap-2 text-sm text-brown tracking-widest uppercase hover:gap-4 transition-all duration-200"
            >
              了解完整服務 <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
