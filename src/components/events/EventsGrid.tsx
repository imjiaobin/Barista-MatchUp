'use client'

import type { Event } from '../../db/schema'
import { EVENT_CATEGORIES, gradientClassName } from '../../lib/constants'
import FilterableGrid from '../shared/FilterableGrid'

const categories = ['全部', ...EVENT_CATEGORIES]

function formatDate(isoDate: string) {
  const [year, month] = isoDate.split('-')
  return `${year}.${month}`
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className={`group relative aspect-[4/5] bg-gradient-to-b ${gradientClassName(event.gradientPreset)} overflow-hidden cursor-pointer`}>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

      <div className="absolute top-4 left-4">
        <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 tracking-wide">
          {event.category}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{formatDate(event.eventDate)} · {event.location}</p>
        <p className="text-white font-medium text-lg mb-2">{event.title}</p>
        <p className="text-white/80 text-xs leading-relaxed overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300">
          {event.summary}
        </p>
      </div>
    </div>
  )
}

export default function EventsGrid({ events }: { events: Event[] }) {
  return (
    <FilterableGrid
      categories={categories}
      items={events}
      itemCategory={(event) => event.category}
      itemKey={(event) => event.id}
      gridClassName="grid grid-cols-1 md:grid-cols-3 gap-6"
      renderCard={(event) => <EventCard event={event} />}
      countLabel={(count) => `目前顯示 ${count} 場活動 · 持續更新中`}
    />
  )
}
