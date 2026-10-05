import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

export type Crumb = { label: string; href?: string }

// 每頁必有。麵包屑由頁面傳入（詳情頁可放資料名稱），最後一層不可點。
export function PageHeader({ title, description, badge, actions, breadcrumbs }: {
  title: string; description?: React.ReactNode; badge?: React.ReactNode; actions?: React.ReactNode; breadcrumbs?: Crumb[]
}) {
  return (
    <header className="flex flex-col gap-3">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="麵包屑" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <FiChevronRight size={14} aria-hidden />}
              {c.href ? <Link href={c.href} className="hover:text-foreground">{c.label}</Link> : <span aria-current="page" className="text-foreground">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[26px] font-light leading-snug tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
