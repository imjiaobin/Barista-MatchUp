import type { ComponentProps } from 'react'
import { cn } from './cn'

const control =
  'w-full border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:opacity-50 aria-invalid:border-destructive'

export function Field({ label, htmlFor, required, hint, error, children, className }: {
  label: string; htmlFor: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'h-9 rounded-full', className)} {...props} />
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(control, 'h-9 rounded-full pr-8', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-24 rounded-2xl py-2.5 resize-y', className)} {...props} />
}

// 原生 checkbox 做成開關；name/defaultChecked 照常送出 'on'
export function Switch({ label, className, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3 text-sm', className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:outline-solid peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-card after:shadow-card after:transition-transform peer-checked:after:translate-x-4" />
      {label}
    </label>
  )
}

export function FormAlert({ tone = 'error', children }: { tone?: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn(
      'rounded-2xl border px-4 py-3 text-sm',
      tone === 'error' ? 'border-destructive/40 text-destructive' : 'border-success/40 text-success',
    )}>
      {children}
    </div>
  )
}
