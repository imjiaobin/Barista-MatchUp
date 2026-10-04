import { asc, eq } from 'drizzle-orm'
import ContentEditor from '../../../../components/admin/ContentEditor'
import { db } from '../../../../db/client'
import { pageContent } from '../../../../db/schema'
import { updatePageContent } from '../../../../lib/actions/content'
import { requireAdminSession } from '../../../../lib/session'

export default async function AdminContentPage() {
  await requireAdminSession()

  const pages = ['home', 'about', 'services', 'events', 'contact', 'baristas'] as const
  const rowsByPage = Object.fromEntries(
    await Promise.all(
      pages.map(async (page) => [
        page,
        await db.select().from(pageContent).where(eq(pageContent.page, page)).orderBy(asc(pageContent.id)),
      ]),
    ),
  )

  return (
    <div>
      <h1 className="text-2xl font-light text-stone-800 mb-8">頁面文案</h1>
      <ContentEditor title="首頁" rows={rowsByPage.home} action={updatePageContent.bind(null, 'home', ['/'])} />
      <ContentEditor title="品牌故事頁" rows={rowsByPage.about} action={updatePageContent.bind(null, 'about', ['/about'])} />
      <ContentEditor title="服務項目頁" rows={rowsByPage.services} action={updatePageContent.bind(null, 'services', ['/services'])} />
      <ContentEditor title="活動經歷頁" rows={rowsByPage.events} action={updatePageContent.bind(null, 'events', ['/events'])} />
      <ContentEditor title="聯絡我們頁" rows={rowsByPage.contact} action={updatePageContent.bind(null, 'contact', ['/contact'])} />
      <ContentEditor title="咖啡師介紹頁" rows={rowsByPage.baristas} action={updatePageContent.bind(null, 'baristas', ['/baristas'])} />
    </div>
  )
}
