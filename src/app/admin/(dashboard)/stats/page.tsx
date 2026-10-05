import { db } from '../../../../db/client'
import { contactSubmissions } from '../../../../db/schema'
import { CONTACT_SUBMISSION_STATUS_LABELS, LOSS_REASONS, type ContactSubmissionStatus } from '../../../../lib/constants'
import { requireAdminSession } from '../../../../lib/session'
import BarDistributionChart, { type BarDatum } from '../../../../components/admin/charts/BarDistributionChart'
import TrendChart, { type TrendPoint } from '../../../../components/admin/charts/TrendChart'
import { Card, CardBody, CardHeader } from '../../../../components/admin/ui/Card'
import { PageHeader } from '../../../../components/admin/ui/PageHeader'

// 階段色用圖表 token：待處理以中性色表示，之後的階段依序用焦糖、摩卡、深焙；
// 未成交不是流程中的一個階段，而是中途離開的分支，用 destructive 另外標出。
const STAGE_COLORS: Record<ContactSubmissionStatus, string> = {
  new: 'var(--muted-foreground)',
  contacted: 'var(--chart-3)',
  confirmed: 'var(--chart-1)',
  completed: 'var(--chart-4)',
  lost: 'var(--destructive)',
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

// 模板：統計頁。圖表一律用 token 色，深色模式自動切換。
export default async function AdminStatsPage() {
  await requireAdminSession()

  const rows = await db.select().from(contactSubmissions)

  const months = lastSixMonths()
  const monthCounts = countBy(rows, (r) => monthKey(new Date(r.createdAt)))
  const trendData: TrendPoint[] = months.map((m) => ({ label: m.label, count: monthCounts.get(m.key) ?? 0 }))

  const eventTypeData = toSortedBars(countBy(rows, (r) => r.eventType))
  const cityData = toSortedBars(countBy(rows, (r) => r.eventCity))
  const budgetData = toSortedBars(countBy(rows, (r) => r.budgetRange))

  // 目前所在階段是「現在」的快照，不是歷史轉換率：資料模型只存當下狀態，沒有記錄每次變化的時間點
  const statusCounts = countBy(rows, (r) => r.status)
  const stageOrder: ContactSubmissionStatus[] = ['new', 'contacted', 'confirmed', 'completed']
  const funnelData: BarDatum[] = stageOrder.map((s) => ({
    label: CONTACT_SUBMISSION_STATUS_LABELS[s],
    value: statusCounts.get(s) ?? 0,
    color: STAGE_COLORS[s],
  }))
  const lostCount = statusCounts.get('lost') ?? 0

  const lossReasonCounts = countBy(
    rows.filter((r) => r.status === 'lost'),
    (r) => r.lossReason,
  )
  const lossReasonData: BarDatum[] = LOSS_REASONS
    .map((reason) => ({ label: reason, value: lossReasonCounts.get(reason) ?? 0, color: STAGE_COLORS.lost }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  return (
    <>
      <PageHeader title="統計分析" description="依詢問資料彙整，所有數字即時計算" />

      <Card>
        <CardHeader title="詢問量趨勢" description="近 6 個月" />
        <CardBody><TrendChart data={trendData} /></CardBody>
      </Card>

      <Card>
        <CardHeader
          title="詢問案件目前所在階段"
          description={`目前各階段的案件數（快照），不是歷史轉換率${lostCount > 0 ? ` · 另有 ${lostCount} 筆未成交` : ''}`}
        />
        <CardBody><BarDistributionChart data={funnelData} height={160} /></CardBody>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="活動類型分布" />
          <CardBody>
            {eventTypeData.length > 0 ? <BarDistributionChart data={eventTypeData} /> : <p className="text-sm text-muted-foreground">目前沒有資料</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="城市分布" />
          <CardBody>
            {cityData.length > 0 ? <BarDistributionChart data={cityData} /> : <p className="text-sm text-muted-foreground">目前沒有資料</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="預算區間分布" />
          <CardBody>
            {budgetData.length > 0 ? <BarDistributionChart data={budgetData} /> : <p className="text-sm text-muted-foreground">目前沒有資料</p>}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="流失原因分布" />
          <CardBody>
            {lossReasonData.length > 0 ? <BarDistributionChart data={lossReasonData} /> : <p className="text-sm text-muted-foreground">目前沒有未成交案件</p>}
          </CardBody>
        </Card>
      </div>
    </>
  )
}
