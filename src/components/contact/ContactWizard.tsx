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
import ProgressBar from './ProgressBar'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import SubmittedMessage from './SubmittedMessage'
import type { FormState } from './types'

const STORAGE_KEY = 'pourfolio_contact_draft'
const STEP_LABELS = ['聯絡人資訊', '活動基本資訊', '服務需求', '設備與場地', '預算與備註', '確認送出']

const initialState: FormState = {
  contactName: '', contactPhone: '', contactEmail: '',
  eventType: '', eventCity: '', eventAddress: '', venueType: '', eventStart: '', eventEnd: '',
  cupCount: '', drinkTypes: [], dessertNeeded: false, dessertNotes: '',
  powerSupply: '', waterSource: '',
  budgetRange: '', notes: '', preferredContactMethod: '電話',
  website: '',
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
  if (step === 4) {
    if (!form.budgetRange) return '請選擇預算範圍'
    if (!form.preferredContactMethod) return '請選擇希望的聯繫方式'
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
    return <SubmittedMessage />
  }

  return (
    <div>
      <ProgressBar step={step} stepLabels={STEP_LABELS} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {step === 0 && <Step1 form={form} set={set} />}
          {step === 1 && <Step2 form={form} set={set} />}
          {step === 2 && <Step3 form={form} set={set} toggleDrinkType={toggleDrinkType} />}
          {step === 3 && <Step4 form={form} set={set} />}
          {step === 4 && <Step5 form={form} set={set} />}
          {step === 5 && <Step6 form={form} />}
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
