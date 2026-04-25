import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

const categories = ['全部', '精品單品', '義式濃縮', '拉花藝術', '冷萃特調', '品牌策劃']

const baristas = [
  { name: '林宜蓁', specialty: '精品單品', location: '台北', tags: ['手沖', '濾掛', '產地溯源'], grad: 'from-brown/70 to-indigo', cat: '精品單品' },
  { name: '陳書逸', specialty: '義式濃縮', location: '台中', tags: ['義式', '奶泡技術', '競賽選手'], grad: 'from-indigo/80 to-stone-700', cat: '義式濃縮' },
  { name: '王怡萱', specialty: '拉花藝術', location: '台北', tags: ['拉花', '藝術造型', '教學經驗'], grad: 'from-olive/70 to-indigo', cat: '拉花藝術' },
  { name: '吳承恩', specialty: '冷萃特調', location: '高雄', tags: ['冷萃', '氮氣咖啡', '調飲創作'], grad: 'from-stone-600 to-olive/80', cat: '冷萃特調' },
  { name: '蔡明哲', specialty: '品牌策劃', location: '台北', tags: ['品牌聯名', '菜單設計', '活動執行'], grad: 'from-brown/50 to-olive', cat: '品牌策劃' },
  { name: '許雅婷', specialty: '精品單品', location: '新竹', tags: ['虹吸壺', '杯測', '農場直採'], grad: 'from-indigo/60 to-brown', cat: '精品單品' },
  { name: '劉建宏', specialty: '義式濃縮', location: '台南', tags: ['義式', '豆單規劃', '培訓師'], grad: 'from-olive/50 to-indigo', cat: '義式濃縮' },
  { name: '張美玲', specialty: '拉花藝術', location: '台北', tags: ['圖案拉花', '比賽金獎', '示範教學'], grad: 'from-brown/80 to-stone-600', cat: '拉花藝術' },
]

export default function Baristas() {
  const [active, setActive] = useState('全部')

  const filtered = active === '全部' ? baristas : baristas.filter((b) => b.cat === active)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            咖啡師介紹
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            每一位，都是<br />
            <span className="text-brown italic">故事的述說者</span>
          </motion.h1>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 px-5 py-2 text-xs tracking-widest uppercase transition-all duration-200 ${
                active === cat
                  ? 'bg-indigo text-white'
                  : 'border border-stone-200 text-stone-500 hover:border-brown hover:text-brown'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {filtered.map(({ name, specialty, location, tags, grad }, i) => (
                <motion.div
                  key={name}
                  custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className={`group relative aspect-[3/4] bg-gradient-to-b ${grad} overflow-hidden cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />

                  {/* Tags on hover */}
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
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-stone-400 text-sm mt-16"
          >
            目前顯示 {filtered.length} 位咖啡師 · 持續擴充中
          </motion.p>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-6 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="section-label mb-4">咖啡師申請</p>
          <h2 className="section-title mb-4">你也是優秀的咖啡師？</h2>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            加入 Pourfolio 平台，接觸更多高品質的商業合作機會，讓你的技術被更多人看見。
          </p>
          <a href="mailto:join@pourfolio.tw" className="btn-outline">申請加入平台</a>
        </motion.div>
      </section>
    </>
  )
}
