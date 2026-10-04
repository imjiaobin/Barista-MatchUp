'use client'

import { useState } from 'react'
import type { ContactSubmission } from '../../db/schema'
import {
  CONTACT_SUBMISSION_STATUSES,
  CONTACT_SUBMISSION_STATUS_LABELS,
  LOSS_REASONS,
  type ContactSubmissionStatus,
} from '../../lib/constants'
import { updateSubmissionStatus } from '../../lib/actions/submissions'

// 選到「未成交」以外的狀態維持原本「選了就直接送出」的行為；選到
// 「未成交」則先不送出，等使用者補填流失原因後跟狀態一起送出，
// 避免存進一筆狀態是 lost、卻沒有原因的矛盾資料。
export default function StatusControl({ submission }: { submission: ContactSubmission }) {
  const [pendingStatus, setPendingStatus] = useState<ContactSubmissionStatus>(
    submission.status as ContactSubmissionStatus,
  )
  const showLossForm = pendingStatus === 'lost'

  return (
    <form action={updateSubmissionStatus.bind(null, submission.id)} className="flex flex-col items-end gap-2">
      <select
        name="status"
        value={pendingStatus}
        onChange={(e) => {
          const next = e.target.value as ContactSubmissionStatus
          setPendingStatus(next)
          if (next !== 'lost') {
            e.currentTarget.form?.requestSubmit()
          }
        }}
        className="text-xs border border-stone-200 px-2 py-1 bg-white"
      >
        {CONTACT_SUBMISSION_STATUSES.map((value) => (
          <option key={value} value={value}>{CONTACT_SUBMISSION_STATUS_LABELS[value]}</option>
        ))}
      </select>

      {showLossForm && (
        <div className="flex flex-col items-stretch gap-2 bg-stone-50 border border-stone-200 p-3 text-xs w-56">
          <select
            name="lossReason"
            defaultValue={submission.lossReason ?? ''}
            required
            className="border border-stone-200 px-2 py-1 bg-white w-full"
          >
            <option value="" disabled>選擇流失原因</option>
            {LOSS_REASONS.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
          <textarea
            name="lossReasonNotes"
            defaultValue={submission.lossReasonNotes ?? ''}
            placeholder="備註（選填）"
            rows={2}
            className="border border-stone-200 px-2 py-1 bg-white w-full resize-none"
          />
          <button type="submit" className="text-xs bg-caramel text-white px-3 py-1.5 self-end">
            確認
          </button>
        </div>
      )}
    </form>
  )
}
