import { and, count, desc, eq, ilike, type SQL } from 'drizzle-orm'
import Link from 'next/link'
import { FiCalendar, FiPlus, FiSearch } from 'react-icons/fi'
import { db } from '../../../../db/client'
import { events } from '../../../../db/schema'
import { deleteEvent } from '../../../../lib/actions/events'
import { EVENT_CATEGORIES } from '../../../../lib/constants'
import { requireAdminSession } from '../../../../lib/session'
import { PUBLISH_STATUS } from '../../../../lib/status'
import { Badge } from '../../../../components/admin/ui/Badge'
import { ButtonLink, buttonClass } from '../../../../components/admin/ui/Button'
import { Card } from '../../../../components/admin/ui/Card'
import { ConfirmDialog } from '../../../../components/admin/ui/ConfirmDialog'
import { EmptyState } from '../../../../components/admin/ui/EmptyState'
import { Input, Select } from '../../../../components/admin/ui/Field'
import { PageHeader } from '../../../../components/admin/ui/PageHeader'
import { Pagination, Table, Td, Th, Tr } from '../../../../components/admin/ui/Table'

// 模板 5.1：列表頁
// 結構：PageHeader → 篩選列（GET 表單，條件自動進 URL）→ 表格 → 分頁
const PAGE_SIZE = 20

type SearchParams = { q?: string; category?: string; page?: string }

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdminSession()
  const sp = await searchParams
  const q = sp.q?.trim() || undefined
  const category = EVENT_CATEGORIES.find((c) => c === sp.category)
  const page = Math.max(1, Number(sp.page) || 1)

  const filters: SQL[] = []
  if (q) filters.push(ilike(events.title, `%${q}%`))
  if (category) filters.push(eq(events.category, category))
  const where = filters.length ? and(...filters) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(events).where(where).orderBy(desc(events.eventDate)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(events).where(where),
  ])
  const hasFilter = Boolean(q || category)

  return (
    <>
      <PageHeader
        title="活動"
        description={`共 ${total} 筆`}
        actions={<ButtonLink href="/admin/events/new"><FiPlus size={16} />新增活動</ButtonLink>}
      />

      <Card>
        <form className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3.5">
          <div className="relative w-full sm:w-64">
            <FiSearch size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input name="q" defaultValue={q} placeholder="搜尋活動標題" aria-label="搜尋活動標題" className="pl-9" />
          </div>
          <Select name="category" defaultValue={category ?? ''} aria-label="分類" className="w-auto">
            <option value="">全部分類</option>
            {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <button type="submit" className={buttonClass({ variant: 'secondary' })}>套用</button>
          {hasFilter && <Link href="/admin/events" className={buttonClass({ variant: 'ghost' })}>清除篩選</Link>}
        </form>

        {rows.length === 0 ? (
          hasFilter ? (
            <EmptyState title="找不到符合條件的活動" description="試試其他關鍵字或分類。" action={<ButtonLink href="/admin/events" variant="secondary">清除篩選</ButtonLink>} />
          ) : (
            <EmptyState icon={FiCalendar} title="還沒有活動" description="新增後會顯示在前台活動頁。" action={<ButtonLink href="/admin/events/new">新增活動</ButtonLink>} />
          )
        ) : (
          <>
            <Table>
              <thead>
                <tr><Th>標題</Th><Th>日期</Th><Th>地點</Th><Th>分類</Th><Th>狀態</Th><Th className="w-px" /></tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const status = e.isPublished ? PUBLISH_STATUS.published : PUBLISH_STATUS.draft
                  return (
                    <Tr key={e.id}>
                      <Td><Link href={`/admin/events/${e.id}/edit`} className="font-medium hover:text-primary">{e.title}</Link></Td>
                      <Td numeric muted className="whitespace-nowrap">{e.eventDate}</Td>
                      <Td>{e.location}</Td>
                      <Td muted>{e.category}</Td>
                      <Td><Badge tone={status.tone}>{status.label}</Badge></Td>
                      <Td className="whitespace-nowrap text-right">
                        <ButtonLink href={`/admin/events/${e.id}/edit`} variant="ghost" size="sm">編輯</ButtonLink>
                        <ConfirmDialog
                          trigger="刪除"
                          title={`刪除活動「${e.title}」？`}
                          description="刪除後前台將不再顯示，且無法復原。"
                          confirmText="刪除"
                          pendingText="刪除中…"
                          action={deleteEvent.bind(null, e.id)}
                        />
                      </Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/admin/events" searchParams={{ q, category }} />
          </>
        )}
      </Card>
    </>
  )
}
