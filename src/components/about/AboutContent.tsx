'use client'

import AboutHero from './AboutHero'
import StorySection from './StorySection'
import TimelineSection from './TimelineSection'
import ValuesSection from './ValuesSection'

export default function AboutContent({ storyParagraphs }: { storyParagraphs: string[] }) {
  return (
    <>
      <AboutHero />
      <StorySection storyParagraphs={storyParagraphs} />
      <ValuesSection />
      <TimelineSection />
    </>
  )
}
