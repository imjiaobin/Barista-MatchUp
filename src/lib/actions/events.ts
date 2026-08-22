'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '../../db/client'
import { events } from '../../db/schema'
import { EVENT_CATEGORIES, EVENT_GRADIENT_PRESETS } from '../constants'
import { requireAdminSession } from '../session'

const eventSchema = z.object({
  title: z.string().trim().min(1, '請輸入標題').max(200),
  eventDate: z.string().trim().min(1, '請選擇日期'),
  location: z.string().trim().min(1, '請輸入地點').max(100),
  category: z.enum(EVENT_CATEGORIES),
  summary: z.string().trim().min(1, '請輸入活動說明'),
  gradientPreset: z.enum(EVENT_GRADIENT_PRESETS.map((p) => p.id) as [string, ...string[]]),
  isPublished: z.boolean(),
})

export interface EventFormState {
  error: string | null
}

function parseFormData(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get('title'),
    eventDate: formData.get('eventDate'),
    location: formData.get('location'),
    category: formData.get('category'),
    summary: formData.get('summary'),
    gradientPreset: formData.get('gradientPreset'),
    isPublished: formData.get('isPublished') === 'on',
  })
}

export async function createEvent(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdminSession()

  const parsed = parseFormData(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式錯誤' }
  }

  await db.insert(events).values(parsed.data)

  revalidatePath('/events')
  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function updateEvent(id: string, _prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdminSession()

  const parsed = parseFormData(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式錯誤' }
  }

  await db.update(events).set({ ...parsed.data, updatedAt: new Date() }).where(eq(events.id, id))

  revalidatePath('/events')
  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdminSession()
  await db.delete(events).where(eq(events.id, id))
  revalidatePath('/events')
  revalidatePath('/admin/events')
}
