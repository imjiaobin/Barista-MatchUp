import { BUDGET_RANGES, PREFERRED_CONTACT_METHODS } from '../../lib/constants'
import Chip from './Chip'
import { inputClass, labelClass } from './formStyles'
import type { FormState, SetField } from './types'

export default function BudgetStep({ form, set }: { form: FormState; set: SetField }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>預算範圍</label>
        <div className="flex flex-wrap gap-2">
          {BUDGET_RANGES.map((t) => (
            <Chip key={t} label={t} active={form.budgetRange === t} onClick={() => set('budgetRange', form.budgetRange === t ? '' : t)} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>希望的聯繫方式</label>
        <div className="flex flex-wrap gap-2">
          {PREFERRED_CONTACT_METHODS.map((t) => (
            <Chip key={t} label={t} active={form.preferredContactMethod === t} onClick={() => set('preferredContactMethod', form.preferredContactMethod === t ? '' : t)} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>特殊需求備註</label>
        <textarea
          className={`${inputClass} resize-none`} rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)}
          placeholder="自由填寫任何未涵蓋的需求"
        />
      </div>
    </>
  )
}
