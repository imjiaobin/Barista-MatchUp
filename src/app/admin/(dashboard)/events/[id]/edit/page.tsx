import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import EventForm from '../../../../../../components/admin/EventForm'
import { db } from '../../../../../../db/client'
import { events } from '../../../../../../db/schema'
import { updateEvent } from '../../../../../../lib/actions/events'
import { requireAdminSession } from '../../../../../../lib/session'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession()
  const { id } = await params

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!event) notFound()

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">編輯活動</h1>
      <EventForm event={event} action={updateEvent.bind(null, id)} />
    </div>
  )
}
