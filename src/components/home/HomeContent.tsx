'use client'

import CtaBanner from './CtaBanner'
import FoundersSection, { type FounderContent } from './FoundersSection'
import HeroCarousel, { type HeroSlideContent } from './HeroCarousel'
import ProcessSteps from './ProcessSteps'
import StatsBar from './StatsBar'

export type { FounderContent, HeroSlideContent }

interface HomeContentProps {
  slides: HeroSlideContent[]
  founders: FounderContent[]
}

export default function HomeContent({ slides, founders }: HomeContentProps) {
  return (
    <>
      <HeroCarousel slides={slides} />
      <ProcessSteps />
      <FoundersSection founders={founders} />
      <CtaBanner />
      <StatsBar />
    </>
  )
}
