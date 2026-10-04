import BaristasContent from '../../components/baristas/BaristasContent'
import { getPageContentMap } from '../../lib/actions/content'

export default async function Baristas() {
  const content = await getPageContentMap('baristas')

  return (
    <BaristasContent
      heroLabel={content.hero_label ?? '咖啡師介紹'}
      heroHeadingLine1={content.hero_heading_line1 ?? '每一位，都是'}
      heroHeadingAccent={content.hero_heading_accent ?? '故事的述說者'}
      ctaLabel={content.cta_label ?? '咖啡師申請'}
      ctaHeading={content.cta_heading ?? '你也是優秀的咖啡師？'}
      ctaBody={content.cta_body ?? '加入 Pourfolio 平台，接觸更多高品質的商業合作機會，讓你的技術被更多人看見。'}
      ctaButton={content.cta_button ?? '申請加入平台'}
    />
  )
}
