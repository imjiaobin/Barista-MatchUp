'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { satisfactionSurveys } from '../../db/schema'

export interface SurveySubmitState {
  success: boolean
  error: string | null
}

// 公開 action，不呼叫 requireAdminSession()——客戶透過 email 收到的
// 連結本身（uuid token）就是存取權限，比照 contact.ts 的公開 action 寫法。
export async function submitSatisfactionSurvey(
  token: string,
  _prevState: SurveySubmitState,
  formData: FormData,
): Promise<SurveySubmitState> {
  const [survey] = await db.select().from(satisfactionSurveys).where(eq(satisfactionSurveys.id, token)).limit(1)
  if (!survey) {
    return { success: false, error: '找不到這份問卷，連結可能已失效。' }
  }
  if (survey.submittedAt) {
    return { success: false, error: '這份問卷已經填寫過了，謝謝您的回饋！' }
  }

  const ratingRaw = formData.get('rating')
  const rating = typeof ratingRaw === 'string' && ratingRaw ? Number(ratingRaw) : null
  if (rating === null || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: '請選擇 1 到 5 分的評分' }
  }
  const feedbackRaw = formData.get('feedback')
  const feedback = typeof feedbackRaw === 'string' && feedbackRaw.trim() ? feedbackRaw.trim() : null

  await db.update(satisfactionSurveys).set({
    rating,
    feedback,
    lowScoreFlagged: rating <= 2,
    source: 'web_form',
    submittedAt: new Date(),
  }).where(eq(satisfactionSurveys.id, token))

  revalidatePath(`/survey/${token}`)
  return { success: true, error: null }
}
