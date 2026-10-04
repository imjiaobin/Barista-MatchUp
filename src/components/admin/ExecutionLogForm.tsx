'use client'

import { useActionState } from 'react'
import type { EventExecutionLog } from '../../db/schema'
import { upsertExecutionLog, type ExecutionLogFormState } from '../../lib/actions/executionLogs'

const initialState: ExecutionLogFormState = { error: null }

// <input type="datetime-local"> 要吃 "YYYY-MM-DDTHH:mm" 格式，跟
// Date/ISO 字串不同，所以存進去前後都要轉換一次。
function toInputValue(value: Date | string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const inputClass = 'border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-caramel'
const labelClass = 'text-xs tracking-widest uppercase text-stone-400'

export default function ExecutionLogForm({ submissionId, log }: { submissionId: string; log: EventExecutionLog | null }) {
  const [state, formAction, pending] = useActionState(upsertExecutionLog.bind(null, submissionId), initialState)

  return (
    <form action={formAction} className="bg-white border border-stone-200 p-6 text-sm flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>到場時間</label>
          <input type="datetime-local" name="arrivalAt" defaultValue={toInputValue(log?.arrivalAt)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>完成布置時間</label>
          <input type="datetime-local" name="setupAt" defaultValue={toInputValue(log?.setupAt)} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>實際活動時長（分鐘）</label>
        <input type="number" min="0" name="actualDurationMinutes" defaultValue={log?.actualDurationMinutes ?? ''} className={`${inputClass} w-40`} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>現場聯絡人</label>
          <input name="onsiteContactName" defaultValue={log?.onsiteContactName ?? ''} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>現場聯絡電話</label>
          <input name="onsiteContactPhone" defaultValue={log?.onsiteContactPhone ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>緊急聯絡人</label>
          <input name="emergencyContactName" defaultValue={log?.emergencyContactName ?? ''} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>緊急聯絡電話</label>
          <input name="emergencyContactPhone" defaultValue={log?.emergencyContactPhone ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>現場備註</label>
        <textarea
          name="onsiteNotes" defaultValue={log?.onsiteNotes ?? ''} rows={3}
          placeholder="臨時狀況、客戶額外需求等"
          className={`${inputClass} resize-none`}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" name="closedSmoothly" defaultChecked={log?.closedSmoothly ?? false} className="accent-caramel" />
        活動順利結案
      </label>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>後續待辦備註</label>
        <textarea
          name="followUpNotes" defaultValue={log?.followUpNotes ?? ''} rows={2}
          placeholder="若有未結事項請在此記錄"
          className={`${inputClass} resize-none`}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="self-start bg-caramel text-white px-6 py-3 text-sm disabled:opacity-50">
        {pending ? '儲存中...' : '儲存執行紀錄'}
      </button>
    </form>
  )
}
