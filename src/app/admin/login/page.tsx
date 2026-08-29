import type { Metadata } from 'next'
import LoginForm from '../../../components/admin/LoginForm'

export const metadata: Metadata = {
  title: '後台登入 — Pourfolio',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="flex flex-col items-center gap-8">
        <p className="text-xl font-medium tracking-[0.2em] text-indigo">Pourfolio 後台</p>
        <LoginForm />
      </div>
    </div>
  )
}
