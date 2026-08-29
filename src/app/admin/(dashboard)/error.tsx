'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-xl font-light text-stone-800 mb-3">後台發生錯誤</h2>
      <p className="text-sm text-stone-500 mb-6">{error.message || '請稍後再試一次'}</p>
      <button onClick={reset} className="btn-outline">重新載入</button>
    </div>
  )
}
