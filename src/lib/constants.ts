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

// ── 聯絡表單選項 ──────────────────────────────────────────────
export const INQUIRY_EVENT_TYPES = ['企業內訓', '市集擺攤', '婚禮', '私人派對', '品牌快閃', '其他'] as const
export type InquiryEventType = (typeof INQUIRY_EVENT_TYPES)[number]

export const VENUE_TYPES = ['室內', '室外', '半戶外'] as const
export type VenueType = (typeof VENUE_TYPES)[number]

export const DRINK_TYPES = ['義式咖啡', '手沖', '冷萃', '茶飲', '無咖啡因選項'] as const
export type DrinkType = (typeof DRINK_TYPES)[number]

export const POWER_SUPPLY_OPTIONS = ['有標準插座', '需發電機', '不確定（需現場確認）'] as const
export type PowerSupplyOption = (typeof POWER_SUPPLY_OPTIONS)[number]

export const WATER_SOURCE_OPTIONS = ['現場有飲用水', '需自備', '不確定（需現場確認）'] as const
export type WaterSourceOption = (typeof WATER_SOURCE_OPTIONS)[number]

export const BUDGET_RANGES = ['NT$5,000 以下', 'NT$5,000 – 15,000', 'NT$15,000 – 30,000', 'NT$30,000 以上'] as const
export type BudgetRange = (typeof BUDGET_RANGES)[number]

export const PREFERRED_CONTACT_METHODS = ['電話', 'Email'] as const
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number]

export const TAIWAN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣',
] as const
export type TaiwanCity = (typeof TAIWAN_CITIES)[number]
