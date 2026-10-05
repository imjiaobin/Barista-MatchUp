import type { IconType } from 'react-icons'

export function EmptyState({ icon: Icon, title, description, action }: { icon?: IconType; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 px-6 py-12">
      {Icon && (
        <span className="mb-1 grid size-10 place-items-center rounded-full bg-accent text-accent-foreground">
          <Icon size={18} aria-hidden />
        </span>
      )}
      <p className="text-sm font-semibold leading-relaxed">{title}</p>
      {description && <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = 'h-3 w-full' }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-muted ${className}`} />
}
