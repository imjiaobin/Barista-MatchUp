import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import EventForm from '../../../../../../components/admin/EventForm'
import { PageHeader } from '../../../../../../components/admin/ui/PageHeader'
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
    <>
      <PageHeader
        breadcrumbs={[{ label: '活動', href: '/admin/events' }, { label: event.title }]}
        title="編輯活動"
      />
      <EventForm event={event} action={updateEvent.bind(null, id)} />
    </>
  )
}
