import { Card } from '../../../components/admin/ui/Card'
import { Skeleton } from '../../../components/admin/ui/EmptyState'

// 模板：載入狀態。骨架形狀要接近實際版面（標題 → 篩選列 → 表格）。
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="載入中">
      <div className="flex flex-col gap-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-3 w-72" /></div>
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex gap-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-9 w-32" /></div>
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </Card>
    </div>
  )
}
