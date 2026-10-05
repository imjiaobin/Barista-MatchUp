import { cookies } from 'next/headers'
import AdminFrame from '../../../components/admin/shell/AdminFrame'

// tokens 已由 global.css 匯入。側欄收合與主題存在 cookie，伺服器端先讀，避免首屏閃爍。
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  return (
    <AdminFrame
      defaultCollapsed={store.get('admin-sidebar')?.value === 'collapsed'}
      defaultTheme={store.get('admin-theme')?.value === 'dark' ? 'dark' : 'light'}
    >
      {children}
    </AdminFrame>
  )
}
