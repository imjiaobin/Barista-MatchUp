import type { Tone } from '../../../lib/status'
import { cn } from './cn'

const tones: Record<Tone, string> = {
  pending: 'bg-accent text-accent-foreground',
  progress: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-muted text-muted-foreground',
  danger: 'bg-destructive/10 text-destructive',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
