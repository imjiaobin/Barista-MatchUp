import { and, count, desc, eq, gte, lte, type SQL } from 'drizzle-orm'
import Link from 'next/link'
import { FiDownload, FiInbox } from 'react-icons/fi'
import SubmissionsTable from '../../../../components/admin/SubmissionsTable'
import { buttonClass, ButtonLink, Button } from '../../../../components/admin/ui/Button'
import { Card } from '../../../../components/admin/ui/Card'
import { EmptyState } from '../../../../components/admin/ui/EmptyState'
import { Field, Input, Select } from '../../../../components/admin/ui/Field'
import { PageHeader } from '../../../../components/admin/ui/PageHeader'
import { Pagination } from '../../../../components/admin/ui/Table'
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

// 模板 5.1：列表頁。篩選條件放在 URL 上，匯出 CSV 沿用同一組條件。
const PAGE_SIZE = 20

interface SubmissionFilters {
  status?: string
  eventType?: string
  eventCity?: string
  dateFrom?: string
  dateTo?: string
  page?: string
}

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: Promise<SubmissionFilters> }) {
  await requireAdminSession()
  const { status, eventType, eventCity, dateFrom, dateTo, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const filters: SQL[] = []
  if (status && CONTACT_SUBMISSION_STATUSES.includes(status as ContactSubmissionStatus)) {
    filters.push(eq(contactSubmissions.status, status))
  }
  if (eventType) filters.push(eq(contactSubmissions.eventType, eventType))
  if (eventCity) filters.push(eq(contactSubmissions.eventCity, eventCity))
  if (dateFrom) filters.push(gte(contactSubmissions.createdAt, new Date(dateFrom)))
  if (dateTo) filters.push(lte(contactSubmissions.createdAt, new Date(`${dateTo}T23:59:59`)))
  const where = filters.length > 0 ? and(...filters) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(contactSubmissions).where(where).orderBy(desc(contactSubmissions.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(contactSubmissions).where(where),
  ])

  const hasFilters = Boolean(status || eventType || eventCity || dateFrom || dateTo)
  const filterParams = { status, eventType, eventCity, dateFrom, dateTo }

  const exportQuery = new URLSearchParams()
  for (const [k, v] of Object.entries(filterParams)) {
    if (v) exportQuery.set(k, v)
  }
  const exportHref = `/admin/submissions/export${exportQuery.size > 0 ? `?${exportQuery}` : ''}`

  return (
    <>
      <PageHeader
        title="詢問表單"
        description={`共 ${total} 筆`}
        actions={
          // 下載用原生連結：CSV 是 Route Handler 回傳的附件，不走 Next 的頁面導覽
          <a href={exportHref} className={buttonClass({ variant: 'secondary' })}>
            <FiDownload size={16} aria-hidden />匯出 CSV
          </a>
        }
      />

      <Card>
        <form method="get" className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3.5">
          <Field label="狀態" htmlFor="f-status" className="w-36">
            <Select id="f-status" name="status" defaultValue={status ?? ''}>
              <option value="">全部</option>
              {CONTACT_SUBMISSION_STATUSES.map((s) => (
                <option key={s} value={s}>{CONTACT_SUBMISSION_STATUS_LABELS[s]}</option>
              ))}
            </Select>
          </Field>
          <Field label="活動類型" htmlFor="f-eventType" className="w-40">
            <Select id="f-eventType" name="eventType" defaultValue={eventType ?? ''}>
              <option value="">全部</option>
              {INQUIRY_EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="城市" htmlFor="f-eventCity" className="w-32">
            <Select id="f-eventCity" name="eventCity" defaultValue={eventCity ?? ''}>
              <option value="">全部</option>
              {TAIWAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="送出日期（起）" htmlFor="f-dateFrom">
            <Input id="f-dateFrom" type="date" name="dateFrom" defaultValue={dateFrom ?? ''} className="w-40" />
          </Field>
          <Field label="送出日期（迄）" htmlFor="f-dateTo">
            <Input id="f-dateTo" type="date" name="dateTo" defaultValue={dateTo ?? ''} className="w-40" />
          </Field>
          <Button type="submit" variant="secondary">套用</Button>
          {hasFilters && <Link href="/admin/submissions" className={buttonClass({ variant: 'ghost' })}>清除篩選</Link>}
        </form>

        {rows.length === 0 ? (
          hasFilters ? (
            <EmptyState title="找不到符合條件的詢問" description="試試調整狀態、類型或日期範圍。" action={<ButtonLink href="/admin/submissions" variant="secondary">清除篩選</ButtonLink>} />
          ) : (
            <EmptyState icon={FiInbox} title="還沒有詢問" description="前台送出的詢問會出現在這裡。" />
          )
        ) : (
          <>
            <SubmissionsTable submissions={rows} />
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/submissions" searchParams={filterParams} />
          </>
        )}
      </Card>
    </>
  )
}
