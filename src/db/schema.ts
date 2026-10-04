import { boolean, date, integer, pgTable, serial, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  eventDate: date('event_date').notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  summary: text('summary').notNull(),
  gradientPreset: varchar('gradient_preset', { length: 30 }).notNull(),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  // 一、聯絡人資訊
  contactName: varchar('contact_name', { length: 200 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 50 }).notNull(),
  contactEmail: varchar('contact_email', { length: 320 }).notNull(),
  // 二、活動基本資訊
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventCity: varchar('event_city', { length: 20 }).notNull(),
  eventAddress: varchar('event_address', { length: 300 }).notNull(),
  venueType: varchar('venue_type', { length: 20 }).notNull(),
  eventStartAt: timestamp('event_start_at').notNull(),
  eventEndAt: timestamp('event_end_at').notNull(),
  // 三、服務需求
  cupCount: integer('cup_count').notNull(),
  drinkTypes: text('drink_types').array().notNull(),
  dessertNeeded: boolean('dessert_needed').notNull().default(false),
  dessertNotes: text('dessert_notes'),
  // 四、設備與場地條件（選填，現場常常還不確定）
  powerSupply: varchar('power_supply', { length: 50 }),
  waterSource: varchar('water_source', { length: 50 }),
  // 五、預算與備註
  budgetRange: varchar('budget_range', { length: 50 }),
  notes: text('notes'),
  preferredContactMethod: varchar('preferred_contact_method', { length: 20 }),
  // 後台追蹤
  status: varchar('status', { length: 20 }).notNull().default('new'),
  // 狀態為 lost 時才會有值：流失原因（固定選項）＋ 選填的自由文字備註
  lossReason: varchar('loss_reason', { length: 30 }),
  lossReasonNotes: text('loss_reason_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// 活動確認後、執行階段的操作紀錄，跟 contactSubmissions 是 1:1
// （不是每一筆詢問都會走到這一步，所以獨立成表而不是塞進
// contactSubmissions 裡一堆 nullable 欄位）。
export const eventExecutionLogs = pgTable('event_execution_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().unique()
    .references(() => contactSubmissions.id, { onDelete: 'cascade' }),
  arrivalAt: timestamp('arrival_at'),
  setupAt: timestamp('setup_at'),
  actualDurationMinutes: integer('actual_duration_minutes'),
  onsiteContactName: varchar('onsite_contact_name', { length: 200 }),
  onsiteContactPhone: varchar('onsite_contact_phone', { length: 50 }),
  emergencyContactName: varchar('emergency_contact_name', { length: 200 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
  onsiteNotes: text('onsite_notes'),
  closedSmoothly: boolean('closed_smoothly'),
  followUpNotes: text('follow_up_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// 客戶滿意度問卷，跟 contactSubmissions 是 1:1。id 本身就是公開問卷
// 連結的 token（/survey/[token]），不另外簽發 token——uuid v4 本身
// 已經有足夠的隨機性，專案裡也沒有除了 admin session 以外的簽章機制。
export const satisfactionSurveys = pgTable('satisfaction_surveys', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().unique()
    .references(() => contactSubmissions.id, { onDelete: 'cascade' }),
  source: varchar('source', { length: 20 }).notNull(), // 'web_form' | 'manual_entry'
  rating: integer('rating'),
  feedback: text('feedback'),
  lowScoreFlagged: boolean('low_score_flagged').notNull().default(false),
  sentAt: timestamp('sent_at'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const pageContent = pgTable('page_content', {
  id: serial('id').primaryKey(),
  page: varchar('page', { length: 50 }).notNull(),
  sectionKey: varchar('section_key', { length: 100 }).notNull(),
  label: varchar('label', { length: 200 }).notNull(),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  unique('page_content_page_section_key_unique').on(table.page, table.sectionKey),
])

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type AdminUser = typeof adminUsers.$inferSelect
export type PageContentRow = typeof pageContent.$inferSelect
export type EventExecutionLog = typeof eventExecutionLogs.$inferSelect
export type NewEventExecutionLog = typeof eventExecutionLogs.$inferInsert
export type SatisfactionSurvey = typeof satisfactionSurveys.$inferSelect
export type NewSatisfactionSurvey = typeof satisfactionSurveys.$inferInsert
