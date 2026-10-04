'use client'

import { motion } from 'framer-motion'
import contactHeroImg from '../../assets/hero-1.jpg'
import HeroImage from '../shared/HeroImage'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] items-stretch md:min-h-[480px]">
        <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label text-caramel md:text-lg mb-4">
            聯絡我們
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            告訴我們你的<br />
            <span className="text-caramel italic">活動故事</span>
          </motion.h1>
        </div>
        <HeroImage src={contactHeroImg} alt="手沖咖啡器具特寫" priority />
      </div>
    </section>
  )
}
