import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from './cn'

// 外層容器由 <Card> 提供；表格本身可橫向捲動
export function Table({ children, minWidth = 640 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>{children}</table>
    </div>
  )
}

export function Th({ children, align = 'left', className }: { children?: React.ReactNode; align?: 'left' | 'right'; className?: string }) {
  return (
    <th className={cn('whitespace-nowrap border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground', align === 'right' ? 'text-right' : 'text-left', className)}>
      {children}
    </th>
  )
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="h-12 transition-colors hover:bg-muted/60">{children}</tr>
}

export function Td({ children, align = 'left', numeric, muted, className }: { children?: React.ReactNode; align?: 'left' | 'right'; numeric?: boolean; muted?: boolean; className?: string }) {
  return (
    <td className={cn('border-b border-border/70 px-4', align === 'right' && 'text-right', numeric && 'tabular-nums', muted && 'text-muted-foreground', className)}>
      {children}
    </td>
  )
}

// 分頁以 URL 為準：保留其他 searchParams，只換 page
export function Pagination({ page, pageSize, total, basePath, searchParams }: {
  page: number; pageSize: number; total: number; basePath: string; searchParams: Record<string, string | undefined>
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const href = (p: number) => {
    const sp = new URLSearchParams(Object.entries(searchParams).filter((e): e is [string, string] => !!e[1]))
    if (p > 1) sp.set('page', String(p)); else sp.delete('page')
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  const item = 'grid h-8 min-w-8 place-items-center rounded-full px-2 text-[13px] tabular-nums'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px] text-muted-foreground">
      <span className="whitespace-nowrap">第 {from}–{to} 筆，共 {total} 筆</span>
      <nav aria-label="分頁" className="flex items-center gap-1">
        {page > 1 ? <Link href={href(page - 1)} aria-label="上一頁" className={cn(item, 'hover:bg-muted')}><FiChevronLeft size={16} /></Link> : <span className={cn(item, 'opacity-40')}><FiChevronLeft size={16} /></span>}
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
          .map((p, i, arr) => (
            <span key={p} className="flex items-center gap-1">
              {i > 0 && p - arr[i - 1] > 1 && <span className={item}>…</span>}
              <Link href={href(p)} aria-current={p === page ? 'page' : undefined} className={cn(item, p === page ? 'bg-accent font-semibold text-accent-foreground' : 'hover:bg-muted')}>{p}</Link>
            </span>
          ))}
        {page < pages ? <Link href={href(page + 1)} aria-label="下一頁" className={cn(item, 'hover:bg-muted')}><FiChevronRight size={16} /></Link> : <span className={cn(item, 'opacity-40')}><FiChevronRight size={16} /></span>}
      </nav>
    </div>
  )
}
