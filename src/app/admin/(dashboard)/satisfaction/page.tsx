import { and, desc, eq, isNotNull } from 'drizzle-orm'
import Link from 'next/link'
import { FiSmile } from 'react-icons/fi'
import { Badge } from '../../../../components/admin/ui/Badge'
import { buttonClass, ButtonLink } from '../../../../components/admin/ui/Button'
import { Card } from '../../../../components/admin/ui/Card'
import { EmptyState } from '../../../../components/admin/ui/EmptyState'
import { Field, Select, Switch } from '../../../../components/admin/ui/Field'
import { PageHeader } from '../../../../components/admin/ui/PageHeader'
import { db } from '../../../../db/client'
import { contactSubmissions, satisfactionSurveys } from '../../../../db/schema'
import { SURVEY_SOURCES, type SurveySource } from '../../../../lib/constants'
import { requireAdminSession } from '../../../../lib/session'

const SOURCE_LABELS: Record<SurveySource, string> = {
  web_form: '客戶線上填寫',
  manual_entry: '業務手動輸入',
}

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

// 模板 5.1：列表頁 + 上方統計。統計用全部已填寫的問卷，不受篩選影響。
export default async function AdminSatisfactionPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; source?: string; flaggedOnly?: string }>
}) {
  await requireAdminSession()
  const { rating, source, flaggedOnly } = await searchParams

  const allSubmitted = await db
    .select({ rating: satisfactionSurveys.rating, lowScoreFlagged: satisfactionSurveys.lowScoreFlagged })
    .from(satisfactionSurveys)
    .where(isNotNull(satisfactionSurveys.submittedAt))

  const averageRating = allSubmitted.length > 0
    ? (allSubmitted.reduce((sum, r) => sum + (r.rating ?? 0), 0) / allSubmitted.length).toFixed(1)
    : '—'
  const lowScoreCount = allSubmitted.filter((r) => r.lowScoreFlagged).length

  const filters = [isNotNull(satisfactionSurveys.submittedAt)]
  if (rating) filters.push(eq(satisfactionSurveys.rating, Number(rating)))
  if (source && SURVEY_SOURCES.includes(source as SurveySource)) filters.push(eq(satisfactionSurveys.source, source))
  if (flaggedOnly === 'on') filters.push(eq(satisfactionSurveys.lowScoreFlagged, true))

  const rows = await db
    .select({
      submissionId: contactSubmissions.id,
      contactName: contactSubmissions.contactName,
      eventType: contactSubmissions.eventType,
      rating: satisfactionSurveys.rating,
      feedback: satisfactionSurveys.feedback,
      source: satisfactionSurveys.source,
      lowScoreFlagged: satisfactionSurveys.lowScoreFlagged,
      submittedAt: satisfactionSurveys.submittedAt,
    })
    .from(satisfactionSurveys)
    .innerJoin(contactSubmissions, eq(satisfactionSurveys.submissionId, contactSubmissions.id))
    .where(and(...filters))
    .orderBy(desc(satisfactionSurveys.submittedAt))

  const hasFilters = Boolean(rating || source || flaggedOnly)
  const stats = [
    { label: '平均評分', value: averageRating },
    { label: '已填寫問卷數', value: String(allSubmitted.length) },
    { label: '低分待跟進', value: String(lowScoreCount) },
  ]

  return (
    <>
      <PageHeader title="滿意度" description="已完成案件的客戶回饋，點進可查看對應詢問" />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-2xl bg-card p-5 shadow-card">
            <span className="text-[13px] text-muted-foreground">{s.label}</span>
            <span className="text-3xl font-light tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      <Card>
        <form method="get" className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3.5">
          <Field label="評分" htmlFor="f-rating" className="w-32">
            <Select id="f-rating" name="rating" defaultValue={rating ?? ''}>
              <option value="">全部</option>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} 分</option>)}
            </Select>
          </Field>
          <Field label="來源" htmlFor="f-source" className="w-40">
            <Select id="f-source" name="source" defaultValue={source ?? ''}>
              <option value="">全部</option>
              {SURVEY_SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
            </Select>
          </Field>
          <Switch name="flaggedOnly" defaultChecked={flaggedOnly === 'on'} label="只顯示低分待跟進" className="pb-2" />
          <button type="submit" className={buttonClass({ variant: 'secondary' })}>套用</button>
          {hasFilters && <Link href="/admin/satisfaction" className={buttonClass({ variant: 'ghost' })}>清除篩選</Link>}
        </form>

        {rows.length === 0 ? (
          hasFilters ? (
            <EmptyState title="找不到符合條件的回饋" description="試試調整評分、來源或低分條件。" action={<ButtonLink href="/admin/satisfaction" variant="secondary">清除篩選</ButtonLink>} />
          ) : (
            <EmptyState icon={FiSmile} title="還沒有問卷回饋" description="案件完成後寄出問卷，或由業務手動輸入，回饋會顯示在這裡。" />
          )
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.submissionId}>
                <Link href={`/admin/submissions/${r.submissionId}`} className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/60">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-light tabular-nums">{r.rating} / 5</span>
                    <span className="text-sm font-medium">{r.contactName}</span>
                    <span className="text-xs text-muted-foreground">{r.eventType}</span>
                    {r.lowScoreFlagged && <Badge tone="danger">低分，建議跟進</Badge>}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {SOURCE_LABELS[r.source as SurveySource]} · {formatDateTime(r.submittedAt!)}
                    </span>
                  </div>
                  {r.feedback && <p className="text-sm leading-relaxed text-muted-foreground">{r.feedback}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
