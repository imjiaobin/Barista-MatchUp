import { boolean, date, pgTable, serial, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'

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
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  eventDate: date('event_date'),
  eventType: varchar('event_type', { length: 100 }),
  budget: varchar('budget', { length: 100 }),
  message: text('message'),
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
