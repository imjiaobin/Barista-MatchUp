'use client'

import { motion } from 'framer-motion'
import baristasHeroImg from '../../assets/hero-3.jpg'
import FilterableGrid from '../shared/FilterableGrid'
import HeroImage from '../shared/HeroImage'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

const categories = ['全部', '精品單品', '義式濃縮', '拉花藝術', '冷萃特調', '品牌策劃']

interface Barista {
  name: string
  specialty: string
  location: string
  tags: string[]
  grad: string
  cat: string
}

const baristas: Barista[] = [
  { name: '林宜蓁', specialty: '精品單品', location: '台北', tags: ['手沖', '濾掛', '產地溯源'], grad: 'from-caramel/70 to-espresso', cat: '精品單品' },
  { name: '陳書逸', specialty: '義式濃縮', location: '台中', tags: ['義式', '奶泡技術', '競賽選手'], grad: 'from-espresso/80 to-stone-700', cat: '義式濃縮' },
  { name: '王怡萱', specialty: '拉花藝術', location: '台北', tags: ['拉花', '藝術造型', '教學經驗'], grad: 'from-olive/70 to-espresso', cat: '拉花藝術' },
  { name: '吳承恩', specialty: '冷萃特調', location: '高雄', tags: ['冷萃', '氮氣咖啡', '調飲創作'], grad: 'from-stone-600 to-olive/80', cat: '冷萃特調' },
  { name: '蔡明哲', specialty: '品牌策劃', location: '台北', tags: ['品牌聯名', '菜單設計', '活動執行'], grad: 'from-caramel/50 to-olive', cat: '品牌策劃' },
  { name: '許雅婷', specialty: '精品單品', location: '新竹', tags: ['虹吸壺', '杯測', '農場直採'], grad: 'from-espresso/60 to-caramel', cat: '精品單品' },
  { name: '劉建宏', specialty: '義式濃縮', location: '台南', tags: ['義式', '豆單規劃', '培訓師'], grad: 'from-olive/50 to-espresso', cat: '義式濃縮' },
  { name: '張美玲', specialty: '拉花藝術', location: '台北', tags: ['圖案拉花', '比賽金獎', '示範教學'], grad: 'from-caramel/80 to-stone-600', cat: '拉花藝術' },
]

function BaristaCard({ barista }: { barista: Barista }) {
  const { name, specialty, location, tags, grad } = barista
  return (
    <div className={`group relative aspect-[3/4] bg-gradient-to-b ${grad} overflow-hidden cursor-pointer`}>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />

      {/* hover 時顯示的標籤 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 left-4 flex flex-wrap gap-1"
      >
        {tags.map((t) => (
          <span key={t} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 tracking-wide">
            {t}
          </span>
        ))}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white font-medium">{name}</p>
        <p className="text-white/60 text-xs tracking-wide mt-0.5">{specialty} · {location}</p>
      </div>
    </div>
  )
}

interface BaristasContentProps {
  heroLabel: string
  heroHeadingLine1: string
  heroHeadingAccent: string
  ctaLabel: string
  ctaHeading: string
  ctaBody: string
  ctaButton: string
}

export default function BaristasContent({
  heroLabel, heroHeadingLine1, heroHeadingAccent, ctaLabel, ctaHeading, ctaBody, ctaButton,
}: BaristasContentProps) {
  return (
    <>
      {/* 頁首主視覺 */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] items-stretch md:min-h-[480px]">
          <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
            <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
              {heroLabel}
            </motion.p>
            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
            >
              {heroHeadingLine1}<br />
              <span className="text-caramel italic">{heroHeadingAccent}</span>
            </motion.h1>
          </div>
          <HeroImage src={baristasHeroImg} alt="咖啡師微笑沖煮咖啡" priority />
        </div>
      </section>

      <FilterableGrid
        categories={categories}
        items={baristas}
        itemCategory={(b) => b.cat}
        itemKey={(b) => b.name}
        gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4"
        renderCard={(barista) => <BaristaCard barista={barista} />}
        countLabel={(count) => `目前顯示 ${count} 位咖啡師 · 持續擴充中`}
      />

      {/* 加入平台呼籲區塊 */}
      <section className="py-20 px-6 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="section-label mb-4">{ctaLabel}</p>
          <h2 className="section-title mb-4">{ctaHeading}</h2>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            {ctaBody}
          </p>
          <a href="mailto:join@pourfolio.tw" className="btn-outline">{ctaButton}</a>
        </motion.div>
      </section>
    </>
  )
}
