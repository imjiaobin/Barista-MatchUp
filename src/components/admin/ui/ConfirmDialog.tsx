'use client'

import { useRef } from 'react'
import { Button, type ButtonVariant } from './Button'
import { SubmitButton } from './SubmitButton'

// 破壞性操作的唯一做法。用原生 <dialog>：焦點鎖定、Esc 關閉、關閉後焦點回到觸發鈕皆由瀏覽器處理。
export function ConfirmDialog({ trigger, triggerVariant = 'ghost', title, description, confirmText, pendingText, action }: {
  trigger: React.ReactNode
  triggerVariant?: ButtonVariant
  title: string
  description: string
  confirmText: string
  pendingText: string
  action: () => Promise<void>
}) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <>
      <Button variant={triggerVariant} size="sm" onClick={() => ref.current?.showModal()}>{trigger}</Button>
      <dialog
        ref={ref}
        className="m-auto w-[min(420px,calc(100%-2rem))] rounded-3xl bg-card p-6 text-left text-card-foreground shadow-modal backdrop:bg-black/50"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close() }}
      >
        <form action={async () => { await action(); ref.current?.close() }} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => ref.current?.close()}>取消</Button>
            <SubmitButton variant="destructive" pendingText={pendingText}>{confirmText}</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  )
}
