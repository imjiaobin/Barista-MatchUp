'use server'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '../../db/client'
import { adminUsers } from '../../db/schema'
import { ADMIN_SESSION_COOKIE, SESSION_DURATION_SECONDS, createSessionToken, hashPassword, verifyPassword } from '../auth'
import { requireAdminSession } from '../session'

export interface LoginState {
  error: string | null
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!username || !password) {
    return { error: '請輸入帳號與密碼' }
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1)

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: '帳號或密碼錯誤' }
  }

  const token = await createSessionToken({ sub: user.id, username: user.username })
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  })

  redirect('/admin')
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
  redirect('/admin/login')
}

export interface ChangePasswordState {
  error: string | null
  success: boolean
}

export async function changePassword(_prevState: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const session = await requireAdminSession()

  const currentPassword = String(formData.get('currentPassword') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')

  if (!currentPassword || !newPassword) {
    return { error: '請填寫完整欄位', success: false }
  }
  if (newPassword.length < 8) {
    return { error: '新密碼至少需要 8 個字元', success: false }
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, session.sub)).limit(1)
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: '目前密碼不正確', success: false }
  }

  await db.update(adminUsers)
    .set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() })
    .where(eq(adminUsers.id, user.id))

  return { error: null, success: true }
}
