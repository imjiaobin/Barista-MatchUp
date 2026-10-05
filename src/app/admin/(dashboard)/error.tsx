'use client'

import { FiAlertCircle } from 'react-icons/fi'
import { Button } from '../../../components/admin/ui/Button'
import { Card } from '../../../components/admin/ui/Card'
import { EmptyState } from '../../../components/admin/ui/EmptyState'

// 模板：錯誤狀態。不顯示 stack；digest 方便回報。
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card>
      <EmptyState
        icon={FiAlertCircle}
        title="資料載入失敗"
        description={`請重新載入，問題持續請聯絡管理員。${error.digest ? `（代碼 ${error.digest}）` : ''}`}
        action={<Button variant="secondary" onClick={reset}>重新載入</Button>}
      />
    </Card>
  )
}
