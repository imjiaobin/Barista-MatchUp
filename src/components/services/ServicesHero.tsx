'use client'

import { motion } from 'framer-motion'
import servicesHeroImg from '../../assets/hero-4.jpg'
import HeroImage from '../shared/HeroImage'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

interface ServicesHeroProps {
  label: string
  headingLine1: string
  headingAccent: string
}

export default function ServicesHero({ label, headingLine1, headingAccent }: ServicesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] items-stretch md:min-h-[480px]">
        <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4 text-caramel md:text-xl">
            {label}
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            {headingLine1}<br />
            <span className="text-caramel italic">{headingAccent}</span>
          </motion.h1>
        </div>
        <HeroImage src={servicesHeroImg} alt="咖啡師現場手沖示範" priority />
      </div>
    </section>
  )
}
