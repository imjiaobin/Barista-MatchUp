'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CtaBanner() {
  return (
    <section className="py-24 px-6 bg-brown">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-white/50 text-xs md:text-lg tracking-[0.25em] uppercase mb-4">開始你的活動</p>
        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
          讓咖啡師成為你品牌<br />最有溫度的一面
        </h2>
        <Link
          href="/contact"
          className="inline-block px-10 py-4 bg-white text-brown text-sm md:text-lg rounded-sm tracking-widest uppercase hover:bg-stone-50 transition-colors duration-200"
        >
          立即諮詢
        </Link>
      </motion.div>
    </section>
  )
}
