import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { hashPassword } from '../lib/auth'
import { db } from './client'
import { adminUsers } from './schema'

async function main() {
  const username = process.env.ADMIN_SEED_USERNAME
  const password = process.env.ADMIN_SEED_PASSWORD
  if (!username || !password) {
    throw new Error('ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD is not set')
  }

  const passwordHash = await hashPassword(password)
  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1)

  if (existing) {
    await db.update(adminUsers).set({ passwordHash, updatedAt: new Date() }).where(eq(adminUsers.id, existing.id))
    console.log(`已更新管理員帳號「${username}」的密碼`)
  } else {
    await db.insert(adminUsers).values({ username, passwordHash })
    console.log(`已建立管理員帳號「${username}」`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
