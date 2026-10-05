import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { FiEdit3, FiInbox, FiPlus } from 'react-icons/fi'
import TrendChart, { type TrendPoint } from '../../../components/admin/charts/TrendChart'
import { Badge } from '../../../components/admin/ui/Badge'
import { ButtonLink } from '../../../components/admin/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/admin/ui/Card'
import { EmptyState } from '../../../components/admin/ui/EmptyState'
import { PageHeader } from '../../../components/admin/ui/PageHeader'
import { Table, Td, Th, Tr } from '../../../components/admin/ui/Table'
import { db } from '../../../db/client'
import { contactSubmissions, events } from '../../../db/schema'
import { requireAdminSession } from '../../../lib/session'
import { submissionStatus } from '../../../lib/status'

// 模板 5.4：儀表板
// 結構：PageHeader（常用操作）→ 4 張統計卡（點進已篩選列表）→ 趨勢 sparkline（完整版在 /admin/stats）→ 最近 5 筆
const DAY = 24 * 60 * 60 * 1000
const toDateStr = (d: Date) => d.toISOString().slice(0, 10)
const fmt = (v: Date | string) => new Date(v).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })

export default async function AdminDashboardPage() {
  await requireAdminSession()

  const [allEvents, allSubmissions] = await Promise.all([
    db.select().from(events),
    db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)),
  ])

  const today = new Date()
  const todayStr = toDateStr(today)
  const in14Str = toDateStr(new Date(today.getTime() + 14 * DAY))
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const stats = [
    { label: '待處理詢問', value: allSubmissions.filter((s) => s.status === 'new').length, href: '/admin/submissions?status=new' },
    { label: '本月新增詢問', value: allSubmissions.filter((s) => new Date(s.createdAt) >= monthStart).length, href: '/admin/submissions' },
    { label: '近 14 天活動', value: allEvents.filter((e) => e.eventDate >= todayStr && e.eventDate <= in14Str).length, href: '/admin/events' },
    { label: '活動總數', value: allEvents.length, href: '/admin/events' },
  ]

  const trend: TrendPoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = toDateStr(new Date(today.getTime() - (13 - i) * DAY))
    return { label: d, count: allSubmissions.filter((s) => toDateStr(new Date(s.createdAt)) === d).length }
  })
  const recent = allSubmissions.slice(0, 5)

  return (
    <>
      <PageHeader
        title="總覽"
        actions={<>
          <ButtonLink href="/admin/content" variant="secondary"><FiEdit3 size={16} />編輯文案</ButtonLink>
          <ButtonLink href="/admin/events/new"><FiPlus size={16} />新增活動</ButtonLink>
        </>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="flex flex-col gap-1 rounded-2xl bg-card p-5 shadow-card transition-colors hover:bg-accent/50">
            <span className="text-[13px] text-muted-foreground">{s.label}</span>
            <span className="text-3xl font-light tabular-nums">{s.value}</span>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader title="近 14 天詢問量" actions={<ButtonLink href="/admin/stats" variant="ghost" size="sm">完整統計</ButtonLink>} />
        <CardBody className="pt-2"><TrendChart data={trend} compact /></CardBody>
      </Card>

      <Card>
        <CardHeader title="最新詢問" actions={<ButtonLink href="/admin/submissions" variant="ghost" size="sm">查看全部</ButtonLink>} />
        {recent.length === 0 ? (
          <EmptyState icon={FiInbox} title="目前沒有詢問" description="前台送出的詢問會出現在這裡。" />
        ) : (
          <div className="mt-3">
            <Table>
              <thead><tr><Th>聯絡人</Th><Th>活動性質</Th><Th>城市</Th><Th>送出時間</Th><Th>狀態</Th></tr></thead>
              <tbody>
                {recent.map((s) => {
                  const st = submissionStatus(s.status)
                  return (
                    <Tr key={s.id}>
                      <Td><Link href={`/admin/submissions/${s.id}`} className="font-medium hover:text-primary">{s.contactName}</Link></Td>
                      <Td>{s.eventType}</Td>
                      <Td muted>{s.eventCity}</Td>
                      <Td numeric muted className="whitespace-nowrap">{fmt(s.createdAt)}</Td>
                      <Td><Badge tone={st.tone}>{st.label}</Badge></Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </>
  )
}
