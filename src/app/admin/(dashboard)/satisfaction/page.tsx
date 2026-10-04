import { and, desc, eq, isNotNull } from 'drizzle-orm'
import Link from 'next/link'
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

export default async function AdminSatisfactionPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; source?: string; flaggedOnly?: string }>
}) {
  await requireAdminSession()
  const { rating, source, flaggedOnly } = await searchParams

  // 整體統計一律用全部「已填寫」的問卷算，不受篩選影響，篩選只影響
  // 下面的清單——這樣「平均評分」才不會因為篩選條件變來變去。
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

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">客戶滿意度</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-3xl font-light text-caramel">{averageRating}</p>
          <p className="text-sm text-stone-500 mt-2">平均評分</p>
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-3xl font-light text-caramel">{allSubmitted.length}</p>
          <p className="text-sm text-stone-500 mt-2">已填寫問卷數</p>
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-3xl font-light text-caramel">{lowScoreCount}</p>
          <p className="text-sm text-stone-500 mt-2">低分待跟進</p>
        </div>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-4 mb-6 bg-white border border-stone-200 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">評分</label>
          <select name="rating" defaultValue={rating ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white">
            <option value="">全部</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} 分</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase text-stone-400">來源</label>
          <select name="source" defaultValue={source ?? ''} className="text-sm border border-stone-200 px-3 py-2 bg-white">
            <option value="">全部</option>
            {SURVEY_SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-600 pb-2">
          <input type="checkbox" name="flaggedOnly" defaultChecked={flaggedOnly === 'on'} className="accent-caramel" />
          只顯示低分待跟進
        </label>
        <button type="submit" className="bg-caramel text-white px-4 py-2 text-sm">套用篩選</button>
        {(rating || source || flaggedOnly) && (
          <Link href="/admin/satisfaction" className="text-sm text-stone-400 hover:text-caramel transition-colors duration-200">
            清除篩選
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="p-6 text-sm text-stone-400 bg-white border border-stone-200">沒有符合條件的問卷回饋</p>
      ) : (
        <div className="bg-white border border-stone-200 divide-y divide-stone-100">
          {rows.map((r) => (
            <Link
              key={r.submissionId}
              href={`/admin/submissions/${r.submissionId}`}
              className="block p-5 hover:bg-stone-50 transition-colors duration-200"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xl font-light text-caramel">{r.rating} / 5</span>
                <span className="text-sm text-stone-800">{r.contactName}</span>
                <span className="text-xs text-stone-400">· {r.eventType}</span>
                {r.lowScoreFlagged && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-1">低分，建議跟進</span>
                )}
                <span className="text-xs text-stone-400 ml-auto">
                  {SOURCE_LABELS[r.source as SurveySource]} · {formatDateTime(r.submittedAt!)}
                </span>
              </div>
              {r.feedback && <p className="text-sm text-stone-600 leading-relaxed">{r.feedback}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
