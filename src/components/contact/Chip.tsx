export default function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm border transition-colors duration-200 ${
        active ? 'bg-indigo text-white border-indigo' : 'border-stone-200 text-stone-600 hover:border-brown hover:text-brown'
      }`}
    >
      {label}
    </button>
  )
}
