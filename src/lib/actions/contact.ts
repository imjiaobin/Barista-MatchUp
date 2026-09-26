'use server'

import { z } from 'zod'
import { db } from '../../db/client'
import { contactSubmissions } from '../../db/schema'
import {
  BUDGET_RANGES,
  DRINK_TYPES,
  INQUIRY_EVENT_TYPES,
  POWER_SUPPLY_OPTIONS,
  PREFERRED_CONTACT_METHODS,
  TAIWAN_CITIES,
  VENUE_TYPES,
  WATER_SOURCE_OPTIONS,
} from '../constants'
import { sendContactNotification } from '../email'

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))

const contactSchema = z.object({
  // 一、聯絡人資訊
  contactName: z.string().trim().min(1, '請輸入聯絡人/公司單位').max(200),
  contactPhone: z.string().trim().min(1, '請輸入聯絡電話').max(50),
  contactEmail: z.string().trim().email('請輸入有效的 Email').max(320),
  // 二、活動基本資訊
  eventType: z.enum(INQUIRY_EVENT_TYPES, { message: '請選擇活動性質' }),
  eventCity: z.enum(TAIWAN_CITIES, { message: '請選擇活動縣市' }),
  eventAddress: z.string().trim().min(1, '請輸入活動地點').max(300),
  venueType: z.enum(VENUE_TYPES, { message: '請選擇場地類型' }),
  eventStart: z.string().trim().min(1, '請選擇開始時間'),
  eventEnd: z.string().trim().min(1, '請選擇結束時間'),
  // 三、服務需求
  cupCount: z.coerce.number({ message: '請輸入出杯數量' }).int().positive('出杯數量需大於 0'),
  drinkTypes: z.array(z.enum(DRINK_TYPES)).min(1, '請至少選擇一項飲品品項'),
  dessertNeeded: z.boolean(),
  dessertNotes: optionalText(1000),
  // 四、設備與場地條件
  powerSupply: z.enum(POWER_SUPPLY_OPTIONS).optional().or(z.literal('')),
  waterSource: z.enum(WATER_SOURCE_OPTIONS).optional().or(z.literal('')),
  // 五、預算與備註
  budgetRange: z.enum(BUDGET_RANGES).optional().or(z.literal('')),
  notes: optionalText(4000),
  preferredContactMethod: z.enum(PREFERRED_CONTACT_METHODS).optional().or(z.literal('')),
  // 蜜罐欄位：真實訪客絕對不會填這個（因為是 display:none，瀏覽器的
  // 自動填入也會跳過它），所以只要這裡有值就代表是機器人——
  // 下面會靜默丟棄這筆送出，而不是讓驗證直接失敗。
  website: z.string().optional(),
}).refine((data) => new Date(data.eventEnd) >= new Date(data.eventStart), {
  message: '結束時間不能早於開始時間',
  path: ['eventEnd'],
})

export type ContactFormInput = z.input<typeof contactSchema>

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
    // 蜜罐欄位被觸發 —— 回報成功但不存任何資料，同時在伺服器端記錄一筆
    // log，這樣如果是誤判（例如自動填入造成的），至少有留下痕跡，
    // 不會就這樣悄悄消失。
    console.warn('Contact form honeypot tripped, submission dropped:', { contactEmail: parsed.data.contactEmail })
    return { success: true }
  }

  const data = parsed.data

  await db.insert(contactSubmissions).values({
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    eventType: data.eventType,
    eventCity: data.eventCity,
    eventAddress: data.eventAddress,
    venueType: data.venueType,
    eventStartAt: new Date(data.eventStart),
    eventEndAt: new Date(data.eventEnd),
    cupCount: data.cupCount,
    drinkTypes: data.drinkTypes,
    dessertNeeded: data.dessertNeeded,
    dessertNotes: data.dessertNotes || null,
    powerSupply: data.powerSupply || null,
    waterSource: data.waterSource || null,
    budgetRange: data.budgetRange || null,
    notes: data.notes || null,
    preferredContactMethod: data.preferredContactMethod || null,
  })

  try {
    await sendContactNotification(data)
  } catch (err) {
    // 這筆詢問已經寫入資料庫了；通知信寄送失敗不應該讓訪客看到失敗訊息。
    console.error('Failed to send contact notification email', err)
  }

  return { success: true }
}
