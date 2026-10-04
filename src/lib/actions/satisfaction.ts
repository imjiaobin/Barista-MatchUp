'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { contactSubmissions, satisfactionSurveys } from '../../db/schema'
import { sendSurveyInviteEmail } from '../email'
import { requireAdminSession } from '../session'

export interface ManualFeedbackFormState {
  error: string | null
}

// 建立一筆空白問卷列（還沒有評分/回饋），讓「問卷存在」跟「有沒有寄出
// 邀請信」這兩件事可以脫鉤——後台可以先建好，之後再手動寄或自動寄。
export async function createSurveyForSubmission(submissionId: string): Promise<void> {
  await requireAdminSession()

  const [existing] = await db.select().from(satisfactionSurveys)
    .where(eq(satisfactionSurveys.submissionId, submissionId)).limit(1)
  if (existing) return

  await db.insert(satisfactionSurveys).values({ submissionId, source: 'web_form' })
  revalidatePath(`/admin/submissions/${submissionId}`)
}

export async function sendSurveyInvite(surveyId: string): Promise<void> {
  await requireAdminSession()

  const [survey] = await db.select().from(satisfactionSurveys).where(eq(satisfactionSurveys.id, surveyId)).limit(1)
  if (!survey) return

  const [submission] = await db.select().from(contactSubmissions)
    .where(eq(contactSubmissions.id, survey.submissionId)).limit(1)
  if (!submission) return

  await sendSurveyInviteEmail({
    contactName: submission.contactName,
    contactEmail: submission.contactEmail,
    surveyToken: survey.id,
  })

  await db.update(satisfactionSurveys).set({ sentAt: new Date() }).where(eq(satisfactionSurveys.id, surveyId))
  revalidatePath(`/admin/submissions/${survey.submissionId}`)
}

// 業務自己打電話/用自己信箱跟客戶來回拿到的回饋，不用強迫客戶一定要
// 填線上表單——跟線上表單共用同一張表，用 onConflictDoUpdate 處理
// 「這筆案件已經有一筆問卷列（可能是建立好等寄送的）」的情況。
export async function recordManualFeedback(
  submissionId: string,
  _prevState: ManualFeedbackFormState,
  formData: FormData,
): Promise<ManualFeedbackFormState> {
  await requireAdminSession()

  const ratingRaw = formData.get('rating')
  const rating = typeof ratingRaw === 'string' && ratingRaw ? Number(ratingRaw) : null
  if (rating === null || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: '請選擇 1 到 5 分的評分' }
  }
  const feedbackRaw = formData.get('feedback')
  const feedback = typeof feedbackRaw === 'string' && feedbackRaw.trim() ? feedbackRaw.trim() : null

  const values = {
    submissionId,
    source: 'manual_entry' as const,
    rating,
    feedback,
    lowScoreFlagged: rating <= 2,
    submittedAt: new Date(),
  }

  await db.insert(satisfactionSurveys)
    .values(values)
    .onConflictDoUpdate({ target: satisfactionSurveys.submissionId, set: values })

  revalidatePath(`/admin/submissions/${submissionId}`)
  return { error: null }
}
