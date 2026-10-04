import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '../../../db/client'
import { satisfactionSurveys } from '../../../db/schema'
import SurveyForm from './SurveyForm'

export default async function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const [survey] = await db.select().from(satisfactionSurveys).where(eq(satisfactionSurveys.id, token)).limit(1)
  if (!survey) notFound()

  return (
    <section className="min-h-screen flex items-center justify-center bg-stone-50 px-6 py-20">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-light text-stone-800 mb-2">活動滿意度調查</h1>
        <p className="text-sm text-stone-500 mb-8">感謝您與 Pourfolio 合作，想聽聽您的回饋。</p>
        {survey.submittedAt ? (
          <p className="text-stone-600 leading-relaxed">感謝您的填寫！您的回饋對我們非常重要。</p>
        ) : (
          <SurveyForm token={token} />
        )}
      </div>
    </section>
  )
}
