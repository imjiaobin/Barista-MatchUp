import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { db } from '../../../db/client'
import { contactSubmissions, events } from '../../../db/schema'
import { requireAdminSession } from '../../../lib/session'

export default async function AdminDashboardPage() {
  await requireAdminSession()

  const [allEvents, newSubmissions] = await Promise.all([
    db.select().from(events),
    db.select().from(contactSubmissions).where(eq(contactSubmissions.status, 'new')),
  ])

  const cards = [
    { label: '活動總數', value: allEvents.length, href: '/admin/events' },
    { label: '待處理詢問', value: newSubmissions.length, href: '/admin/submissions' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">後台總覽</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ label, value, href }) => (
          <Link key={label} href={href} className="bg-white border border-stone-200 p-6 hover:border-brown transition-colors duration-200">
            <p className="text-3xl font-light text-brown">{value}</p>
            <p className="text-sm text-stone-500 mt-2">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
