import { useState } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '../../ui/chart'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

const data = [
  { day: 'วันที่1', volume: 15, trend: 12 },
  { day: 'วันที่2', volume: 32, trend: 28 },
  { day: 'วันที่3', volume: 28, trend: 40 },
  { day: 'วันที่4', volume: 26, trend: 34 },
  { day: 'วันที่5', volume: 38, trend: 48 },
  { day: 'วันที่6', volume: 30, trend: 70 },
  { day: 'วันที่7', volume: 50, trend: 42 },
  { day: 'วันที่8', volume: 58, trend: 60 },
]

const chartConfig = {
  volume: {
    label: 'ปริมาณผลิต',
    color: 'hsl(var(--chart-1))',
  },
  trend: {
    label: 'แนวโน้ม',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

type TrendDatum = (typeof data)[number]

type TooltipState = {
  label: string
  volume: number
  trend: number
  x: number
  y: number
} | null

type ChartMouseState = {
  activeLabel?: string
  activePayload?: Array<{ payload?: TrendDatum }>
  chartX?: number
  chartY?: number
  isTooltipActive?: boolean
}

export type ProductionOverviewChartProps = {
  className?: string
}

/**
 * Mixed bar/line chart showing production trend over time.
 */
export function ProductionOverviewChart({
  className,
}: ProductionOverviewChartProps) {
  const [activePoint, setActivePoint] = useState<TooltipState>(null)
  const fallbackPoint = data[data.length - 1]

  const handleMouseMove = (state: ChartMouseState) => {
    const hasHover =
      state?.isTooltipActive ||
      Boolean(state?.activePayload?.length) ||
      Boolean(state?.activeLabel)

    if (!hasHover) {
      return
    }

    const payload = state.activePayload?.[0]?.payload
    const label = state.activeLabel ?? payload?.day ?? fallbackPoint.day

    setActivePoint({
      label,
      volume: payload?.volume ?? fallbackPoint.volume,
      trend: payload?.trend ?? fallbackPoint.trend,
      x: state.chartX ?? 0,
      y: state.chartY ?? 0,
    })
  }

  const handleMouseEnter = (state: ChartMouseState) => {
    setActivePoint({
      label: fallbackPoint.day,
      volume: fallbackPoint.volume,
      trend: fallbackPoint.trend,
      x: state?.chartX ?? 0,
      y: state?.chartY ?? 0,
    })
  }

  const handleMouseLeave = () => {
    setActivePoint(null)
  }

  const tooltipPayload = [
    {
      dataKey: 'volume',
      name: chartConfig.volume.label,
      value: activePoint?.volume ?? fallbackPoint.volume,
      color: chartConfig.volume.color,
    },
    {
      dataKey: 'trend',
      name: chartConfig.trend.label,
      value: activePoint?.trend ?? fallbackPoint.trend,
      color: chartConfig.trend.color,
    },
  ]

  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">แนวโน้มการผลิต</p>
        <div className="rounded-xl border border-border/70 bg-white/80 px-3 py-1.5 text-sm">
          <select className="bg-transparent text-sm text-ink outline-none">
            <option>วัน</option>
            <option>เดือน</option>
          </select>
        </div>
      </div>
      <div className="h-56">
        <ChartContainer config={chartConfig} className="h-full">
          {activePoint ? (
            <div
              className="pointer-events-none absolute"
              style={{
                left: activePoint.x,
                top: activePoint.y,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <ChartTooltipContent
                active
                label={activePoint.label}
                payload={tooltipPayload}
              />
            </div>
          ) : null}
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              margin={{ left: 8, right: 16 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-trend)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="90%"
                    stopColor="var(--color-trend)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Bar
                dataKey="volume"
                fill="var(--color-volume)"
                radius={[6, 6, 0, 0]}
                barSize={14}
              />
              <Area
                type="monotone"
                dataKey="trend"
                stroke="var(--color-trend)"
                strokeWidth={2.5}
                fill="url(#trendFill)"
                dot={{ r: 3, fill: 'var(--color-trend)' }}
                activeDot={{ r: 5, fill: 'var(--color-trend)' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Panel>
  )
}
