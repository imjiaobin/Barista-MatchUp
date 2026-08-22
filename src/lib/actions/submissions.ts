'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '../../db/client'
import { contactSubmissions } from '../../db/schema'
import { CONTACT_SUBMISSION_STATUSES, type ContactSubmissionStatus } from '../constants'
import { requireAdminSession } from '../session'

export async function updateSubmissionStatus(id: string, formData: FormData): Promise<void> {
  await requireAdminSession()

  const status = formData.get('status')
  if (typeof status !== 'string' || !CONTACT_SUBMISSION_STATUSES.includes(status as ContactSubmissionStatus)) {
    return
  }

  await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id))
  revalidatePath('/admin/submissions')
}
