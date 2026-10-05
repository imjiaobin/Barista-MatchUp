import { cn } from './cn'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl bg-card text-card-foreground shadow-card', className)}>{children}</section>
}

export function CardHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

// 詳情頁的「標籤 / 值」清單；空值統一顯示「—」
export function DescriptionList({ items }: { items: Array<{ label: string; value?: React.ReactNode }> }) {
  return (
    <dl className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-x-6 gap-y-3 text-sm">
      {items.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0 break-words">{value === undefined || value === null || value === '' ? '—' : value}</dd>
        </div>
      ))}
    </dl>
  )
}
