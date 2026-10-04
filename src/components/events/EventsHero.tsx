import eventsHeroImg from '../../assets/hero-5.jpg'
import HeroImage from '../shared/HeroImage'
import FadeIn from '../FadeIn'

export default function EventsHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] items-stretch md:min-h-[480px]">
        <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
          <FadeIn>
            <p className="section-label text-caramel md:text-lg mb-4">活動故事</p>
            <h1 className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight max-w-2xl">
              每一場活動，<br />
              <span className="text-caramel italic">都值得被記住</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-stone-500 leading-relaxed max-w-md mt-8">
              這裡蒐錄 Pourfolio 媒合、策劃過的精選歷屆活動，從企業尾牙到品牌快閃，記錄每一次咖啡與品牌相遇的時刻。
            </p>
          </FadeIn>
        </div>
        <HeroImage src={eventsHeroImg} alt="活動現場的拉花咖啡與菜單" priority />
      </div>
    </section>
  )
}
