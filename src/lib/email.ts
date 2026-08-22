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
  name: string
  email: string
  eventDate?: string
  eventType?: string
  budget?: string
  message?: string
}

export async function sendContactNotification(input: ContactNotificationInput): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!to) {
    throw new Error('ADMIN_NOTIFICATION_EMAIL is not set')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const rows: Array<[string, string]> = [
    ['姓名 / 公司', input.name],
    ['Email', input.email],
    ['活動日期', input.eventDate || '未填寫'],
    ['活動類型', input.eventType || '未填寫'],
    ['預算範圍', input.budget || '未填寫'],
    ['活動說明', input.message || '未填寫'],
  ]

  const html = `
    <h2>新的活動詢問</h2>
    <table cellpadding="6" style="border-collapse: collapse;">
      ${rows.map(([label, value]) => `
        <tr>
          <td style="color:#888;white-space:nowrap;">${label}</td>
          <td>${escapeHtml(value)}</td>
        </tr>
      `).join('')}
    </table>
    ${siteUrl ? `<p><a href="${siteUrl}/admin/submissions">前往後台查看</a></p>` : ''}
  `

  const transporter = getTransporter()
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: `新的活動詢問 - ${input.name}`,
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
