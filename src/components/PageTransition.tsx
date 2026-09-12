'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

const SWEEP = { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const }
// Small hold once the curtain is fully covering, before it starts sweeping
// away again — a brief pause so the uncover doesn't feel instantaneous.
const REVEAL_HOLD = 0.1
// Most pages animate their above-the-fold content on mount (`initial` +
// `animate`, not `whileInView`), so by the time the curtain finishes
// covering + holding, that animation has usually already finished playing
// *underneath* the still-covering curtain — there'd be nothing left to see
// once revealed. To make the page's entrance actually happen after the
// transition (per the user's request), PageTransition owns a second fade
// for `children` itself: hidden the instant a new page mounts (still fully
// covered, so invisible), then faded in only once the curtain has fully
// cleared.
const CONTENT_ENTER = { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const }

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const curtain = useAnimationControls()
  const content = useAnimationControls()
  // Tracks the last pathname we've already reacted to. Comparing values
  // (rather than a one-shot boolean flag) survives React StrictMode's
  // deliberate double-invocation of effects in dev — a boolean flag gets
  // flipped by the first invocation and misreads the second as a real
  // route change, incorrectly playing the curtain on first load.
  const prevPathname = useRef(pathname)
  const pendingHref = useRef<string | null>(null)
  // Guards against rapid double/triple-clicks on different links: without
  // this, each click retargets the same shared animation and their .then()
  // callbacks can resolve out of order, navigating to the wrong href. While
  // a transition is in flight, further clicks are ignored outright rather
  // than queued — simplest fix, and good enough for real usage patterns.
  const isTransitioning = useRef(false)

  // Intercept clicks on internal links so the curtain can fully cover the
  // screen BEFORE the route actually changes — otherwise Next.js swaps the
  // page immediately and the new page's own entrance animations start
  // racing underneath the still-covering curtain instead of playing once
  // it's revealed.
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
        // A transition is already in flight — swallow the click rather than
        // let it navigate normally (which would skip the curtain) or race
        // the in-progress one.
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Must win the race against Next.js's own Link click handler, which
      // React attaches via event delegation and would otherwise navigate
      // immediately. Capturing on document — the outermost point in the
      // capture phase — guarantees this fires first. We only preventDefault
      // (not stopPropagation): Link's own handler runs the caller's onClick
      // first and then bails out once it sees e.defaultPrevented, so plain
      // preventDefault is enough to cancel Link's navigation while letting
      // the click still bubble normally — e.g. so a nav link's onClick that
      // closes a mobile menu still fires.
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

  // Once the route has actually changed (new page mounted underneath the
  // still-covering curtain), sweep it up and off to reveal it.
  useLayoutEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    pendingHref.current = null
    // Hide the new page instantly — it's still fully covered, so there's
    // nothing visible to jump. Its own mount-triggered entrance animations
    // keep playing underneath, invisibly, and will typically have already
    // finished by the time the curtain clears below.
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
