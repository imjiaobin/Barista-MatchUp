'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiInstagram, FiSend } from 'react-icons/fi'
import { submitContactInquiry } from '../../lib/actions/contact'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

interface FormState {
  name: string
  email: string
  eventDate: string
  eventType: string
  budget: string
  message: string
  website: string
}

const initialForm: FormState = {
  name: '', email: '', eventDate: '', eventType: '', budget: '', message: '', website: '',
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await submitContactInquiry(form)

    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error ?? '送出失敗，請稍後再試')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="section-label mb-4">
            聯絡我們
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-light text-stone-800 leading-[1.1] tracking-tight"
          >
            告訴我們你的<br />
            <span className="text-indigo italic">活動故事</span>
          </motion.h1>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16">
          {/* Contact info */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
          >
            <p className="section-label mb-6">直接聯絡</p>
            <div className="flex flex-col gap-6 mb-12">
              <a href="mailto:hello@pourfolio.tw" className="flex items-center gap-3 text-stone-600 hover:text-brown transition-colors duration-200">
                <FiMail size={16} className="text-olive shrink-0" />
                <span className="text-sm">hello@pourfolio.tw</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-brown transition-colors duration-200">
                <FiInstagram size={16} className="text-olive shrink-0" />
                <span className="text-sm">@pourfolio.tw</span>
              </a>
            </div>

            <div className="border-t border-stone-200 pt-8">
              <p className="section-label mb-4">回覆時間</p>
              <p className="text-sm text-stone-500 leading-relaxed">
                我們通常在 <span className="text-brown font-medium">48 小時內</span>回覆所有詢問。<br />
                急件請直接 Email 標注「急件」。
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mb-6">
                  <FiSend size={24} className="text-olive" />
                </div>
                <h3 className="text-2xl font-light text-stone-800 mb-3">已收到你的需求</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
                  我們會在 48 小時內與你聯繫，提供適合的咖啡師推薦。
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                  type="text" name="website" value={form.website} onChange={handleChange}
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px overflow-hidden"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-stone-400">姓名 / 公司</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
                      placeholder="王小明 / OO 品牌"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-stone-400">Email</label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange} required
                      className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-stone-400">活動日期</label>
                    <input
                      name="eventDate" type="date" value={form.eventDate} onChange={handleChange}
                      className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-stone-400">活動類型</label>
                    <select
                      name="eventType" value={form.eventType} onChange={handleChange}
                      className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
                    >
                      <option value="">請選擇</option>
                      <option>企業尾牙 / 年會</option>
                      <option>品牌發表會</option>
                      <option>市集 / 展覽</option>
                      <option>婚禮 / 宴席</option>
                      <option>其他</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-stone-400">預算範圍</label>
                  <select
                    name="budget" value={form.budget} onChange={handleChange}
                    className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200"
                  >
                    <option value="">請選擇</option>
                    <option>NT$5,000 以下</option>
                    <option>NT$5,000 – 15,000</option>
                    <option>NT$15,000 – 30,000</option>
                    <option>NT$30,000 以上</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-widest uppercase text-stone-400">活動說明</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} rows={5}
                    className="border border-stone-200 px-4 py-3 text-sm text-stone-700 bg-transparent focus:outline-none focus:border-brown transition-colors duration-200 resize-none"
                    placeholder="請描述活動規模、地點、特殊需求..."
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button type="submit" disabled={submitting} className="btn-primary self-start flex items-center gap-2 disabled:opacity-50">
                  <FiSend size={14} /> {submitting ? '送出中...' : '送出需求'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
