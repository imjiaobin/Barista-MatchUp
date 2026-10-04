'use client'

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface BarDatum {
  label: string
  value: number
  color?: string
}

// 通用的橫向長條分布圖，重用在活動類型/城市/預算/狀態階段/流失原因
// 幾種分布上。預設全部長條同一個品牌色（magnitude by category，類別
// 本身已經靠座標軸的文字標籤識別，不需要再用不同色相區分）；只有在
// 呼叫端想做「狀態階段的漸層推進」時才會透過 data 裡各自的 color 覆寫。
export default function BarDistributionChart({ data, barColor = '#b5592a', height }: { data: BarDatum[]; barColor?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height ?? Math.max(120, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: '#44403c' }} axisLine={false} tickLine={false} width={96} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e7e5e4', borderRadius: 0 }}
          labelStyle={{ color: '#44403c' }}
          formatter={(value) => [`${value} 筆`, '']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((d, i) => <Cell key={i} fill={d.color ?? barColor} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
