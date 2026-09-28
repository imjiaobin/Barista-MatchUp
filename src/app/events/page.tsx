import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import EventsCta from '../../components/events/EventsCta'
import EventsGrid from '../../components/events/EventsGrid'
import EventsHero from '../../components/events/EventsHero'
import { db } from '../../db/client'
import { events } from '../../db/schema'

export const metadata: Metadata = {
  title: '活動經歷 — Pourfolio',
  description: 'Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃。',
}

export default async function Events() {
  const publishedEvents = await db
    .select()
    .from(events)
    .where(eq(events.isPublished, true))
    .orderBy(desc(events.eventDate))

  return (
    <>
      <EventsHero />
      <EventsGrid events={publishedEvents} />
      <EventsCta />
    </>
  )
}
