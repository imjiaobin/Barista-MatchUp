'use client'

import { useFormStatus } from 'react-dom'
import { FiLoader } from 'react-icons/fi'
import { Button, type ButtonVariant } from './Button'

// 送出中自動 disabled + 轉圈 + 改文案，任何 <form action> 內都可直接用
export function SubmitButton({ children, pendingText, variant = 'primary', className }: { children: React.ReactNode; pendingText: string; variant?: ButtonVariant; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending && <FiLoader size={16} className="animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  )
}
