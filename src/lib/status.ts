import { CONTACT_SUBMISSION_STATUS_LABELS, type ContactSubmissionStatus } from './constants'

// 狀態 → 色調的唯一對照表。文案沿用 constants.ts，頁面不得自行決定狀態顏色。
export type Tone = 'pending' | 'progress' | 'success' | 'warning' | 'neutral' | 'danger'

const SUBMISSION_TONES: Record<ContactSubmissionStatus, Tone> = {
  new: 'pending',
  contacted: 'progress',
  confirmed: 'success',
  completed: 'success',
  lost: 'neutral',
}

export function submissionStatus(status: string) {
  const s = status as ContactSubmissionStatus
  return { label: CONTACT_SUBMISSION_STATUS_LABELS[s] ?? status, tone: SUBMISSION_TONES[s] ?? 'neutral' }
}

export const PUBLISH_STATUS = {
  published: { label: '已發布', tone: 'success' },
  draft: { label: '草稿', tone: 'neutral' },
} as const satisfies Record<string, { label: string; tone: Tone }>
