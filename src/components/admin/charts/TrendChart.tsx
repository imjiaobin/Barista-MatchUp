'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface TrendPoint {
  label: string
  count: number
}

// 顏色一律用 token 的 CSS 變數，深色模式自動切換
const tick = { fontSize: 12, fill: 'var(--muted-foreground)' }
export const chartTooltip = {
  contentStyle: { fontSize: 12, background: 'var(--popover)', color: 'var(--popover-foreground)', border: 'none', borderRadius: 12, boxShadow: 'var(--admin-shadow-pop)' },
  labelStyle: { color: 'var(--muted-foreground)' },
  cursor: { fill: 'var(--muted)', stroke: 'var(--border)' },
}

export default function TrendChart({ data, compact = false }: { data: TrendPoint[]; compact?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={compact ? 64 : 240}>
      <AreaChart data={data} margin={compact ? { top: 4, right: 4, left: 4, bottom: 4 } : { top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {!compact && (
          <>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="label" tick={tick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} width={32} />
          </>
        )}
        <Tooltip {...chartTooltip} formatter={(value) => [`${value} 筆`, '詢問量']} />
        <Area
          type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={2} fill="url(#trendFill)"
          dot={compact ? false : { r: 3, fill: 'var(--chart-1)', strokeWidth: 0 }}
          activeDot={{ r: compact ? 3 : 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
