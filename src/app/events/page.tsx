import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import EventsCta from '../../components/events/EventsCta'
import EventsGrid from '../../components/events/EventsGrid'
import EventsHero from '../../components/events/EventsHero'
import { db } from '../../db/client'
import { events } from '../../db/schema'
import { getPageContentMap } from '../../lib/actions/content'

export const metadata: Metadata = {
  title: '活動經歷 — Pourfolio',
  description: 'Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃。',
}

export default async function Events() {
  const [publishedEvents, content] = await Promise.all([
    db.select().from(events).where(eq(events.isPublished, true)).orderBy(desc(events.eventDate)),
    getPageContentMap('events'),
  ])

  return (
    <>
      <EventsHero
        label={content.hero_label ?? '活動故事'}
        headingLine1={content.hero_heading_line1 ?? '每一場活動，'}
        headingAccent={content.hero_heading_accent ?? '都值得被記住'}
        body={content.hero_body ?? '這裡蒐錄 Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃，記錄每一次咖啡與品牌相遇的時刻。'}
      />
      <EventsGrid events={publishedEvents} />
      <EventsCta />
    </>
  )
}
