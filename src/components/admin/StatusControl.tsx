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
import { Button } from './ui/Button'
import { Field, Select, Textarea } from './ui/Field'

// 選到「未成交」以外的狀態維持原本「選了就直接送出」的行為；選到
// 「未成交」則先不送出，等使用者補填流失原因後跟狀態一起送出，
// 避免存進一筆狀態是 lost、卻沒有原因的矛盾資料。
// compact 給列表列內使用：不含外層標籤，寬度收斂。
export default function StatusControl({ submission, compact = false }: { submission: ContactSubmission; compact?: boolean }) {
  const [pendingStatus, setPendingStatus] = useState<ContactSubmissionStatus>(
    submission.status as ContactSubmissionStatus,
  )
  const showLossForm = pendingStatus === 'lost'

  const statusSelect = (
    <Select
      id={compact ? undefined : 'status'}
      aria-label={compact ? '變更狀態' : undefined}
      name="status"
      value={pendingStatus}
      className={compact ? 'w-36' : undefined}
      onChange={(e) => {
        const next = e.target.value as ContactSubmissionStatus
        setPendingStatus(next)
        if (next !== 'lost') {
          e.currentTarget.form?.requestSubmit()
        }
      }}
    >
      {CONTACT_SUBMISSION_STATUSES.map((value) => (
        <option key={value} value={value}>{CONTACT_SUBMISSION_STATUS_LABELS[value]}</option>
      ))}
    </Select>
  )

  return (
    <form action={updateSubmissionStatus.bind(null, submission.id)} className={compact ? 'flex flex-col items-end gap-2 text-left' : 'flex flex-col gap-4'}>
      {compact ? statusSelect : <Field label="目前狀態" htmlFor="status">{statusSelect}</Field>}

      {showLossForm && (
        <div className="flex w-72 max-w-full flex-col gap-4 rounded-2xl bg-muted p-4">
          <Field label="流失原因" htmlFor={`lossReason-${submission.id}`} required>
            <Select id={`lossReason-${submission.id}`} name="lossReason" defaultValue={submission.lossReason ?? ''} required>
              <option value="" disabled>選擇流失原因</option>
              {LOSS_REASONS.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </Select>
          </Field>
          <Field label="備註" htmlFor={`lossNotes-${submission.id}`} hint="選填">
            <Textarea id={`lossNotes-${submission.id}`} name="lossReasonNotes" defaultValue={submission.lossReasonNotes ?? ''} rows={2} />
          </Field>
          <Button type="submit" size="sm" className="self-end">確認</Button>
        </div>
      )}
    </form>
  )
}
