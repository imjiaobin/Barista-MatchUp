import type { FormState } from './types'

export default function ReviewStep({ form }: { form: FormState }) {
  const rows: [string, string][] = [
    ['聯絡人 / 公司單位', form.contactName],
    ['聯絡電話', form.contactPhone],
    ['Email', form.contactEmail],
    ['活動性質', form.eventType],
    ['活動地點', `${form.eventCity} ${form.eventAddress}`],
    ['場地類型', form.venueType],
    ['活動時間', form.eventStart && form.eventEnd ? `${form.eventStart.replace('T', ' ')} — ${form.eventEnd.replace('T', ' ')}` : ''],
    ['預計出杯數量', form.cupCount ? `${form.cupCount} 杯` : ''],
    ['飲品品項需求', form.drinkTypes.join('、')],
    ['甜點', form.dessertNeeded ? `需要${form.dessertNotes ? `（${form.dessertNotes}）` : ''}` : '不需要'],
    ['電源供應', form.powerSupply || '未填寫'],
    ['用水來源', form.waterSource || '未填寫'],
    ['預算範圍', form.budgetRange || '未填寫'],
    ['希望的聯繫方式', form.preferredContactMethod || '未指定'],
    ['特殊需求備註', form.notes || '無'],
  ]

  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="text-stone-500">送出前，麻煩再確認一下這些內容：</p>
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-6 border-b border-stone-100 pb-2">
          <span className="text-stone-600 shrink-0">{label}</span>
          <span className="text-stone-700 text-right">{value}</span>
        </div>
      ))}
    </div>
  )
}
