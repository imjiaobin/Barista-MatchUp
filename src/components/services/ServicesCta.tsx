'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ServicesCta() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.4 }}
      >
        <p className="section-label mb-4">準備好了嗎？</p>
        <h2 className="section-title mb-8">開始你的第一次媒合</h2>
        <Link href="/contact" className="btn-primary">填寫需求表單</Link>
      </motion.div>
    </section>
  )
}
