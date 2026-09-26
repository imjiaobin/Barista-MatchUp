'use client'

import { motion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

// 輕量的 client 包裝元件，讓需要抓資料的 Server Components（例如 async
// 頁面）也能套用專案標準的「淡入 + 上移」進場動畫，而不用自己標記
// 'use client'。
export default function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
