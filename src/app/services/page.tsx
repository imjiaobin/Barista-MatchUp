import ProcessSection from '../../components/services/ProcessSection'
import ServiceCards from '../../components/services/ServiceCards'
import ServicesHero from '../../components/services/ServicesHero'
import { getPageContentMap } from '../../lib/actions/content'

export default async function Services() {
  const content = await getPageContentMap('services')

  return (
    <>
      <ServicesHero
        label={content.hero_label ?? '服務項目'}
        headingLine1={content.hero_heading_line1 ?? '從媒合到落地，'}
        headingAccent={content.hero_heading_accent ?? '一站到位'}
      />
      <ServiceCards />
      <ProcessSection
        label={content.process_label ?? '合作流程'}
        headingLine1={content.process_heading_line1 ?? '四個步驟，完成你的'}
        headingLine2={content.process_heading_line2 ?? '完美咖啡活動'}
        ctaText={content.process_cta ?? '填寫需求表單'}
      />
    </>
  )
}
