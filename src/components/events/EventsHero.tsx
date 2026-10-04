import eventsHeroImg from '../../assets/hero-5.jpg'
import HeroImage from '../shared/HeroImage'
import FadeIn from '../FadeIn'

interface EventsHeroProps {
  label: string
  headingLine1: string
  headingAccent: string
  body: string
}

export default function EventsHero({ label, headingLine1, headingAccent, body }: EventsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] items-stretch md:min-h-[480px]">
        <div className="relative z-10 flex flex-col justify-center py-32 md:py-24 md:pr-16">
          <FadeIn>
            <p className="section-label text-caramel md:text-lg mb-4">{label}</p>
            <h1 className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight max-w-2xl">
              {headingLine1}<br />
              <span className="text-caramel italic">{headingAccent}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-stone-500 leading-relaxed max-w-md mt-8">
              {body}
            </p>
          </FadeIn>
        </div>
        <HeroImage src={eventsHeroImg} alt="活動現場的拉花咖啡與菜單" priority />
      </div>
    </section>
  )
}
