'use client'

import { useActionState } from 'react'
import type { PageContentRow } from '../../db/schema'
import type { ContentFormState } from '../../lib/actions/content'
import { Card, CardBody, CardHeader } from './ui/Card'
import { Field, FormAlert, Textarea } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

const initialState: ContentFormState = { error: null, success: false }

interface ContentEditorProps {
  title: string
  rows: PageContentRow[]
  action: (prevState: ContentFormState, formData: FormData) => Promise<ContentFormState>
}

// 一個頁面一張卡片、一組儲存。每個欄位對應一個 section_key。
export default function ContentEditor({ title, rows, action }: ContentEditorProps) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <Card>
      <CardHeader title={title} />
      <CardBody>
        <form action={formAction} className="flex max-w-3xl flex-col gap-5">
          {state.success && <FormAlert tone="success">已儲存</FormAlert>}
          {state.error && <FormAlert>{state.error}</FormAlert>}
          {rows.map((row) => (
            <Field key={row.sectionKey} label={row.label} htmlFor={`content-${row.sectionKey}`}>
              <Textarea id={`content-${row.sectionKey}`} name={`content:${row.sectionKey}`} defaultValue={row.content} rows={2} />
            </Field>
          ))}
          <div className="flex justify-end">
            <SubmitButton pendingText="儲存中…">儲存變更</SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
