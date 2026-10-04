'use client'

import { useActionState } from 'react'
import type { SatisfactionSurvey } from '../../db/schema'
import {
  createSurveyForSubmission,
  sendSurveyInvite,
  recordManualFeedback,
  type ManualFeedbackFormState,
} from '../../lib/actions/satisfaction'

const initialState: ManualFeedbackFormState = { error: null }

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function SatisfactionSection({ submissionId, survey }: { submissionId: string; survey: SatisfactionSurvey | null }) {
  const [state, formAction, pending] = useActionState(recordManualFeedback.bind(null, submissionId), initialState)

  // 已經填寫完成（不管是客戶自填還是業務手動輸入）：唯讀呈現結果
  if (survey?.submittedAt) {
    return (
      <div className="bg-white border border-stone-200 p-6 text-sm flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-light text-caramel">{survey.rating} / 5</span>
          {survey.lowScoreFlagged && (
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1">低分，建議跟進</span>
          )}
          <span className="text-xs text-stone-400">
            來源：{survey.source === 'web_form' ? '客戶線上填寫' : '業務手動輸入'} · {formatDateTime(survey.submittedAt)}
          </span>
        </div>
        {survey.feedback && <p className="text-stone-600 leading-relaxed">{survey.feedback}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white border border-stone-200 p-6 text-sm flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {!survey ? (
          <form action={createSurveyForSubmission.bind(null, submissionId)}>
            <button type="submit" className="bg-caramel text-white px-4 py-2 text-xs">建立問卷連結</button>
          </form>
        ) : (
          <>
            <form action={sendSurveyInvite.bind(null, survey.id)}>
              <button type="submit" className="bg-caramel text-white px-4 py-2 text-xs">
                {survey.sentAt ? '重新寄送邀請信' : '寄送邀請信'}
              </button>
            </form>
            {survey.sentAt && (
              <span className="text-xs text-stone-400">已於 {formatDateTime(survey.sentAt)} 寄出</span>
            )}
          </>
        )}
      </div>

      <div className="border-t border-stone-100 pt-6">
        <p className="section-label mb-4">或由業務手動輸入客戶回饋</p>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-stone-400">評分</label>
            <select
              name="rating" required defaultValue=""
              className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-caramel w-32"
            >
              <option value="" disabled>選擇評分</option>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} 分</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-stone-400">回饋內容</label>
            <textarea
              name="feedback" rows={3}
              className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-caramel resize-none"
            />
          </div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button type="submit" disabled={pending} className="self-start bg-stone-700 text-white px-4 py-2 text-xs disabled:opacity-50">
            {pending ? '儲存中...' : '儲存回饋'}
          </button>
        </form>
      </div>
    </div>
  )
}
