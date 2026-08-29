'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h2 className="text-3xl font-light text-stone-800 mb-4">發生了一些問題</h2>
      <p className="text-sm text-stone-500 mb-8">{error.message || '請稍後再試一次'}</p>
      <button onClick={reset} className="btn-outline">重新載入</button>
    </section>
  )
}
