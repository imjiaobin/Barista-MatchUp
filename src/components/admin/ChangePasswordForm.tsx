'use client'

import { useActionState } from 'react'
import { changePassword, type ChangePasswordState } from '../../lib/actions/auth'
import { Field, FormAlert, Input } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

const initialState: ChangePasswordState = { error: null, success: false }

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState)
  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-5">
      <Field label="目前密碼" htmlFor="currentPassword" required>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="新密碼" htmlFor="newPassword" required hint="至少 8 個字元">
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      {state.success && <FormAlert tone="success">密碼已更新</FormAlert>}
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <SubmitButton pendingText="更新中…" className="self-start">更新密碼</SubmitButton>
    </form>
  )
}
