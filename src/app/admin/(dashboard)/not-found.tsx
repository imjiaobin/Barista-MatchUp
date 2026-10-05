import { FiArchive } from 'react-icons/fi'
import { ButtonLink } from '../../../components/admin/ui/Button'
import { Card } from '../../../components/admin/ui/Card'
import { EmptyState } from '../../../components/admin/ui/EmptyState'

// 模板：找不到資料。詳情頁查無資料時呼叫 notFound() 會顯示此頁。
export default function AdminNotFound() {
  return (
    <Card>
      <EmptyState
        icon={FiArchive}
        title="這筆資料不存在或已刪除"
        description="請回到列表重新選擇。"
        action={<ButtonLink href="/admin" variant="secondary">回到總覽</ButtonLink>}
      />
    </Card>
  )
}
