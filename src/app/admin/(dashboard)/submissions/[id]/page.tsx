import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import DetailRow from '../../../../../components/admin/DetailRow'
import ExecutionLogForm from '../../../../../components/admin/ExecutionLogForm'
import SatisfactionSection from '../../../../../components/admin/SatisfactionSection'
import StatusControl from '../../../../../components/admin/StatusControl'
import { db } from '../../../../../db/client'
import { contactSubmissions, eventExecutionLogs, satisfactionSurveys } from '../../../../../db/schema'
import { CONTACT_SUBMISSION_STATUS_LABELS, type ContactSubmissionStatus } from '../../../../../lib/constants'
import { requireAdminSession } from '../../../../../lib/session'

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession()
  const { id } = await params

  const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1)
  if (!submission) notFound()

  const showExecutionLog = submission.status === 'confirmed' || submission.status === 'completed'
  const [executionLog] = showExecutionLog
    ? await db.select().from(eventExecutionLogs).where(eq(eventExecutionLogs.submissionId, id)).limit(1)
    : []

  const showSatisfaction = submission.status === 'completed'
  const [survey] = showSatisfaction
    ? await db.select().from(satisfactionSurveys).where(eq(satisfactionSurveys.submissionId, id)).limit(1)
    : []

  return (
    <div>
      <Link href="/admin/submissions" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-caramel transition-colors duration-200 mb-6">
        <FiArrowLeft size={16} /> 回詢問表單列表
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-light text-stone-800">
            {submission.contactName}
            <span className="text-base text-stone-400 font-normal ml-2">
              {CONTACT_SUBMISSION_STATUS_LABELS[submission.status as ContactSubmissionStatus]}
            </span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            送出於 {formatDateTime(submission.createdAt)}
          </p>
        </div>
        <StatusControl submission={submission} />
      </div>

      <div className="bg-white border border-stone-200 p-6 text-sm">
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <p className="section-label mb-2">聯絡人資訊</p>
            <DetailRow label="聯絡人 / 公司單位" value={submission.contactName} />
            <DetailRow label="聯絡電話" value={submission.contactPhone} />
            <DetailRow label="Email" value={submission.contactEmail} />
            <DetailRow label="希望聯繫方式" value={submission.preferredContactMethod || '未指定'} />

            <p className="section-label mb-2 mt-6">活動基本資訊</p>
            <DetailRow label="活動性質" value={submission.eventType} />
            <DetailRow label="活動地點" value={`${submission.eventCity} ${submission.eventAddress}`} />
            <DetailRow label="場地類型" value={submission.venueType} />
            <DetailRow label="活動時間" value={`${formatDateTime(submission.eventStartAt)} — ${formatDateTime(submission.eventEndAt)}`} />
          </div>
          <div>
            <p className="section-label mb-2">服務需求</p>
            <DetailRow label="預計出杯數量" value={`${submission.cupCount} 杯`} />
            <DetailRow label="飲品品項需求" value={submission.drinkTypes.join('、')} />
            <DetailRow label="甜點" value={submission.dessertNeeded ? `需要${submission.dessertNotes ? `（${submission.dessertNotes}）` : ''}` : '不需要'} />

            <p className="section-label mb-2 mt-6">設備與場地條件</p>
            <DetailRow label="電源供應" value={submission.powerSupply || '未填寫'} />
            <DetailRow label="用水來源" value={submission.waterSource || '未填寫'} />

            <p className="section-label mb-2 mt-6">預算與備註</p>
            <DetailRow label="預算範圍" value={submission.budgetRange || '未填寫'} />
            <DetailRow label="特殊需求備註" value={submission.notes || '無'} />

            {submission.status === 'lost' && (
              <>
                <p className="section-label mb-2 mt-6">流失原因</p>
                <DetailRow label="原因" value={submission.lossReason || '未填寫'} />
                <DetailRow label="備註" value={submission.lossReasonNotes || '無'} />
              </>
            )}
          </div>
        </div>
      </div>

      {showExecutionLog && (
        <div className="mt-8">
          <h2 className="text-lg font-light text-stone-800 mb-4">活動中執行紀錄</h2>
          <ExecutionLogForm submissionId={submission.id} log={executionLog ?? null} />
        </div>
      )}

      {showSatisfaction && (
        <div className="mt-8">
          <h2 className="text-lg font-light text-stone-800 mb-4">客戶滿意度</h2>
          <SatisfactionSection submissionId={submission.id} survey={survey ?? null} />
        </div>
      )}
    </div>
  )
}
