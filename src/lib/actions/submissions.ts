'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { contactSubmissions, satisfactionSurveys } from '../../db/schema'
import { CONTACT_SUBMISSION_STATUSES, LOSS_REASONS, type ContactSubmissionStatus, type LossReason } from '../constants'
import { requireAdminSession } from '../session'
import { createSurveyForSubmission, sendSurveyInvite } from './satisfaction'

export async function updateSubmissionStatus(id: string, formData: FormData): Promise<void> {
  await requireAdminSession()

  const status = formData.get('status')
  if (typeof status !== 'string' || !CONTACT_SUBMISSION_STATUSES.includes(status as ContactSubmissionStatus)) {
    return
  }

  if (status === 'lost') {
    const lossReason = formData.get('lossReason')
    if (typeof lossReason !== 'string' || !LOSS_REASONS.includes(lossReason as LossReason)) {
      return
    }
    const notesRaw = formData.get('lossReasonNotes')
    const lossReasonNotes = typeof notesRaw === 'string' && notesRaw.trim() ? notesRaw.trim() : null
    await db.update(contactSubmissions)
      .set({ status, lossReason, lossReasonNotes })
      .where(eq(contactSubmissions.id, id))
  } else {
    // 離開 lost 狀態時一併清空流失原因，避免殘留跟目前狀態矛盾的資料
    await db.update(contactSubmissions)
      .set({ status, lossReason: null, lossReasonNotes: null })
      .where(eq(contactSubmissions.id, id))
  }

  // 狀態一完成就順便建立並寄出滿意度問卷，業務之後也能在詳情頁手動
  // 再寄一次。寄信失敗不該讓狀態更新本身失敗，比照 contact.ts 的
  // 「best-effort 側邊效果」寫法。
  if (status === 'completed') {
    try {
      await createSurveyForSubmission(id)
      const [survey] = await db.select().from(satisfactionSurveys)
        .where(eq(satisfactionSurveys.submissionId, id)).limit(1)
      if (survey && !survey.sentAt) {
        await sendSurveyInvite(survey.id)
      }
    } catch (err) {
      console.error('Failed to auto-create/send satisfaction survey', err)
    }
  }

  revalidatePath('/admin/submissions')
}
