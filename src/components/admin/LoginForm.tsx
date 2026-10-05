'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../../lib/actions/auth'
import { Field, FormAlert, Input } from './ui/Field'
import { SubmitButton } from './ui/SubmitButton'

const initialState: LoginState = { error: null }

// 錯誤訊息不透露帳號是否存在（由 login action 統一回傳）
export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState)
  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Field label="帳號" htmlFor="username" required>
        <Input id="username" name="username" autoComplete="username" required autoFocus />
      </Field>
      <Field label="密碼" htmlFor="password" required>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton pendingText="登入中…" className="w-full">登入</SubmitButton>
    </form>
  )
}
