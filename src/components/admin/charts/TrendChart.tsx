'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface TrendPoint {
  label: string
  count: number
}

interface TrendChartProps {
  data: TrendPoint[]
  // 給儀錶板用的極簡 sparkline 模式：拿掉座標軸/格線，高度壓低，只留
  // 形狀當作一眼瞄過去的趨勢指標，不是給人細讀數值的完整圖表。
  compact?: boolean
}

// 單一數列（詢問量），不需要圖例——標題已經說明這是什麼數列了。
export default function TrendChart({ data, compact = false }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={compact ? 64 : 240}>
      <AreaChart data={data} margin={compact ? { top: 4, right: 4, left: 4, bottom: 4 } : { top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5592a" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#b5592a" stopOpacity={0} />
          </linearGradient>
        </defs>
        {!compact && (
          <>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} width={32} />
          </>
        )}
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e7e5e4', borderRadius: 0 }}
          labelStyle={{ color: '#44403c' }}
          formatter={(value) => [`${value} 筆`, '詢問量']}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#b5592a"
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={compact ? false : { r: 3, fill: '#b5592a', strokeWidth: 0 }}
          activeDot={{ r: compact ? 3 : 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
