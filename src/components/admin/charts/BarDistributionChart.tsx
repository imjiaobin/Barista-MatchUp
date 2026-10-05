'use client'

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTooltip } from './TrendChart'

export interface BarDatum {
  label: string
  value: number
  // 只接受 token：'var(--chart-1)' ~ 'var(--chart-4)'
  color?: string
}

export default function BarDistributionChart({ data, barColor = 'var(--chart-1)', height }: { data: BarDatum[]; barColor?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height ?? Math.max(120, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: 'var(--foreground)' }} axisLine={false} tickLine={false} width={96} />
        <Tooltip {...chartTooltip} formatter={(value) => [`${value} 筆`, '']} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
          {data.map((d, i) => <Cell key={i} fill={d.color ?? barColor} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
