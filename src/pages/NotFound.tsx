import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-cream overflow-hidden">
      {/* Large 404 background text */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute text-[20vw] font-light text-stone-100 select-none pointer-events-none leading-none"
      >
        404
      </motion.div>

      <div className="relative text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          {/* Spilled coffee cup illustration */}
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brown/30 to-brown/10 border border-brown/20" />
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: -30 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
              className="absolute inset-4 rounded-full bg-gradient-to-br from-brown to-stone-700 flex items-center justify-center"
            >
              <span className="text-3xl">☕</span>
            </motion.div>
            {/* Spill drops */}
            {[{ top: '70%', left: '60%', size: 'w-3 h-3', delay: 0.6 },
              { top: '80%', left: '75%', size: 'w-2 h-2', delay: 0.7 },
              { top: '90%', left: '65%', size: 'w-1.5 h-1.5', delay: 0.8 }].map((drop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: drop.delay }}
                className={`absolute ${drop.size} rounded-full bg-brown/40`}
                style={{ top: drop.top, left: drop.left }}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="section-label mb-4"
        >
          找不到這位咖啡師
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-3xl font-light text-stone-800 mb-4"
        >
          這杯咖啡<br />似乎打翻了
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-stone-500 text-sm leading-relaxed mb-10"
        >
          你所找的頁面不存在，或已移至其他位置。<br />
          讓我們帶你回到正確的地方。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/" className="btn-primary">回到首頁</Link>
          <Link to="/contact" className="btn-outline">聯絡我們</Link>
        </motion.div>
      </div>
    </section>
  )
}
