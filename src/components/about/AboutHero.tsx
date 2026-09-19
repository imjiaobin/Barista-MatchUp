'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

export default function AboutHero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4 md:text-xl ">
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
  )
}
