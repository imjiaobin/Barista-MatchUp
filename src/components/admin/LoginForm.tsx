'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../../lib/actions/auth'

const initialState: LoginState = { error: null }

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full max-w-sm">
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">帳號</label>
        <input
          name="username" required autoFocus
          className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">密碼</label>
        <input
          name="password" type="password" required
          className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
        {pending ? '登入中...' : '登入'}
      </button>
    </form>
  )
}
