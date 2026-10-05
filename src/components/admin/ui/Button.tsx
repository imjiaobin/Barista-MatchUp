import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'md' | 'sm' | 'icon'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'border border-input bg-card text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'text-primary underline-offset-4 hover:underline px-0',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-9 px-4',
  sm: 'h-8 px-3 text-[13px]',
  icon: 'size-9',
}

export function buttonClass({ variant = 'primary', size = 'md', className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], variant !== 'link' && sizes[size], className)
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />
}
