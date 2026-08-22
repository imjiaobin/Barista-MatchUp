import { asc, eq } from 'drizzle-orm'
import ContentEditor from '../../../../components/admin/ContentEditor'
import { db } from '../../../../db/client'
import { pageContent } from '../../../../db/schema'
import { updatePageContent } from '../../../../lib/actions/content'
import { requireAdminSession } from '../../../../lib/session'

export default async function AdminContentPage() {
  await requireAdminSession()

  const [homeRows, aboutRows] = await Promise.all([
    db.select().from(pageContent).where(eq(pageContent.page, 'home')).orderBy(asc(pageContent.id)),
    db.select().from(pageContent).where(eq(pageContent.page, 'about')).orderBy(asc(pageContent.id)),
  ])

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">頁面文案</h1>
      <ContentEditor title="首頁" rows={homeRows} action={updatePageContent.bind(null, 'home', ['/'])} />
      <ContentEditor title="品牌故事頁" rows={aboutRows} action={updatePageContent.bind(null, 'about', ['/about'])} />
    </div>
  )
}
