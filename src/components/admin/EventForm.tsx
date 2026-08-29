'use client'

import { useActionState } from 'react'
import type { Event } from '../../db/schema'
import { EVENT_CATEGORIES, EVENT_GRADIENT_PRESETS } from '../../lib/constants'
import type { EventFormState } from '../../lib/actions/events'

const initialState: EventFormState = { error: null }

interface EventFormProps {
  event?: Event
  action: (prevState: EventFormState, formData: FormData) => Promise<EventFormState>
}

export default function EventForm({ event, action }: EventFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">標題</label>
        <input
          name="title" defaultValue={event?.title} required
          className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-stone-400">日期</label>
          <input
            name="eventDate" type="date" defaultValue={event?.eventDate} required
            className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-stone-400">地點</label>
          <input
            name="location" defaultValue={event?.location} required
            className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-stone-400">分類</label>
          <select
            name="category" defaultValue={event?.category ?? EVENT_CATEGORIES[0]} required
            className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
          >
            {EVENT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-stone-400">背景配色</label>
          <select
            name="gradientPreset" defaultValue={event?.gradientPreset ?? EVENT_GRADIENT_PRESETS[0].id} required
            className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
          >
            {EVENT_GRADIENT_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">活動說明</label>
        <textarea
          name="summary" defaultValue={event?.summary} rows={4} required
          className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown resize-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" name="isPublished" defaultChecked={event?.isPublished ?? true} />
        發布於前台
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary self-start disabled:opacity-50">
        {pending ? '儲存中...' : '儲存'}
      </button>
    </form>
  )
}
