import Link from 'next/link'
import type { ContactSubmission } from '../../db/schema'
import StatusControl from './StatusControl'
import { Table, Td, Th, Tr } from './ui/Table'

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
}

// 列表只保留可掃讀的欄位與列內狀態切換；完整資料一律進詳情頁
export default function SubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  return (
    <Table minWidth={860}>
      <thead>
        <tr>
          <Th>聯絡人</Th>
          <Th>活動</Th>
          <Th>活動時間</Th>
          <Th align="right">出杯數</Th>
          <Th>送出時間</Th>
          <Th>狀態</Th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => (
          <Tr key={s.id}>
            <Td>
              <Link href={`/admin/submissions/${s.id}`} className="font-medium hover:text-primary">{s.contactName}</Link>
            </Td>
            <Td muted>{s.eventType} · {s.eventCity}</Td>
            <Td numeric muted className="whitespace-nowrap">{formatDateTime(s.eventStartAt)}</Td>
            <Td align="right" numeric>{s.cupCount}</Td>
            <Td numeric muted className="whitespace-nowrap">{formatDateTime(s.createdAt)}</Td>
            <Td>
              <StatusControl submission={s} compact />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
