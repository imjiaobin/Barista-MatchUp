'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi'
import { submitContactInquiry } from '../../lib/actions/contact'
import {
  BUDGET_RANGES,
  DRINK_TYPES,
  INQUIRY_EVENT_TYPES,
  POWER_SUPPLY_OPTIONS,
  PREFERRED_CONTACT_METHODS,
  TAIWAN_CITIES,
  VENUE_TYPES,
  WATER_SOURCE_OPTIONS,
} from '../../lib/constants'

const STORAGE_KEY = 'pourfolio_contact_draft'
const STEP_LABELS = ['聯絡人資訊', '活動基本資訊', '服務需求', '設備與場地', '預算與備註', '確認送出']

interface FormState {
  contactName: string
  contactPhone: string
  contactEmail: string
  eventType: string
  eventCity: string
  eventAddress: string
  venueType: string
  eventStart: string
  eventEnd: string
  cupCount: string
  drinkTypes: string[]
  dessertNeeded: boolean
  dessertNotes: string
  powerSupply: string
  waterSource: string
  budgetRange: string
  notes: string
  preferredContactMethod: string
  website: string
}

const initialState: FormState = {
  contactName: '', contactPhone: '', contactEmail: '',
  eventType: '', eventCity: '', eventAddress: '', venueType: '', eventStart: '', eventEnd: '',
  cupCount: '', drinkTypes: [], dessertNeeded: false, dessertNotes: '',
  powerSupply: '', waterSource: '',
  budgetRange: '', notes: '', preferredContactMethod: '',
  website: '',
}

const inputClass = 'border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200 w-full'
const labelClass = 'text-xs tracking-widest uppercase text-stone-600'

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm border transition-colors duration-200 ${
        active ? 'bg-indigo text-white border-indigo' : 'border-stone-200 text-stone-600 hover:border-brown hover:text-brown'
      }`}
    >
      {label}
    </button>
  )
}

function dailyAverageHint(start: string, end: string, cupCount: string): string | null {
  const n = Number(cupCount)
  if (!start || !end || !Number.isFinite(n) || n <= 0) return null
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) return null
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  return `共 ${days} 天，約每日 ${Math.ceil(n / days)} 杯`
}

function validateStep(step: number, form: FormState): string | null {
  if (step === 0) {
    if (!form.contactName.trim()) return '請輸入聯絡人/公司單位'
    if (!form.contactPhone.trim()) return '請輸入聯絡電話'
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail.trim())) return '請輸入有效的 Email'
  }
  if (step === 1) {
    if (!form.eventType) return '請選擇活動性質'
    if (!form.eventCity) return '請選擇活動縣市'
    if (!form.eventAddress.trim()) return '請輸入活動地點'
    if (!form.venueType) return '請選擇場地類型'
    if (!form.eventStart || !form.eventEnd) return '請選擇活動起訖時間'
    if (new Date(form.eventEnd) < new Date(form.eventStart)) return '結束時間不能早於開始時間'
  }
  if (step === 2) {
    const n = Number(form.cupCount)
    if (!Number.isFinite(n) || n <= 0) return '請輸入預計出杯數量'
    if (form.drinkTypes.length === 0) return '請至少選擇一項飲品品項'
  }
  return null
}

export default function ContactWizard() {
  const [form, setForm] = useState<FormState>(initialState)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      // 掛載時從 sessionStorage 還原草稿，是從外部系統做的一次性同步，
      // 不是從 props/state 衍生出來的狀態。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setForm({ ...initialState, ...JSON.parse(saved) })
    } catch {
      // 忽略格式錯誤或無法使用的 storage
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {
      // storage 可能無法使用（例如無痕模式）—— 草稿保存只是盡力而為
    }
  }, [form, restored])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleDrinkType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      drinkTypes: prev.drinkTypes.includes(type)
        ? prev.drinkTypes.filter((t) => t !== type)
        : [...prev.drinkTypes, type],
    }))
  }

  const goNext = () => {
    const err = validateStep(step, form)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
  }

  const goBack = () => {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    const result = await submitContactInquiry({
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      eventType: form.eventType as typeof INQUIRY_EVENT_TYPES[number],
      eventCity: form.eventCity as typeof TAIWAN_CITIES[number],
      eventAddress: form.eventAddress,
      venueType: form.venueType as typeof VENUE_TYPES[number],
      eventStart: form.eventStart,
      eventEnd: form.eventEnd,
      cupCount: Number(form.cupCount),
      drinkTypes: form.drinkTypes as typeof DRINK_TYPES[number][],
      dessertNeeded: form.dessertNeeded,
      dessertNotes: form.dessertNotes,
      powerSupply: form.powerSupply as typeof POWER_SUPPLY_OPTIONS[number] | '',
      waterSource: form.waterSource as typeof WATER_SOURCE_OPTIONS[number] | '',
      budgetRange: form.budgetRange as typeof BUDGET_RANGES[number] | '',
      notes: form.notes,
      preferredContactMethod: form.preferredContactMethod as typeof PREFERRED_CONTACT_METHODS[number] | '',
      website: form.website,
    })

    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* 盡力而為 */ }
    } else {
      setError(result.error ?? '送出失敗，請稍後再試')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mb-6">
          <FiSend size={24} className="text-olive" />
        </div>
        <h3 className="text-2xl font-light text-stone-800 mb-3">已收到你的需求</h3>
        <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
          我們會在 48 小時內與你聯繫，提供適合的咖啡師推薦。
        </p>
      </motion.div>
    )
  }

  const dailyHint = dailyAverageHint(form.eventStart, form.eventEnd, form.cupCount)

  return (
    <div>
      {/* 進度條 */}
      <div className="flex items-center gap-2 mb-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-brown' : 'bg-stone-300'}`} />
        ))}
      </div>
      <p className="text-xs font-medium tracking-wide text-stone-600 mb-8">
        步驟 {step + 1} / {STEP_LABELS.length} · {STEP_LABELS[step]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {step === 0 && (
            <>
              <p className="text-sm text-stone-500">告訴我們怎麼聯絡到你，媒合成功後我們會直接跟你確認細節。</p>
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
          )}

          {step === 1 && (
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
          )}

          {step === 2 && (
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
          )}

          {step === 3 && (
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
          )}

          {step === 4 && (
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
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-stone-500">送出前，麻煩再確認一下這些內容：</p>
              {[
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
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 border-b border-stone-100 pb-2">
                  <span className="text-stone-600 shrink-0">{label}</span>
                  <span className="text-stone-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 蜜罐欄位 —— 用 display:none（不是移到畫面外的定位方式），
          這樣瀏覽器的自動填入也會跳過它；移到畫面外但仍是可見狀態的欄位，
          就算 name/autocomplete 沒對上，還是會被 Chrome 的個人資料自動填入。 */}
      <input
        type="text" value={form.website} onChange={(e) => set('website', e.target.value)}
        tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="hidden"
      />

      {error && <p className="text-sm text-red-600 mt-6">{error}</p>}

      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button type="button" onClick={goBack} className="btn-outline flex items-center gap-2 text-xs py-2 px-5">
            <FiChevronLeft size={14} /> 上一步
          </button>
        ) : <span />}

        {step < STEP_LABELS.length - 1 ? (
          <button type="button" onClick={goNext} className="btn-primary flex items-center gap-2">
            下一步 <FiChevronRight size={14} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <FiSend size={14} /> {submitting ? '送出中...' : '送出需求'}
          </button>
        )}
      </div>
    </div>
  )
}
