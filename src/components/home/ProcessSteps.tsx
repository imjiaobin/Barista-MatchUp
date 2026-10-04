"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiArrowRight,
  FiCoffee,
  FiEdit3,
  FiMessageCircle,
} from "react-icons/fi";
import { PiHandshake } from "react-icons/pi";

const steps = [
  {
    num: "01",
    title: "填寫需求",
    desc: "告訴我們活動日期、規模、預算與風格，只需 3 分鐘。",
  },
  {
    num: "02",
    title: "討論細節",
    desc: "48 小時內，我們推薦 2–3 位最適合的咖啡師供你選擇。",
  },
  {
    num: "03",
    title: "確認合作",
    desc: "與咖啡師視訊溝通，確認風格、菜單與現場細節。",
  },
  {
    num: "04",
    title: "完美執行",
    desc: "活動當天，咖啡師準時到場，Pourfolio 全程支援協調。",
  },
];

const STEP_ICONS = [FiEdit3, FiMessageCircle, PiHandshake, FiCoffee];

// hover 放大用 CSS transform（不影響 layout 尺寸），這樣左右兩條線不會
// 因為圓點實際佔用空間變大而被擠壓位移。
function StepDot({ index }: { index: number }) {
  const Icon = STEP_ICONS[index];
  return (
    <div className="relative w-4 h-4 rounded-full bg-caramel flex items-center justify-center text-white transition-transform duration-300 ease-out group-hover:scale-[2.5]">
      <span className="absolute inset-0 flex items-center justify-center opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100">
        <Icon size={8} />
      </span>
    </div>
  );
}

interface StepColumnProps {
  num: string;
  title: string;
  desc: string;
  index: number;
  isLast: boolean;
}

// 圓點 hover 放大需要的空間直接固定留在版面間距裡（標題下方、描述上方
// 都多留一點），而不是 hover 當下才動態推開文字——既不用額外處理動畫
// 時機，平常沒 hover 時留白也只是稍微寬鬆一點，不會顯得擁擠。
function StepColumn({ num, title, desc, index, isLast }: StepColumnProps) {
  return (
    <div className="group flex flex-col items-center text-center">
      <motion.span
        className="block text-lg font-[400] text-caramel-dark tracking-[0.25em] uppercase mb-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.2, duration: 0.4 }}
      >
        {num}
      </motion.span>
      <motion.h3
        className="text-xl text-stone-800 mb-6"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 + index * 0.2, duration: 0.4 }}
      >
        {title}
      </motion.h3>
      <div className="flex items-center w-full mb-8">
        <motion.div
          className={`flex-1 h-px bg-stone-200 ${index === 0 ? "invisible" : ""}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: "right" }}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
        />
        <motion.div
          className="shrink-0 mx-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3 + index * 0.2,
            type: "spring" as const,
            stiffness: 140,
            damping: 14,
          }}
        >
          <StepDot index={index} />
        </motion.div>
        <motion.div
          className={`flex-1 h-px bg-stone-200 ${isLast ? "invisible" : ""}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
        />
      </div>
      <motion.div
        className="px-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.18, duration: 0.4 }}
      >
        <p className="text-md text-stone-500 leading-relaxed">{desc}</p>
      </motion.div>
    </div>
  );
}

export default function ProcessSteps() {
  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="section-label text-caramel md:text-xl mb-3">媒合流程</p>
          <h2 className="section-title">
            四個步驟，一次完美的
            <br />
            咖啡師媒合體驗
          </h2>
        </motion.div>

        {/* 桌面版：橫向排列 —— 圓點之間用一條線橫向貫穿整排 */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4">
            {steps.map(({ num, title, desc }, i) => (
              <StepColumn
                key={num}
                num={num}
                title={title}
                desc={desc}
                index={i}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="text-center mt-16"
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 font-[450] text-sm md:text-lg text-caramel-dark tracking-widest uppercase"
            >
              <span className="transition-transform  duration-200 group-hover:-translate-x-1">
                了解完整服務
              </span>
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* 手機版：垂直排列，維持原樣 */}
        <div className="md:hidden max-w-3xl mx-auto">
          {steps.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              className={`py-10 ${i < steps.length - 1 ? "border-b border-stone-100" : ""}`}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.4 }}
            >
              <div className="w-8 h-8 rounded-full bg-caramel flex items-center justify-center shrink-0 mb-3">
                <span className="text-white text-xs ">{i + 1}</span>
              </div>
              <h3 className="text-xl text-stone-800 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="pt-8"
          >
            <Link
              href="/services"
              className="flex items-center gap-2 text-sm text-caramel-dark tracking-widest uppercase hover:gap-4 transition-all duration-200"
            >
              了解完整服務 <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
