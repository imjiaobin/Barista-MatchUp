'use client'

import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'

export default function SubmittedMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mb-6">
        <FiSend size={24} className="text-olive" />
      </div>
      <h3 className="text-2xl font-light text-stone-800 mb-3">已收到你的需求</h3>
      <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
        我們會在 48 小時內與你聯繫，提供適合的咖啡師推薦。
      </p>
    </motion.div>
  )
}
