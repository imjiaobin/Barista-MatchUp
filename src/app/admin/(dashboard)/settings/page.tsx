import ChangePasswordForm from '../../../../components/admin/ChangePasswordForm'
import { requireAdminSession } from '../../../../lib/session'

export default async function AdminSettingsPage() {
  await requireAdminSession()

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">帳號設定</h1>
      <ChangePasswordForm />
    </div>
  )
}
