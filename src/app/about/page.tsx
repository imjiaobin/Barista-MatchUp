import AboutContent from '../../components/about/AboutContent'
import { getPageContentMap } from '../../lib/actions/content'

const FALLBACK_PARAGRAPHS = [
  'Pourfolio 源自一個簡單的觀察：優秀的咖啡師很多，值得被好好呈現的品牌活動也很多，但兩者之間始終缺少一座橋樑。',
  '我們是一群熱愛咖啡文化的人，深信一杯精心準備的咖啡能為活動帶來截然不同的溫度。Pourfolio 正是在這樣的信念下起步。',
  '我們不想只當仲介，而是成為真正懂咖啡、懂活動的媒合夥伴。每一次配對，都是對品質的承諾。',
]

export default async function About() {
  const content = await getPageContentMap('about')

  const storyParagraphs = [
    content.story_para_1 ?? FALLBACK_PARAGRAPHS[0],
    content.story_para_2 ?? FALLBACK_PARAGRAPHS[1],
    content.story_para_3 ?? FALLBACK_PARAGRAPHS[2],
  ]

  return <AboutContent storyParagraphs={storyParagraphs} />
}
