'use client'

import ProcessSection from './ProcessSection'
import ServiceCards from './ServiceCards'
import ServicesCta from './ServicesCta'
import ServicesHero from './ServicesHero'

export default function ServicesContent() {
  return (
    <>
      <ServicesHero />
      <ServiceCards />
      <ProcessSection />
      <ServicesCta />
    </>
  )
}
