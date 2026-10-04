export default function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-2 border-b border-stone-100 last:border-b-0">
      <span className="text-stone-400 shrink-0">{label}</span>
      <span className="text-stone-700 text-right">{value}</span>
    </div>
  )
}
