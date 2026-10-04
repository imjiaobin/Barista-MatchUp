import ContactFormSection from '../../components/contact/ContactFormSection'
import ContactHero from '../../components/contact/ContactHero'
import { getPageContentMap } from '../../lib/actions/content'

export default async function Contact() {
  const content = await getPageContentMap('contact')

  return (
    <>
      <ContactHero
        label={content.hero_label ?? '聯絡我們'}
        headingLine1={content.hero_heading_line1 ?? '告訴我們你的'}
        headingAccent={content.hero_heading_accent ?? '活動故事'}
      />
      <ContactFormSection />
    </>
  )
}
