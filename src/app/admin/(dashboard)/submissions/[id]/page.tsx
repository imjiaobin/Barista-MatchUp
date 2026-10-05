import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ExecutionLogForm from '../../../../../components/admin/ExecutionLogForm'
import SatisfactionSection from '../../../../../components/admin/SatisfactionSection'
import StatusControl from '../../../../../components/admin/StatusControl'
import { Badge } from '../../../../../components/admin/ui/Badge'
import { Card, CardBody, CardHeader, DescriptionList } from '../../../../../components/admin/ui/Card'
import { PageHeader } from '../../../../../components/admin/ui/PageHeader'
import { db } from '../../../../../db/client'
import { contactSubmissions, eventExecutionLogs, satisfactionSurveys } from '../../../../../db/schema'
import { requireAdminSession } from '../../../../../lib/session'
import { submissionStatus } from '../../../../../lib/status'

// 模板 5.2：詳情頁。左欄資訊卡片，右欄 sticky 狀態操作。
// 執行紀錄（確認後才顯示）與滿意度（完成後才顯示）是同一筆案件的附屬區塊，放在左欄最下方。
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

  const st = submissionStatus(submission.status)

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: '詢問表單', href: '/admin/submissions' }, { label: submission.contactName }]}
        title={submission.contactName}
        badge={<Badge tone={st.tone}>{st.label}</Badge>}
        description={`送出於 ${formatDateTime(submission.createdAt)}`}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="聯絡人資訊" />
            <CardBody>
              <DescriptionList items={[
                { label: '聯絡人 / 公司單位', value: submission.contactName },
                { label: '聯絡電話', value: submission.contactPhone },
                { label: 'Email', value: submission.contactEmail },
                { label: '希望聯繫方式', value: submission.preferredContactMethod || '未指定' },
              ]} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="活動基本資訊" />
            <CardBody>
              <DescriptionList items={[
                { label: '活動性質', value: submission.eventType },
                { label: '活動地點', value: `${submission.eventCity} ${submission.eventAddress}` },
                { label: '場地類型', value: submission.venueType },
                { label: '活動時間', value: `${formatDateTime(submission.eventStartAt)} — ${formatDateTime(submission.eventEndAt)}` },
              ]} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="服務需求" />
            <CardBody>
              <DescriptionList items={[
                { label: '預計出杯數量', value: `${submission.cupCount} 杯` },
                { label: '飲品品項需求', value: submission.drinkTypes.join('、') },
                { label: '甜點', value: submission.dessertNeeded ? `需要${submission.dessertNotes ? `（${submission.dessertNotes}）` : ''}` : '不需要' },
              ]} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="設備與場地條件" />
            <CardBody>
              <DescriptionList items={[
                { label: '電源供應', value: submission.powerSupply || '未填寫' },
                { label: '用水來源', value: submission.waterSource || '未填寫' },
              ]} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="預算與備註" />
            <CardBody>
              <DescriptionList items={[
                { label: '預算範圍', value: submission.budgetRange || '未填寫' },
                { label: '特殊需求備註', value: submission.notes || '無' },
              ]} />
            </CardBody>
          </Card>

          {submission.status === 'lost' && (
            <Card>
              <CardHeader title="流失原因" />
              <CardBody>
                <DescriptionList items={[
                  { label: '原因', value: submission.lossReason || '未填寫' },
                  { label: '備註', value: submission.lossReasonNotes || '無' },
                ]} />
              </CardBody>
            </Card>
          )}

          {showExecutionLog && (
            <Card>
              <CardHeader title="活動中執行紀錄" description="確認後才會顯示，可重複編輯" />
              <CardBody>
                <ExecutionLogForm submissionId={submission.id} log={executionLog ?? null} />
              </CardBody>
            </Card>
          )}

          {showSatisfaction && (
            <Card>
              <CardHeader title="客戶滿意度" description="完成案件後寄出問卷，或由業務手動輸入" />
              <CardBody>
                <SatisfactionSection submissionId={submission.id} survey={survey ?? null} />
              </CardBody>
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-20">
          <Card>
            <CardHeader title="狀態" description="選擇「未成交」時需補填流失原因" />
            <CardBody>
              <StatusControl submission={submission} />
            </CardBody>
          </Card>
        </aside>
      </div>
    </>
  )
}
