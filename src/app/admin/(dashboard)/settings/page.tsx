import ChangePasswordForm from '../../../../components/admin/ChangePasswordForm'
import { Card, CardBody, CardHeader } from '../../../../components/admin/ui/Card'
import { PageHeader } from '../../../../components/admin/ui/PageHeader'
import { requireAdminSession } from '../../../../lib/session'

// 模板 5.5：設定頁
// 結構：每個設定區塊一張卡片、各自儲存；危險操作放最下方「危險區域」（border-destructive/40）。
// 區塊超過 4 個時，左側加次級導覽（lg:grid-cols-[200px_minmax(0,1fr)]）。
export default async function AdminSettingsPage() {
  await requireAdminSession()
  return (
    <>
      <PageHeader title="設定" description="帳號與後台偏好" />
      <div className="flex max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader title="變更密碼" description="新密碼至少 8 個字元" />
          <CardBody><ChangePasswordForm /></CardBody>
        </Card>
      </div>
    </>
  )
}
