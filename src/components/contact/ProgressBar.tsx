export default function ProgressBar({ step, stepLabels }: { step: number; stepLabels: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {stepLabels.map((label, i) => (
          <div key={label} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-caramel' : 'bg-stone-300'}`} />
        ))}
      </div>
      <p className="text-xs md:text-sm font-medium tracking-wide text-stone-600 mb-8">
        步驟 {step + 1} / {stepLabels.length} · {stepLabels[step]}
      </p>
    </div>
  )
}
