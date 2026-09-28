import FadeIn from '../FadeIn'

export default function EventsHero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="section-label text-brown md:text-lg mb-4">活動故事</p>
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
    </section>
  )
}
