'use client'

import { motion } from 'framer-motion'
import { FiMail, FiInstagram } from 'react-icons/fi'
import ContactWizard from '../../components/contact/ContactWizard'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

export default function Contact() {
  return (
    <>
      {/* 頁首主視覺 */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            聯絡我們
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            告訴我們你的<br />
            <span className="text-indigo italic">活動故事</span>
          </motion.h1>
        </div>
      </section>

      {/* 表單 + 聯絡資訊 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16">
          {/* 聯絡資訊 */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
          >
            <p className="section-label mb-6">直接聯絡</p>
            <div className="flex flex-col gap-6 mb-12">
              <a href="mailto:hello@pourfolio.tw" className="flex items-center gap-3 text-stone-600 hover:text-brown transition-colors duration-200">
                <FiMail size={16} className="text-olive shrink-0" />
                <span className="text-sm">hello@pourfolio.tw</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-brown transition-colors duration-200">
                <FiInstagram size={16} className="text-olive shrink-0" />
                <span className="text-sm">@pourfolio.tw</span>
              </a>
            </div>

            <div className="border-t border-stone-200 pt-8">
              <p className="section-label mb-4">回覆時間</p>
              <p className="text-sm text-stone-500 leading-relaxed">
                我們通常在 <span className="text-brown font-medium">48 小時內</span>回覆所有詢問。<br />
                急件請直接 Email 標注「急件」。
              </p>
            </div>
          </motion.div>

          {/* 表單 */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="relative">
            <ContactWizard />
          </motion.div>
        </div>
      </section>
    </>
  )
}
