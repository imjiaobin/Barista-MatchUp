import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from './auth'

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

// 縱深防禦：後台的 Server Components/Actions 會自己重新檢查一次 session，
// 而不是只依賴 middleware。
export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}
