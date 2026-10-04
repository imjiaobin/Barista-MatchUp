'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { ContactSubmission } from '../../db/schema'
import DetailRow from './DetailRow'
import StatusControl from './StatusControl'

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function SubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (submissions.length === 0) {
    return <p className="p-6 text-sm text-stone-400 bg-white border border-stone-200">目前沒有詢問紀錄</p>
  }

  return (
    <div className="bg-white border border-stone-200 divide-y divide-stone-100">
      {submissions.map((s) => {
        const isExpanded = expandedId === s.id
        return (
          <div key={s.id}>
            <div className="p-5 flex flex-wrap items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="flex items-start gap-2 text-left min-w-0"
              >
                {isExpanded ? <FiChevronUp size={16} className="mt-1 text-stone-400 shrink-0" /> : <FiChevronDown size={16} className="mt-1 text-stone-400 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800">
                    {s.contactName} <span className="text-stone-400 font-normal">· {s.eventType} · {s.eventCity}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    送出於 {formatDateTime(s.createdAt)} · 活動時間 {formatDateTime(s.eventStartAt)} · {s.cupCount} 杯
                  </p>
                </div>
              </button>
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/admin/submissions/${s.id}`}
                  className="text-xs text-caramel hover:underline"
                >
                  查看完整詳情 →
                </Link>
                <StatusControl submission={s} />
              </div>
            </div>

            {isExpanded && (
              <div className="px-5 pb-5 text-sm">
                <div className="grid md:grid-cols-2 gap-x-10">
                  <div>
                    <p className="section-label mb-2">聯絡人資訊</p>
                    <DetailRow label="聯絡人 / 公司單位" value={s.contactName} />
                    <DetailRow label="聯絡電話" value={s.contactPhone} />
                    <DetailRow label="Email" value={s.contactEmail} />
                    <DetailRow label="希望聯繫方式" value={s.preferredContactMethod || '未指定'} />

                    <p className="section-label mb-2 mt-6">活動基本資訊</p>
                    <DetailRow label="活動性質" value={s.eventType} />
                    <DetailRow label="活動地點" value={`${s.eventCity} ${s.eventAddress}`} />
                    <DetailRow label="場地類型" value={s.venueType} />
                    <DetailRow label="活動時間" value={`${formatDateTime(s.eventStartAt)} — ${formatDateTime(s.eventEndAt)}`} />
                  </div>
                  <div>
                    <p className="section-label mb-2">服務需求</p>
                    <DetailRow label="預計出杯數量" value={`${s.cupCount} 杯`} />
                    <DetailRow label="飲品品項需求" value={s.drinkTypes.join('、')} />
                    <DetailRow label="甜點" value={s.dessertNeeded ? `需要${s.dessertNotes ? `（${s.dessertNotes}）` : ''}` : '不需要'} />

                    <p className="section-label mb-2 mt-6">設備與場地條件</p>
                    <DetailRow label="電源供應" value={s.powerSupply || '未填寫'} />
                    <DetailRow label="用水來源" value={s.waterSource || '未填寫'} />

                    <p className="section-label mb-2 mt-6">預算與備註</p>
                    <DetailRow label="預算範圍" value={s.budgetRange || '未填寫'} />
                    <DetailRow label="特殊需求備註" value={s.notes || '無'} />

                    {s.status === 'lost' && (
                      <>
                        <p className="section-label mb-2 mt-6">流失原因</p>
                        <DetailRow label="原因" value={s.lossReason || '未填寫'} />
                        <DetailRow label="備註" value={s.lossReasonNotes || '無'} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
