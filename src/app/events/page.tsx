import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import EventsGrid from '../../components/events/EventsGrid'
import FadeIn from '../../components/FadeIn'
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
      {/* 頁首主視覺 */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="section-label mb-4">活動故事</p>
            <h1 className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight max-w-2xl">
              每一場活動，<br />
              <span className="text-brown italic">都值得被記住</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-stone-500 leading-relaxed max-w-md mt-8">
              這裡蒐錄 Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃，記錄每一次咖啡與品牌相遇的時刻。
            </p>
          </FadeIn>
        </div>
      </section>

      <EventsGrid events={publishedEvents} />

      {/* 行動呼籲區塊 */}
      <section className="py-20 px-6 bg-stone-50">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-4">下一場，換你的品牌</p>
          <h2 className="section-title mb-4">讓我們一起策劃專屬活動</h2>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            告訴我們你的活動需求，我們會依風格與規模媒合最合適的咖啡師與方案。
          </p>
          <Link href="/contact" className="btn-primary">填寫需求表單</Link>
        </FadeIn>
      </section>
    </>
  )
}
