import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { db } from '../../../../db/client'
import { events } from '../../../../db/schema'
import { deleteEvent } from '../../../../lib/actions/events'
import { requireAdminSession } from '../../../../lib/session'

export default async function AdminEventsPage() {
  await requireAdminSession()

  const allEvents = await db.select().from(events).orderBy(desc(events.eventDate))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-stone-800">活動管理</h1>
        <Link href="/admin/events/new" className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
          <FiPlus size={14} /> 新增活動
        </Link>
      </div>

      <div className="bg-white border border-stone-200 divide-y divide-stone-100">
        {allEvents.length === 0 && (
          <p className="p-6 text-sm text-stone-400">目前沒有活動資料</p>
        )}
        {allEvents.map((event) => (
          <div key={event.id} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">
                {event.title}
                {!event.isPublished && <span className="ml-2 text-xs text-stone-400">（未發布）</span>}
              </p>
              <p className="text-xs text-stone-400 mt-1">{event.eventDate} · {event.location} · {event.category}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/admin/events/${event.id}/edit`} className="text-xs text-indigo hover:underline">
                編輯
              </Link>
              <form action={deleteEvent.bind(null, event.id)}>
                <button type="submit" className="text-xs text-red-500 hover:underline">刪除</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
