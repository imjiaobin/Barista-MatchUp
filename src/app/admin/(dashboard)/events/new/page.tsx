import EventForm from '../../../../../components/admin/EventForm'
import { PageHeader } from '../../../../../components/admin/ui/PageHeader'
import { createEvent } from '../../../../../lib/actions/events'
import { requireAdminSession } from '../../../../../lib/session'

// 模板 5.3：表單頁（新增）。編輯頁同結構，傳入 event 與 updateEvent.bind(null, id)。
export default async function NewEventPage() {
  await requireAdminSession()
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: '活動', href: '/admin/events' }, { label: '新增活動' }]}
        title="新增活動"
      />
      <EventForm action={createEvent} />
    </>
  )
}
