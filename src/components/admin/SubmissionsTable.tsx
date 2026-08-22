'use client'

import type { ContactSubmission } from '../../db/schema'
import { updateSubmissionStatus } from '../../lib/actions/submissions'

const STATUS_LABELS: Record<string, string> = {
  new: '新詢問',
  contacted: '已聯繫',
  archived: '已封存',
}

export default function SubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  if (submissions.length === 0) {
    return <p className="p-6 text-sm text-stone-400 bg-white border border-stone-200">目前沒有詢問紀錄</p>
  }

  return (
    <div className="bg-white border border-stone-200 divide-y divide-stone-100">
      {submissions.map((s) => (
        <div key={s.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-stone-800">{s.name} <span className="text-stone-400 font-normal">· {s.email}</span></p>
              <p className="text-xs text-stone-400 mt-1">
                {new Date(s.createdAt).toLocaleString('zh-TW')}
                {s.eventDate && ` · 活動日期 ${s.eventDate}`}
                {s.eventType && ` · ${s.eventType}`}
                {s.budget && ` · ${s.budget}`}
              </p>
            </div>
            <form
              action={updateSubmissionStatus.bind(null, s.id)}
              onChange={(e) => e.currentTarget.requestSubmit()}
            >
              <select
                name="status" defaultValue={s.status}
                className="text-xs border border-stone-200 px-2 py-1 bg-white"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </form>
          </div>
          {s.message && <p className="text-sm text-stone-600 mt-3 whitespace-pre-wrap">{s.message}</p>}
        </div>
      ))}
    </div>
  )
}
