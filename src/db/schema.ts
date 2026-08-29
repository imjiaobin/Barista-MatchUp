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
