import { desc } from 'drizzle-orm'
import SubmissionsTable from '../../../../components/admin/SubmissionsTable'
import { db } from '../../../../db/client'
import { contactSubmissions } from '../../../../db/schema'
import { requireAdminSession } from '../../../../lib/session'

export default async function AdminSubmissionsPage() {
  await requireAdminSession()

  const submissions = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt))

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">詢問表單紀錄</h1>
      <SubmissionsTable submissions={submissions} />
    </div>
  )
}
