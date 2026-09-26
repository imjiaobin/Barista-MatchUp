'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

const SWEEP = { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const }
// 遮罩完全蓋滿畫面後稍微停留一下，再開始往回掃開
// —— 短暫停頓一下，避免掀開的動作感覺太過瞬間。
const REVEAL_HOLD = 0.1 
// 大部分頁面上半部的內容進場動畫是在掛載時觸發（用 `initial` +
// `animate`，不是 `whileInView`），所以等遮罩蓋滿 + 停留結束時，
// 那個動畫通常早就已經在還蓋著的遮罩底下播完了 —— 等遮罩掀開後
// 反而什麼進場效果都看不到。為了讓頁面的進場動畫真的在轉場結束後
// 才發生（依照使用者的需求），PageTransition 自己額外管理一層
// `children` 的淡入：新頁面一掛載就先隱藏（此時遮罩還蓋著，反正也看不到），
// 等遮罩完全掀開後才淡入。
const CONTENT_ENTER = { duration: 1.0, ease: [0.76, 0, 0.24, 1] as const }

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const curtain = useAnimationControls()
  const content = useAnimationControls()
  // 記錄上一個已經處理過的路徑。用「比對數值」而不是一次性的布林值旗標，
  // 是為了撐過 React StrictMode 在開發模式下刻意把 effect 執行兩次的狀況——
  // 用布林值旗標的話，第一次執行就會被翻轉，導致第二次執行被誤判為真的換頁，
  // 在第一次載入頁面時就錯誤地播放了遮罩動畫。
  const prevPathname = useRef(pathname)
  const pendingHref = useRef<string | null>(null)
  // 用來防止快速連續點擊不同連結：如果沒有這個判斷，每次點擊都會
  // 重新指定同一個共用動畫，導致它們的 .then() callback 可能不照順序
  // 完成，跑去錯誤的網址。轉場動畫進行中時，後續的點擊會直接被忽略，
  // 而不是排隊等待 —— 這是最簡單的做法，對實際使用情境來說已經足夠。
  const isTransitioning = useRef(false)

  // 攔截站內連結的點擊事件，讓遮罩能在路由真正切換「之前」先完全蓋滿畫面 ——
  // 不然 Next.js 會立刻換頁，新頁面自己的進場動畫就會在遮罩還蓋著的
  // 時候搶跑，而不是等遮罩掀開後才播放。
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      if (link.target === '_blank' || link.hasAttribute('download')) return
      if (href === pathname) return
      if (isTransitioning.current) {
        // 已經有一個轉場動畫正在進行 —— 直接吞掉這次點擊，
        // 而不是讓它照正常方式換頁（那樣會跳過遮罩），
        // 或跟現在進行中的轉場互相搶跑。
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // 必須搶在 Next.js 自己的 Link 點擊處理器之前執行 —— React 是透過
      // 事件委派（event delegation）掛上這個處理器的，不然它會立刻換頁。
      // 在 document 上用 capture 階段監聽 —— 也就是 capture phase 最外層的
      // 起點 —— 才能保證這個函式一定最先執行。這裡只呼叫 preventDefault
      //（不呼叫 stopPropagation）：Link 自己的處理器會先執行呼叫者的 onClick，
      // 之後才檢查 e.defaultPrevented 並中止換頁，所以單純 preventDefault
      // 就足以取消 Link 的導頁行為，同時讓點擊事件照常往上冒泡 —— 例如
      // 讓 nav 連結裡「點擊後關閉手機版選單」的 onClick 還是能正常執行。
      e.preventDefault()
      isTransitioning.current = true
      pendingHref.current = href
      curtain.start({ y: '0%', transition: SWEEP }).then(() => {
        if (pendingHref.current) router.push(pendingHref.current)
      })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname, curtain, router])

  // 等路由真正切換完成（新頁面已經掛載在還蓋著的遮罩底下），
  // 就把遮罩往上掃開、移出畫面來揭露新頁面。
  useLayoutEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    pendingHref.current = null
    // 立刻把新頁面隱藏起來 —— 反正這時候還被遮罩完全蓋住，看不到任何
    // 跳動的畫面。它自己在掛載時觸發的進場動畫還是會在底下繼續播放，
    // 只是看不見，通常等遮罩掀開時也早就播完了。
    content.set({ opacity: 0, y: 16 })
    curtain.start({ y: '-101%', transition: { ...SWEEP, delay: REVEAL_HOLD } }).then(() => {
      curtain.set({ y: '101%' })
      isTransitioning.current = false
      content.start({ opacity: 1, y: 0, transition: CONTENT_ENTER })
    })
  }, [pathname, curtain, content])

  return (
    <>
      <motion.div initial={false} animate={content}>
        {children}
      </motion.div>
      <motion.div
        className="fixed inset-0 z-[100] bg-brown pointer-events-none"
        initial={{ y: '101%' }}
        animate={curtain}
      />
    </>
  )
}
