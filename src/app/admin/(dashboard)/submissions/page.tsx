import { and, desc, eq, gte, lte } from 'drizzle-orm'
import Link from 'next/link'
import SubmissionsTable from '../../../../components/admin/SubmissionsTable'
import { db } from '../../../../db/client'
import { contactSubmissions } from '../../../../db/schema'
import {
  CONTACT_SUBMISSION_STATUS_LABELS,
  CONTACT_SUBMISSION_STATUSES,
  INQUIRY_EVENT_TYPES,
  TAIWAN_CITIES,
  type ContactSubmissionStatus,
} from '../../../../lib/constants'
import { requireAdminSession } from '../../../../lib/session'

interface SubmissionFilters {
  status?: string
  eventType?: string
  eventCity?: string
  dateFrom?: string
  dateTo?: string
}

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: Promise<SubmissionFilters> }) {
  await requireAdminSession()
  const { status, eventType, eventCity, dateFrom, dateTo } = await searchParams

  const filters = []
  if (status && CONTACT_SUBMISSION_STATUSES.includes(status as ContactSubmissionStatus)) {
    filters.push(eq(contactSubmissions.status, status))
  }
  if (eventType) filters.push(eq(contactSubmissions.eventType, eventType))
  if (eventCity) filters.push(eq(contactSubmissions.eventCity, eventCity))
  if (dateFrom) filters.push(gte(contactSubmissions.createdAt, new Date(dateFrom)))
  if (dateTo) filters.push(lte(contactSubmissions.createdAt, new Date(`${dateTo}T23:59:59`)))

  const submissions = filters.length > 0
    ? await db.select().from(contactSubmissions).where(and(...filters)).orderBy(desc(contactSubmissions.createdAt))
    : await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt))

  const hasFilters = Boolean(status || eventType || eventCity || dateFrom || dateTo)

  const exportQuery = new URLSearchParams()
  if (status) exportQuery.set('status', status)
  if (eventType) exportQuery.set('eventType', eventType)
  if (eventCity) exportQuery.set('eventCity', eventCity)
  if (dateFrom) exportQuery.set('dateFrom', dateFrom)
  if (dateTo) exportQuery.set('dateTo', dateTo)
  const exportHref = `/admin/submissions/export${exportQuery.size > 0 ? `?${exportQuery}` : ''}`

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-light text-stone-800">詢問表單紀錄</h1>
        <a
          href={exportHref}
          className="text-sm border border-stone-200 px-4 py-2 hover:border-caramel hover:text-caramel transition-colors duration-200"
        >
          匯出 CSV
        </a>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-4 mb-6 bg-white border border-stone-200 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">狀態</label>
          <select name="status" defaultValue={status ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white">
            <option value="">全部</option>
            {CONTACT_SUBMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>{CONTACT_SUBMISSION_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">活動類型</label>
          <select name="eventType" defaultValue={eventType ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white">
            <option value="">全部</option>
            {INQUIRY_EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">城市</label>
          <select name="eventCity" defaultValue={eventCity ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white">
            <option value="">全部</option>
            {TAIWAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">送出日期（起）</label>
          <input type="date" name="dateFrom" defaultValue={dateFrom ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">送出日期（迄）</label>
          <input type="date" name="dateTo" defaultValue={dateTo ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white" />
        </div>
        <button type="submit" className="bg-caramel text-white px-4 py-2 text-sm">套用篩選</button>
        {hasFilters && (
          <Link href="/admin/submissions" className="text-sm text-stone-400 hover:text-caramel transition-colors duration-200">
            清除篩選
          </Link>
        )}
      </form>

      <SubmissionsTable submissions={submissions} />
    </div>
  )
}
