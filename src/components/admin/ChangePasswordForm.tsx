'use client'

import { useActionState } from 'react'
import { changePassword, type ChangePasswordState } from '../../lib/actions/auth'

const initialState: ChangePasswordState = { error: null, success: false }

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-sm bg-white border border-stone-200 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">目前密碼</label>
        <input
          name="currentPassword" type="password" required
          className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-stone-400">新密碼（至少 8 個字元）</label>
        <input
          name="newPassword" type="password" required minLength={8}
          className="border border-stone-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brown"
        />
      </div>
      {state.success && <p className="text-sm text-olive">密碼已更新</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary self-start disabled:opacity-50">
        {pending ? '更新中...' : '更新密碼'}
      </button>
    </form>
  )
}
