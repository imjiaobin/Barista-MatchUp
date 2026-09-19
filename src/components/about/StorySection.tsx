'use client'

import { motion } from 'framer-motion'

export default function StorySection({ storyParagraphs }: { storyParagraphs: string[] }) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="aspect-[4/5] bg-gradient-to-br from-brown/60 to-indigo" />
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-olive/20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <p className="section-label text-indigo md:text-base mb-6">我們的起點</p>
          {storyParagraphs.map((paragraph, i) => (
            <p key={i} className="text-stone-600 leading-relaxed mb-6 last:mb-0">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
