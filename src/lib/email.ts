import nodemailer from 'nodemailer'

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD is not set')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

interface ContactNotificationInput {
  submissionId: string
  contactName: string
  contactPhone: string
  contactEmail: string
  eventType: string
  eventCity: string
  eventAddress: string
  venueType: string
  eventStart: string
  eventEnd: string
  cupCount: number
  drinkTypes: string[]
  dessertNeeded: boolean
  dessertNotes?: string
  powerSupply?: string
  waterSource?: string
  budgetRange?: string
  notes?: string
  preferredContactMethod?: string
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export async function sendContactNotification(input: ContactNotificationInput): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!to) {
    throw new Error('ADMIN_NOTIFICATION_EMAIL is not set')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const sections: Array<{ title: string; rows: Array<[string, string]> }> = [
    {
      title: '聯絡人資訊',
      rows: [
        ['聯絡人/公司單位', input.contactName],
        ['聯絡電話', input.contactPhone],
        ['Email', input.contactEmail],
        ['希望聯繫方式', input.preferredContactMethod || '未指定'],
      ],
    },
    {
      title: '活動基本資訊',
      rows: [
        ['活動性質', input.eventType],
        ['活動地點', `${input.eventCity} ${input.eventAddress}`],
        ['場地類型', input.venueType],
        ['活動時間', `${formatDateTime(input.eventStart)} — ${formatDateTime(input.eventEnd)}`],
      ],
    },
    {
      title: '服務需求',
      rows: [
        ['預計出杯數量', `${input.cupCount} 杯`],
        ['飲品品項需求', input.drinkTypes.join('、')],
        ['甜點', input.dessertNeeded ? `需要${input.dessertNotes ? `（${input.dessertNotes}）` : ''}` : '不需要'],
      ],
    },
    {
      title: '設備與場地條件',
      rows: [
        ['電源供應', input.powerSupply || '未填寫'],
        ['用水來源', input.waterSource || '未填寫'],
      ],
    },
    {
      title: '預算與備註',
      rows: [
        ['預算範圍', input.budgetRange || '未填寫'],
        ['特殊需求備註', input.notes || '無'],
      ],
    },
  ]

  const html = `
    <h2>新的活動詢問 — ${escapeHtml(input.contactName)}</h2>
    ${sections.map(({ title, rows }) => `
      <h3 style="margin-bottom:4px;color:#4E220F;">${title}</h3>
      <table cellpadding="6" style="border-collapse: collapse; margin-bottom: 16px;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="color:#888;white-space:nowrap;vertical-align:top;">${label}</td>
            <td>${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
    `).join('')}
    ${siteUrl ? `<p><a href="${siteUrl}/admin/submissions/${input.submissionId}">前往後台查看詢問</a></p>` : ''}
  `

  const transporter = getTransporter()
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: `新的活動詢問 - ${input.contactName}`,
    html,
  })
}

interface SurveyInviteInput {
  contactName: string
  contactEmail: string
  surveyToken: string
}

export async function sendSurveyInviteEmail(input: SurveyInviteInput): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const surveyUrl = `${siteUrl}/survey/${input.surveyToken}`

  const html = `
    <h2>感謝您與 Pourfolio 合作！</h2>
    <p>${escapeHtml(input.contactName)} 您好，活動圓滿結束，想邀請您花 1 分鐘填寫滿意度問卷，讓我們持續進步：</p>
    <p><a href="${surveyUrl}">${surveyUrl}</a></p>
  `

  const transporter = getTransporter()
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: input.contactEmail,
    subject: 'Pourfolio 活動滿意度調查',
    html,
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
