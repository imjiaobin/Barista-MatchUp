import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import TrendChart, { type TrendPoint } from '../../../components/admin/charts/TrendChart'
import { db } from '../../../db/client'
import { contactSubmissions, events } from '../../../db/schema'
import { CONTACT_SUBMISSION_STATUS_LABELS, type ContactSubmissionStatus } from '../../../lib/constants'
import { requireAdminSession } from '../../../lib/session'

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export default async function AdminDashboardPage() {
  await requireAdminSession()

  const [allEvents, allSubmissions] = await Promise.all([
    db.select().from(events),
    db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)),
  ])

  const today = new Date()
  const todayStr = toDateStr(today)
  const in14DaysStr = toDateStr(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000))
  const upcomingEventsCount = allEvents.filter((e) => e.eventDate >= todayStr && e.eventDate <= in14DaysStr).length

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const newThisMonthCount = allSubmissions.filter((s) => new Date(s.createdAt) >= monthStart).length
  const pendingCount = allSubmissions.filter((s) => s.status === 'new').length

  const cards = [
    { label: '活動總數', value: allEvents.length, href: '/admin/events' },
    { label: '待處理詢問', value: pendingCount, href: '/admin/submissions' },
    { label: '本月新增詢問', value: newThisMonthCount, href: '/admin/submissions' },
    { label: '近 14 天活動', value: upcomingEventsCount, href: '/admin/events' },
  ]

  // 近 14 天詢問量 sparkline，給儀錶板用的「一眼瞄過去」趨勢，不是給人
  // 細讀數值的完整圖表（完整版在 /admin/stats）。
  const sparklineData: TrendPoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today.getTime() - (13 - i) * 24 * 60 * 60 * 1000)
    const dStr = toDateStr(d)
    const count = allSubmissions.filter((s) => toDateStr(new Date(s.createdAt)) === dStr).length
    return { label: dStr, count }
  })

  const recentSubmissions = allSubmissions.slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">後台總覽</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, href }) => (
          <Link key={label} href={href} className="bg-white border border-stone-200 p-6 hover:border-caramel transition-colors duration-200">
            <p className="text-3xl font-light text-caramel">{value}</p>
            <p className="text-sm text-stone-500 mt-2">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-stone-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="section-label">近 14 天詢問量</p>
          <Link href="/admin/stats" className="text-xs text-caramel hover:underline">完整統計 →</Link>
        </div>
        <TrendChart data={sparklineData} compact />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-caramel text-white px-4 py-2 text-sm hover:bg-opacity-90 transition-colors duration-200"
        >
          <FiPlus size={16} /> 新增活動
        </Link>
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-2 border border-stone-200 px-4 py-2 text-sm hover:border-caramel hover:text-caramel transition-colors duration-200"
        >
          <FiEdit3 size={16} /> 編輯文案
        </Link>
      </div>

      <div className="bg-white border border-stone-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <p className="section-label">最新詢問</p>
          <Link href="/admin/submissions" className="text-xs text-caramel hover:underline">查看全部 →</Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="p-5 text-sm text-stone-400">目前沒有詢問紀錄</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentSubmissions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/submissions/${s.id}`}
                className="flex flex-wrap items-center justify-between gap-2 p-5 hover:bg-stone-50 transition-colors duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {s.contactName} <span className="text-stone-400 font-normal">· {s.eventType} · {s.eventCity}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{formatDateTime(s.createdAt)}</p>
                </div>
                <span className="text-xs text-stone-500 border border-stone-200 px-2 py-1">
                  {CONTACT_SUBMISSION_STATUS_LABELS[s.status as ContactSubmissionStatus]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
