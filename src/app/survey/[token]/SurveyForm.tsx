'use client'

import { useActionState, useState } from 'react'
import { labelClass, inputClass } from '../../../components/contact/formStyles'
import { submitSatisfactionSurvey, type SurveySubmitState } from '../../../lib/actions/surveySubmission'

const initialState: SurveySubmitState = { success: false, error: null }

export default function SurveyForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(submitSatisfactionSurvey.bind(null, token), initialState)
  const [rating, setRating] = useState<number | null>(null)

  if (state.success) {
    return <p className="text-stone-600 leading-relaxed">感謝您的填寫！您的回饋對我們非常重要。</p>
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className={labelClass}>整體滿意度</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio" name="rating" value={n} required
                className="sr-only peer"
                onChange={() => setRating(n)}
              />
              <span
                className={`flex items-center justify-center w-12 h-12 border text-sm transition-colors duration-200 ${
                  rating === n ? 'bg-caramel text-white border-caramel' : 'border-stone-200 text-stone-500'
                }`}
              >
                {n}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>想告訴我們的話（選填）</label>
        <textarea name="feedback" rows={4} className={`${inputClass} resize-none`} placeholder="任何建議或感想都歡迎" />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary bg-caramel disabled:opacity-50 self-start">
        {pending ? '送出中...' : '送出回饋'}
      </button>
    </form>
  )
}
