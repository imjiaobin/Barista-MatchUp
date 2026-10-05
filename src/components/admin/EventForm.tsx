'use client'

import { useActionState } from 'react'
import type { Event } from '../../db/schema'
import type { EventFormState } from '../../lib/actions/events'
import { EVENT_CATEGORIES, EVENT_GRADIENT_PRESETS } from '../../lib/constants'
import { ButtonLink } from './ui/Button'
import { Card, CardBody, CardHeader } from './ui/Card'
import { Field, FormAlert, Input, Select, Switch, Textarea } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

// 模板 5.3：表單元件。新增與編輯共用；依主題分卡片；底部 sticky 操作列。
const initialState: EventFormState = { error: null }

export default function EventForm({ event, action }: {
  event?: Event
  action: (prev: EventFormState, formData: FormData) => Promise<EventFormState>
}) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      {state.error && <FormAlert>{state.error}</FormAlert>}

      <Card>
        <CardHeader title="基本資訊" description="顯示於前台活動列表與卡片" />
        <CardBody className="flex flex-col gap-5">
          <Field label="標題" htmlFor="title" required>
            <Input id="title" name="title" defaultValue={event?.title} required maxLength={200} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="日期" htmlFor="eventDate" required>
              <Input id="eventDate" name="eventDate" type="date" defaultValue={event?.eventDate} required />
            </Field>
            <Field label="地點" htmlFor="location" required>
              <Input id="location" name="location" defaultValue={event?.location} required maxLength={100} />
            </Field>
          </div>
          <Field label="活動說明" htmlFor="summary" required>
            <Textarea id="summary" name="summary" defaultValue={event?.summary} rows={4} required />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="呈現方式" />
        <CardBody className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="分類" htmlFor="category" required>
              <Select id="category" name="category" defaultValue={event?.category ?? EVENT_CATEGORIES[0]} required>
                {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="背景配色" htmlFor="gradientPreset" required>
              <Select id="gradientPreset" name="gradientPreset" defaultValue={event?.gradientPreset ?? EVENT_GRADIENT_PRESETS[0].id} required>
                {EVENT_GRADIENT_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </Select>
            </Field>
          </div>
          <Switch name="isPublished" defaultChecked={event?.isPublished ?? true} label="發布於前台" />
        </CardBody>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ButtonLink href="/admin/events" variant="secondary">取消</ButtonLink>
        <SubmitButton pendingText="儲存中…">{event ? '儲存變更' : '新增活動'}</SubmitButton>
      </div>
    </form>
  )
}
