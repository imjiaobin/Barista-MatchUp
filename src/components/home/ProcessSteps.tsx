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
          <p className="section-label md:text-[18px] mb-3">媒合流程</p>
          <h2 className="section-title">四個步驟，一次完美的<br />咖啡師媒合體驗</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="flex md:gap-12">

              {/* Left: dot + connecting line (desktop only) */}
              <div className="hidden md:flex flex-col items-center w-20 shrink-0">
                {/* Top line segment — connects from previous dot (hidden on first) */}
                {i > 0
                  ? <div className="w-px h-[60px] bg-stone-200" />
                  : <div className="h-[60px]" />
                }
                <motion.div
                  className="w-4 h-4 rounded-full bg-[#f77754] shrink-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.2, type: 'spring' as const, stiffness: 380 }}
                />
                {/* Bottom line segment — hidden on last */}
                {i < steps.length - 1
                  ? <motion.div
                      className="w-px flex-1 bg-stone-200"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      style={{ transformOrigin: 'top' }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                    />
                  : <div className="flex-1" />
                }
              </div>

              {/* Right: step content */}
              <motion.div
                className={`flex-1 py-10 ${i < steps.length - 1 ? 'border-b border-stone-100' : ''}`}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18, duration: 0.4 }}
              >
                {/* Mobile indicator */}
                <div className="md:hidden w-8 h-8 rounded-full bg-brown flex items-center justify-center shrink-0 mb-3">
                  <span className="text-white text-xs font-semibold">{i + 1}</span>
                </div>
                <span className="hidden md:block text-xs md:text-lg text-brown tracking-[0.25em] uppercase mb-1">{num}</span>
                <h3 className="text-xl font-medium text-stone-800 mb-2">{title}</h3>
                <p className="text-sm md:text-md text-stone-500 leading-relaxed">{desc}</p>
              </motion.div>

            </div>
          ))}

          {/* Link row */}
          <div className="flex md:gap-12">
            <div className="hidden md:block w-20 shrink-0" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="pt-8"
            >
              <Link
                href="/services"
                className="flex items-center gap-2 text-sm md:text-md md:font-bold text-brown tracking-widest uppercase hover:gap-4 transition-all duration-200"
              >
                了解完整服務 <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
