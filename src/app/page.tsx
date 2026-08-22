import HomeContent, { type FounderContent, type HeroSlideContent } from '../components/home/HomeContent'
import { getPageContentMap } from '../lib/actions/content'

const FALLBACK_SLIDES: HeroSlideContent[] = [
  { tag: '咖啡師媒合', line1: 'Pour your', line2: 'story.', body: 'Pourfolio 連結專業咖啡師與品牌活動，讓每一次倒杯都成為難忘的品牌體驗。' },
  { tag: '活動策劃', line1: 'Craft the', line2: 'moment.', body: '從小型品牌聚會到大型年會，為每個規模的活動配對最合適的咖啡師。' },
  { tag: '品牌聯名', line1: 'Elevate your', line2: 'brand.', body: '讓咖啡師成為你活動最有記憶點的存在，一杯咖啡，一個品牌故事。' },
]

const FALLBACK_FOUNDERS: FounderContent[] = [
  {
    name: 'Hardy',
    role: '共同創辦人',
    tag: '2016 台灣手沖冠軍 · 木咖 Horoka Coffee 創辦人',
    bio: '2016 年台灣手沖咖啡冠軍，深耕手沖沖煮多年，現為「木咖」咖啡廳創辦人。將競賽級的沖煮功底與經營品牌的實戰經驗，帶入 Pourfolio 的咖啡師審核與媒合標準。',
  },
  {
    name: '資訊補充中',
    role: '共同創辦人 · 烘豆師',
    tag: '烘豆師',
    bio: '個人經歷資訊補充中。',
  },
]

export default async function HomePage() {
  const content = await getPageContentMap('home')

  const slides: HeroSlideContent[] = FALLBACK_SLIDES.map((fallback, i) => ({
    tag: content[`hero_${i + 1}_tag`] ?? fallback.tag,
    line1: content[`hero_${i + 1}_line1`] ?? fallback.line1,
    line2: content[`hero_${i + 1}_line2`] ?? fallback.line2,
    body: content[`hero_${i + 1}_body`] ?? fallback.body,
  }))

  const founders: FounderContent[] = FALLBACK_FOUNDERS.map((fallback, i) => ({
    name: content[`founder_${i + 1}_name`] ?? fallback.name,
    role: content[`founder_${i + 1}_role`] ?? fallback.role,
    tag: content[`founder_${i + 1}_tag`] ?? fallback.tag,
    bio: content[`founder_${i + 1}_bio`] ?? fallback.bio,
  }))

  return <HomeContent slides={slides} founders={founders} />
}
