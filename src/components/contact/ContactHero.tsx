'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

export default function ContactHero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label text-brown md:text-lg mb-4">
          聯絡我們
        </motion.p>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
        >
          告訴我們你的<br />
          <span className="text-caramel italic">活動故事</span>
        </motion.h1>
      </div>
    </section>
  )
}
