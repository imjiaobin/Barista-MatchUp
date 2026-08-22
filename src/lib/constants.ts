// Tailwind's JIT scanner only picks up class names that appear as literal
// strings somewhere in `content`-scanned source. Gradient classes chosen in
// the admin UI are stored as a preset id in the DB, then looked up here —
// never interpolated from free text — so the actual class strings stay
// static and visible to the build-time scanner.
export const EVENT_GRADIENT_PRESETS = [
  { id: 'brown-indigo', label: '暖棕 → 靛藍', className: 'from-brown/70 to-indigo' },
  { id: 'indigo-stone', label: '靛藍 → 石灰', className: 'from-indigo/80 to-stone-700' },
  { id: 'olive-indigo', label: '橄欖 → 靛藍', className: 'from-olive/70 to-indigo' },
  { id: 'stone-olive', label: '石灰 → 橄欖', className: 'from-stone-600 to-olive/80' },
  { id: 'brown-olive', label: '暖棕 → 橄欖', className: 'from-brown/50 to-olive' },
  { id: 'indigo-brown', label: '靛藍 → 暖棕', className: 'from-indigo/60 to-brown' },
] as const

export type EventGradientPresetId = (typeof EVENT_GRADIENT_PRESETS)[number]['id']

export function gradientClassName(presetId: string): string {
  return EVENT_GRADIENT_PRESETS.find((p) => p.id === presetId)?.className ?? EVENT_GRADIENT_PRESETS[0].className
}

export const EVENT_CATEGORIES = ['企業活動', '品牌快閃', '產品發表', '婚禮 / 私人派對'] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const CONTACT_SUBMISSION_STATUSES = ['new', 'contacted', 'archived'] as const

export type ContactSubmissionStatus = (typeof CONTACT_SUBMISSION_STATUSES)[number]

export const ADMIN_SESSION_COOKIE = 'pourfolio_admin_session'
