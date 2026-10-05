'use client'

import { useActionState } from 'react'
import type { EventExecutionLog } from '../../db/schema'
import { upsertExecutionLog, type ExecutionLogFormState } from '../../lib/actions/executionLogs'
import { Field, FormAlert, Input, Switch, Textarea } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

const initialState: ExecutionLogFormState = { error: null }

// <input type="datetime-local"> 要吃 "YYYY-MM-DDTHH:mm" 格式，跟
// Date/ISO 字串不同，所以存進去前後都要轉換一次。
function toInputValue(value: Date | string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ExecutionLogForm({ submissionId, log }: { submissionId: string; log: EventExecutionLog | null }) {
  const [state, formAction] = useActionState(upsertExecutionLog.bind(null, submissionId), initialState)

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      {state.error && <FormAlert>{state.error}</FormAlert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="到場時間" htmlFor="exec-arrivalAt">
          <Input id="exec-arrivalAt" type="datetime-local" name="arrivalAt" defaultValue={toInputValue(log?.arrivalAt)} />
        </Field>
        <Field label="完成布置時間" htmlFor="exec-setupAt">
          <Input id="exec-setupAt" type="datetime-local" name="setupAt" defaultValue={toInputValue(log?.setupAt)} />
        </Field>
      </div>

      <Field label="實際活動時長（分鐘）" htmlFor="exec-duration" className="sm:w-48">
        <Input id="exec-duration" type="number" min="0" name="actualDurationMinutes" defaultValue={log?.actualDurationMinutes ?? ''} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="現場聯絡人" htmlFor="exec-onsiteName">
          <Input id="exec-onsiteName" name="onsiteContactName" defaultValue={log?.onsiteContactName ?? ''} />
        </Field>
        <Field label="現場聯絡電話" htmlFor="exec-onsitePhone">
          <Input id="exec-onsitePhone" name="onsiteContactPhone" defaultValue={log?.onsiteContactPhone ?? ''} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="緊急聯絡人" htmlFor="exec-emergencyName">
          <Input id="exec-emergencyName" name="emergencyContactName" defaultValue={log?.emergencyContactName ?? ''} />
        </Field>
        <Field label="緊急聯絡電話" htmlFor="exec-emergencyPhone">
          <Input id="exec-emergencyPhone" name="emergencyContactPhone" defaultValue={log?.emergencyContactPhone ?? ''} />
        </Field>
      </div>

      <Field label="現場備註" htmlFor="exec-onsiteNotes">
        <Textarea id="exec-onsiteNotes" name="onsiteNotes" defaultValue={log?.onsiteNotes ?? ''} rows={3} placeholder="臨時狀況、客戶額外需求等" />
      </Field>

      <Switch name="closedSmoothly" defaultChecked={log?.closedSmoothly ?? false} label="活動順利結案" />

      <Field label="後續待辦備註" htmlFor="exec-followUpNotes">
        <Textarea id="exec-followUpNotes" name="followUpNotes" defaultValue={log?.followUpNotes ?? ''} rows={2} placeholder="若有未結事項請在此記錄" />
      </Field>

      <div className="flex justify-end">
        <SubmitButton pendingText="儲存中…">儲存執行紀錄</SubmitButton>
      </div>
    </form>
  )
}
