import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import LoginForm from '../../../components/admin/LoginForm'

export const metadata: Metadata = { title: '後台登入 — Pourfolio' }

// 模板 5.6：登入頁。不使用 AdminFrame；沿用使用者上次的主題。
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams
  const dark = (await cookies()).get('admin-theme')?.value === 'dark'
  return (
    <div className={`${dark ? 'dark ' : ''}grid min-h-screen place-items-center bg-background px-4 font-admin font-normal text-foreground`}>
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl bg-card p-8 shadow-card">
        <div className="flex flex-col gap-1">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">P</span>
          <h1 className="mt-3 text-2xl font-light tracking-tight">Pourfolio 後台</h1>
          <p className="text-sm text-muted-foreground">請以管理員帳號登入</p>
        </div>
        <LoginForm from={from} />
      </div>
    </div>
  )
}
