'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { pageContent } from '../../db/schema'
import { requireAdminSession } from '../session'

export async function getPageContentMap(page: string): Promise<Record<string, string>> {
  const rows = await db.select().from(pageContent).where(eq(pageContent.page, page))
  return Object.fromEntries(rows.map((row) => [row.sectionKey, row.content]))
}

export interface ContentFormState {
  error: string | null
  success: boolean
}

// 後台的文案編輯器針對某個頁面的每一列，都會渲染一個
// <textarea name="content:{sectionKey}">，所以一次送出就能同時更新所有欄位。
export async function updatePageContent(page: string, revalidatePaths: string[], _prevState: ContentFormState, formData: FormData): Promise<ContentFormState> {
  await requireAdminSession()

  const updates: Array<{ sectionKey: string; content: string }> = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('content:') && typeof value === 'string') {
      updates.push({ sectionKey: key.slice('content:'.length), content: value })
    }
  }

  for (const { sectionKey, content } of updates) {
    await db.update(pageContent)
      .set({ content, updatedAt: new Date() })
      .where(and(eq(pageContent.page, page), eq(pageContent.sectionKey, sectionKey)))
  }

  for (const path of revalidatePaths) {
    revalidatePath(path)
  }
  revalidatePath('/admin/content')

  return { error: null, success: true }
}
