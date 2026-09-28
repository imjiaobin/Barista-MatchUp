import { POWER_SUPPLY_OPTIONS, WATER_SOURCE_OPTIONS } from '../../lib/constants'
import Chip from './Chip'
import { labelClass } from './formStyles'
import type { FormState, SetField } from './types'

export default function VenueStep({ form, set }: { form: FormState; set: SetField }) {
  return (
    <>
      <p className="text-sm text-stone-500">這個區塊不確定也沒關係，我們會在確認需求時跟你討論。</p>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>電源供應</label>
        <div className="flex flex-wrap gap-2">
          {POWER_SUPPLY_OPTIONS.map((t) => (
            <Chip key={t} label={t} active={form.powerSupply === t} onClick={() => set('powerSupply', form.powerSupply === t ? '' : t)} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>用水來源</label>
        <div className="flex flex-wrap gap-2">
          {WATER_SOURCE_OPTIONS.map((t) => (
            <Chip key={t} label={t} active={form.waterSource === t} onClick={() => set('waterSource', form.waterSource === t ? '' : t)} />
          ))}
        </div>
      </div>
    </>
  )
}
