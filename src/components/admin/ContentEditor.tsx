'use client'

import { useActionState } from 'react'
import type { PageContentRow } from '../../db/schema'
import type { ContentFormState } from '../../lib/actions/content'

const initialState: ContentFormState = { error: null, success: false }

interface ContentEditorProps {
  title: string
  rows: PageContentRow[]
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>
}

export default function ContentEditor({ title, rows, action }: ContentEditorProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <section className="mb-12">
      <h2 className="text-lg font-medium text-stone-800 mb-4">{title}</h2>
      <form action={formAction} className="flex flex-col gap-5 bg-white border border-stone-200 p-6">
        {rows.map((row) => (
          <div key={row.sectionKey} className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-stone-400">{row.label}</label>
            <textarea
              name={`content:${row.sectionKey}`} defaultValue={row.content} rows={2}
              className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown resize-none"
            />
          </div>
        ))}
        {state.success && <p className="text-sm text-olive">已儲存</p>}
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary self-start disabled:opacity-50">
          {pending ? '儲存中...' : '儲存變更'}
        </button>
      </form>
    </section>
  )
}
