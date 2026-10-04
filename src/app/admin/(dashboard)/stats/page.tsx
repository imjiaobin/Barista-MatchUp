import { db } from '../../../../db/client'
import { contactSubmissions } from '../../../../db/schema'
import { CONTACT_SUBMISSION_STATUS_LABELS, LOSS_REASONS, type ContactSubmissionStatus } from '../../../../lib/constants'
import { requireAdminSession } from '../../../../lib/session'
import BarDistributionChart, { type BarDatum } from '../../../../components/admin/charts/BarDistributionChart'
import TrendChart, { type TrendPoint } from '../../../../components/admin/charts/TrendChart'

// 狀態階段用跟網站本身一致的「沖煮漸層」表示進度：淺焦糖奶 → 深焙
// espresso，階段愈後面顏色愈深；未成交不是流程裡的一個階段、是中途
// 離開的分支，所以另外用警示色標出來，不跟漸層混在一起。
const STAGE_COLORS: Record<ContactSubmissionStatus, string> = {
  new: '#ecd6bf',
  contacted: '#d2a682',
  confirmed: '#b5592a',
  completed: '#4E220F',
  lost: '#dc2626',
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function lastSixMonths(): { key: string; label: string }[] {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), label: `${d.getMonth() + 1} 月` })
  }
  return months
}

function countBy<T>(rows: T[], getKey: (row: T) => string | null): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const key = getKey(row)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function toSortedBars(counts: Map<string, number>): BarDatum[] {
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export default async function AdminStatsPage() {
  await requireAdminSession()

  const rows = await db.select().from(contactSubmissions)

  // 詢問量趨勢（近 6 個月）
  const months = lastSixMonths()
  const monthCounts = countBy(rows, (r) => monthKey(new Date(r.createdAt)))
  const trendData: TrendPoint[] = months.map((m) => ({ label: m.label, count: monthCounts.get(m.key) ?? 0 }))

  // 活動類型 / 城市 / 預算分布——只列出實際有資料的項目，由多到少排序
  const eventTypeData = toSortedBars(countBy(rows, (r) => r.eventType))
  const cityData = toSortedBars(countBy(rows, (r) => r.eventCity))
  const budgetData = toSortedBars(countBy(rows, (r) => r.budgetRange))

  // 詢問案件目前所在階段（不是精確的歷史轉換率，是「現在」的快照分布，
  // 因為目前的資料模型只存當下狀態、沒有記錄每次狀態變化的時間點）
  const statusCounts = countBy(rows, (r) => r.status)
  const stageOrder: ContactSubmissionStatus[] = ['new', 'contacted', 'confirmed', 'completed']
  const funnelData: BarDatum[] = stageOrder.map((s) => ({
    label: CONTACT_SUBMISSION_STATUS_LABELS[s],
    value: statusCounts.get(s) ?? 0,
    color: STAGE_COLORS[s],
  }))
  const lostCount = statusCounts.get('lost') ?? 0

  // 流失原因分布（只看狀態為未成交的案件）
  const lossReasonCounts = countBy(
    rows.filter((r) => r.status === 'lost'),
    (r) => r.lossReason,
  )
  const lossReasonData: BarDatum[] = LOSS_REASONS
    .map((reason) => ({ label: reason, value: lossReasonCounts.get(reason) ?? 0, color: '#dc2626' }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">統計分析</h1>

      <div className="bg-white border border-stone-200 p-6 mb-6">
        <p className="section-label mb-4">詢問量趨勢（近 6 個月）</p>
        <TrendChart data={trendData} />
      </div>

      <div className="bg-white border border-stone-200 p-6 mb-6">
        <p className="section-label mb-1">詢問案件目前所在階段</p>
        <p className="text-xs text-stone-400 mb-4">
          目前各階段的案件數（快照），不是歷史轉換率 ·
          {lostCount > 0 && <span className="text-red-600"> 另有 {lostCount} 筆未成交</span>}
        </p>
        <BarDistributionChart data={funnelData} height={160} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-stone-200 p-6">
          <p className="section-label mb-4">活動類型分布</p>
          {eventTypeData.length > 0
            ? <BarDistributionChart data={eventTypeData} />
            : <p className="text-sm text-stone-400">目前沒有資料</p>}
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="section-label mb-4">城市分布</p>
          {cityData.length > 0
            ? <BarDistributionChart data={cityData} />
            : <p className="text-sm text-stone-400">目前沒有資料</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 p-6">
          <p className="section-label mb-4">預算區間分布</p>
          {budgetData.length > 0
            ? <BarDistributionChart data={budgetData} />
            : <p className="text-sm text-stone-400">目前沒有資料</p>}
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="section-label mb-4">流失原因分布</p>
          {lossReasonData.length > 0
            ? <BarDistributionChart data={lossReasonData} />
            : <p className="text-sm text-stone-400">目前沒有未成交案件</p>}
        </div>
      </div>
    </div>
  )
}
