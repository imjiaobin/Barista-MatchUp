'use server'

import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { eventExecutionLogs } from '../../db/schema'
import { requireAdminSession } from '../session'

export interface ExecutionLogFormState {
  error: string | null
}

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function toDateOrNull(value: FormDataEntryValue | null): Date | null {
  return typeof value === 'string' && value ? new Date(value) : null
}

// 跟 contactSubmissions 是 1:1，用 onConflictDoUpdate 讓同一個 action
// 同時處理「第一次建立」跟「後續編輯」，不用另外分新建/更新兩條路。
export async function upsertExecutionLog(
  submissionId: string,
  _prevState: ExecutionLogFormState,
  formData: FormData,
): Promise<ExecutionLogFormState> {
  await requireAdminSession()

  const durationRaw = formData.get('actualDurationMinutes')
  const actualDurationMinutes = typeof durationRaw === 'string' && durationRaw.trim() ? Number(durationRaw) : null
  if (actualDurationMinutes !== null && (!Number.isFinite(actualDurationMinutes) || actualDurationMinutes < 0)) {
    return { error: '活動時長請輸入有效的分鐘數' }
  }

  const values = {
    submissionId,
    arrivalAt: toDateOrNull(formData.get('arrivalAt')),
    setupAt: toDateOrNull(formData.get('setupAt')),
    actualDurationMinutes,
    onsiteContactName: toStringOrNull(formData.get('onsiteContactName')),
    onsiteContactPhone: toStringOrNull(formData.get('onsiteContactPhone')),
    emergencyContactName: toStringOrNull(formData.get('emergencyContactName')),
    emergencyContactPhone: toStringOrNull(formData.get('emergencyContactPhone')),
    onsiteNotes: toStringOrNull(formData.get('onsiteNotes')),
    closedSmoothly: formData.get('closedSmoothly') === 'on',
    followUpNotes: toStringOrNull(formData.get('followUpNotes')),
    updatedAt: new Date(),
  }

  await db.insert(eventExecutionLogs)
    .values(values)
    .onConflictDoUpdate({ target: eventExecutionLogs.submissionId, set: values })

  revalidatePath(`/admin/submissions/${submissionId}`)
  return { error: null }
}
