import { INQUIRY_EVENT_TYPES, TAIWAN_CITIES, VENUE_TYPES } from '../../lib/constants'
import Chip from './Chip'
import { inputClass, labelClass } from './formStyles'
import type { FormState, SetField } from './types'

export default function EventInfoStep({ form, set }: { form: FormState; set: SetField }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>活動性質</label>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_EVENT_TYPES.map((t) => (
            <Chip key={t} label={t} active={form.eventType === t} onClick={() => set('eventType', t)} />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>縣市</label>
          <select className={inputClass} value={form.eventCity} onChange={(e) => set('eventCity', e.target.value)}>
            <option value="">請選擇</option>
            {TAIWAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>詳細地址</label>
          <input className={inputClass} value={form.eventAddress} onChange={(e) => set('eventAddress', e.target.value)} placeholder="街道、樓層等" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>場地類型</label>
        <div className="flex flex-wrap gap-2">
          {VENUE_TYPES.map((t) => (
            <Chip key={t} label={t} active={form.venueType === t} onClick={() => set('venueType', t)} />
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>開始時間</label>
          <input className={inputClass} type="datetime-local" value={form.eventStart} onChange={(e) => set('eventStart', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>結束時間</label>
          <input className={inputClass} type="datetime-local" value={form.eventEnd} onChange={(e) => set('eventEnd', e.target.value)} />
        </div>
      </div>
    </>
  )
}
