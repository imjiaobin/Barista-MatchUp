import { inputClass, labelClass } from './formStyles'
import type { FormState, SetField } from './types'

export default function Step1({ form, set }: { form: FormState; set: SetField }) {
  return (
    <>
      <p className="text-sm md:text-base text-stone-500">告訴我們怎麼聯絡到你，媒合成功後我們會直接跟你確認細節。</p>
      <div className="flex flex-col gap-2">
        <label className={labelClass}>聯絡人 / 公司單位</label>
        <input className={inputClass} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="王小明 / OO 品牌" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>聯絡電話</label>
          <input className={inputClass} type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="供媒合成功後聯繫" />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Email</label>
          <input className={inputClass} type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="hello@example.com" />
        </div>
      </div>
    </>
  )
}
