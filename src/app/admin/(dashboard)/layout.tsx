import AdminNav from '../../../components/admin/AdminNav'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <AdminNav />
      <main className="flex-1 p-6 md:p-10 max-w-5xl">{children}</main>
    </div>
  )
}
