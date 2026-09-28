import { DRINK_TYPES } from '../../lib/constants'
import Chip from './Chip'
import { inputClass, labelClass } from './formStyles'
import type { FormState, SetField } from './types'

function dailyAverageHint(start: string, end: string, cupCount: string): string | null {
  const n = Number(cupCount)
  if (!start || !end || !Number.isFinite(n) || n <= 0) return null
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) return null
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  return `共 ${days} 天，約每日 ${Math.ceil(n / days)} 杯`
}

interface ServiceNeedsStepProps {
  form: FormState
  set: SetField
  toggleDrinkType: (type: string) => void
}

export default function ServiceNeedsStep({ form, set, toggleDrinkType }: ServiceNeedsStepProps) {
  const dailyHint = dailyAverageHint(form.eventStart, form.eventEnd, form.cupCount)

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>預計出杯數量</label>
        <input className={inputClass} type="number" min={1} value={form.cupCount} onChange={(e) => set('cupCount', e.target.value)} placeholder="總杯數" />
        {dailyHint && <p className="text-xs text-olive">{dailyHint}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>飲品品項需求（可複選）</label>
        <div className="flex flex-wrap gap-2">
          {DRINK_TYPES.map((t) => (
            <Chip key={t} label={t} active={form.drinkTypes.includes(t)} onClick={() => toggleDrinkType(t)} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className={labelClass}>甜點</label>
        <div className="flex gap-2">
          <Chip label="需要" active={form.dessertNeeded} onClick={() => set('dessertNeeded', true)} />
          <Chip label="不需要" active={!form.dessertNeeded} onClick={() => { set('dessertNeeded', false); set('dessertNotes', '') }} />
        </div>
        {form.dessertNeeded && (
          <input
            className={inputClass} value={form.dessertNotes} onChange={(e) => set('dessertNotes', e.target.value)}
            placeholder="想搭配的甜點類型或數量（選填）"
          />
        )}
      </div>
    </>
  )
}
