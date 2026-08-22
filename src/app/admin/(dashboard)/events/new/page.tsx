import EventForm from '../../../../../components/admin/EventForm'
import { createEvent } from '../../../../../lib/actions/events'
import { requireAdminSession } from '../../../../../lib/session'

export default async function NewEventPage() {
  await requireAdminSession()

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">新增活動</h1>
      <EventForm action={createEvent} />
    </div>
  )
}
