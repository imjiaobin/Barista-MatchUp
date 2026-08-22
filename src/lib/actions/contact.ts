'use server'

import { z } from 'zod'
import { db } from '../../db/client'
import { contactSubmissions } from '../../db/schema'
import { sendContactNotification } from '../email'

const contactSchema = z.object({
  name: z.string().trim().min(1, '請輸入姓名').max(200),
  email: z.string().trim().email('請輸入有效的 Email').max(320),
  eventDate: z.string().trim().max(20).optional().or(z.literal('')),
  eventType: z.string().trim().max(100).optional().or(z.literal('')),
  budget: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().max(4000).optional().or(z.literal('')),
  // Honeypot field: real visitors never fill this in (it's hidden via CSS),
  // so anything non-empty here is a bot — silently drop the submission.
  website: z.string().max(0).optional().or(z.literal('')),
})

export interface ContactFormInput {
  name: string
  email: string
  eventDate: string
  eventType: string
  budget: string
  message: string
  website: string
}

export interface ContactActionResult {
  success: boolean
  error?: string
}

export async function submitContactInquiry(input: ContactFormInput): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? '欄位格式錯誤' }
  }

  if (parsed.data.website) {
    // Honeypot tripped — report success to the bot without doing anything.
    return { success: true }
  }

  const data = {
    name: parsed.data.name,
    email: parsed.data.email,
    eventDate: parsed.data.eventDate,
    eventType: parsed.data.eventType,
    budget: parsed.data.budget,
    message: parsed.data.message,
  }

  await db.insert(contactSubmissions).values({
    name: data.name,
    email: data.email,
    eventDate: data.eventDate || null,
    eventType: data.eventType || null,
    budget: data.budget || null,
    message: data.message || null,
  })

  try {
    await sendContactNotification(data)
  } catch (err) {
    // The submission is already persisted; a failed notification email
    // should never surface as a failure to the visitor.
    console.error('Failed to send contact notification email', err)
  }

  return { success: true }
}
