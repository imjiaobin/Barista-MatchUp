import Image, { type StaticImageData } from 'next/image'

interface HeroImageProps {
  src: StaticImageData
  alt: string
  priority?: boolean
}

// 只在桌面顯示——手機版維持原本單純的文字 hero，不放圖。圖片做成偏
// 矮、偏橫向的一個區塊，在欄位裡置中浮著，四周都用白到透明的漸層跟
// 背景融合，而不是滿版高度、生硬分割的矩形圖框。
export default function HeroImage({ src, alt, priority }: HeroImageProps) {
  return (
    <div className="hidden md:flex items-center justify-center h-full">
      <div className="relative w-full h-[320px] lg:h-[360px] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="50vw"
          className="object-cover"
        />
        {/* 微微加深的遮罩，提升文字對比度 */}
        <div className="absolute inset-0 bg-black/15" />
        {/* 四個邊緣都做模糊漸層，取代生硬的矩形分割線 */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
        {/* <div className="absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white to-transparent" /> */}
      </div>
    </div>
  )
}
