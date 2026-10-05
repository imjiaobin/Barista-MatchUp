'use client'

import { useActionState } from 'react'
import type { SatisfactionSurvey } from '../../db/schema'
import {
  createSurveyForSubmission,
  sendSurveyInvite,
  recordManualFeedback,
  type ManualFeedbackFormState,
} from '../../lib/actions/satisfaction'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Field, FormAlert, Select, Textarea } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

const initialState: ManualFeedbackFormState = { error: null }

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function SatisfactionSection({ submissionId, survey }: { submissionId: string; survey: SatisfactionSurvey | null }) {
  const [state, formAction] = useActionState(recordManualFeedback.bind(null, submissionId), initialState)

  // 已經填寫完成（不管是客戶自填還是業務手動輸入）：唯讀呈現結果
  if (survey?.submittedAt) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-light tabular-nums">{survey.rating} / 5</span>
          {survey.lowScoreFlagged && <Badge tone="danger">低分，建議跟進</Badge>}
          <span className="text-xs text-muted-foreground">
            來源：{survey.source === 'web_form' ? '客戶線上填寫' : '業務手動輸入'} · {formatDateTime(survey.submittedAt)}
          </span>
        </div>
        {survey.feedback && <p className="text-sm leading-relaxed">{survey.feedback}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {!survey ? (
          <form action={createSurveyForSubmission.bind(null, submissionId)}>
            <Button type="submit" size="sm">建立問卷連結</Button>
          </form>
        ) : (
          <>
            <form action={sendSurveyInvite.bind(null, survey.id)}>
              <Button type="submit" size="sm">{survey.sentAt ? '重新寄送邀請信' : '寄送邀請信'}</Button>
            </form>
            {survey.sentAt && (
              <span className="text-xs text-muted-foreground">已於 {formatDateTime(survey.sentAt)} 寄出</span>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-5 border-t border-border pt-6">
        <p className="text-sm font-medium">或由業務手動輸入客戶回饋</p>
        <form action={formAction} className="flex max-w-xl flex-col gap-5">
          {state.error && <FormAlert>{state.error}</FormAlert>}
          <Field label="評分" htmlFor="manual-rating" required className="sm:w-40">
            <Select id="manual-rating" name="rating" required defaultValue="">
              <option value="" disabled>選擇評分</option>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} 分</option>)}
            </Select>
          </Field>
          <Field label="回饋內容" htmlFor="manual-feedback">
            <Textarea id="manual-feedback" name="feedback" rows={3} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton variant="secondary" pendingText="儲存中…">儲存回饋</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
