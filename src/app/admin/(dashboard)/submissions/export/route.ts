import { and, desc, eq, gte, lte } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { db } from '../../../../../db/client'
import { contactSubmissions } from '../../../../../db/schema'
import { CONTACT_SUBMISSION_STATUSES, type ContactSubmissionStatus } from '../../../../../lib/constants'
import { requireAdminSession } from '../../../../../lib/session'

// 資料形狀單純（固定欄位的平面表格），手刻跳脫邏輯就夠，不用為了
// 這麼小的問題多裝一個 CSV 套件。
function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(request: NextRequest) {
  await requireAdminSession()

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const eventType = searchParams.get('eventType')
  const eventCity = searchParams.get('eventCity')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')

  const filters = []
  if (status && CONTACT_SUBMISSION_STATUSES.includes(status as ContactSubmissionStatus)) {
    filters.push(eq(contactSubmissions.status, status))
  }
  if (eventType) filters.push(eq(contactSubmissions.eventType, eventType))
  if (eventCity) filters.push(eq(contactSubmissions.eventCity, eventCity))
  if (dateFrom) filters.push(gte(contactSubmissions.createdAt, new Date(dateFrom)))
  if (dateTo) filters.push(lte(contactSubmissions.createdAt, new Date(`${dateTo}T23:59:59`)))

  const rows = filters.length > 0
    ? await db.select().from(contactSubmissions).where(and(...filters)).orderBy(desc(contactSubmissions.createdAt))
    : await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt))

  const headers = [
    '送出時間', '聯絡人', '電話', 'Email', '活動性質', '城市', '地址', '場地類型',
    '活動開始', '活動結束', '出杯數', '飲品品項', '甜點', '電源', '用水',
    '預算', '備註', '聯繫方式', '狀態', '流失原因', '流失備註',
  ]
  const lines = [headers.map(csvEscape).join(',')]

  for (const r of rows) {
    lines.push([
      r.createdAt.toISOString(),
      r.contactName,
      r.contactPhone,
      r.contactEmail,
      r.eventType,
      r.eventCity,
      r.eventAddress,
      r.venueType,
      r.eventStartAt.toISOString(),
      r.eventEndAt.toISOString(),
      String(r.cupCount),
      r.drinkTypes.join('、'),
      r.dessertNeeded ? `需要${r.dessertNotes ? `（${r.dessertNotes}）` : ''}` : '不需要',
      r.powerSupply ?? '',
      r.waterSource ?? '',
      r.budgetRange ?? '',
      r.notes ?? '',
      r.preferredContactMethod ?? '',
      r.status,
      r.lossReason ?? '',
      r.lossReasonNotes ?? '',
    ].map((v) => csvEscape(String(v))).join(','))
  }

  // 開頭加 BOM，讓 Excel 用 Big5/系統預設編碼開啟時不會把中文顯示成亂碼
  const csv = `﻿${lines.join('\r\n')}`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
