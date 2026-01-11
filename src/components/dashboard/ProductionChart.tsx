import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart'
import { Panel } from '../ui/panel'
import { cn } from '../../lib/utils'

const data = [
  { date: '1 ก.ค.', output: 120 },
  { date: '2 ก.ค.', output: 210 },
  { date: '3 ก.ค.', output: 260 },
  { date: '4 ก.ค.', output: 580 },
]

const chartConfig = {
  output: {
    label: 'กำลังการผลิต',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

type TooltipState = {
  label: string
  value: number
  x: number
  y: number
} | null

type ChartMouseState = {
  activeLabel?: string
  activePayload?: Array<{ payload?: { output?: number } }>
  chartX?: number
  chartY?: number
  isTooltipActive?: boolean
}

export type ProductionChartProps = {
  className?: string
}

/**
 * Line chart showing production trend.
 */
export function ProductionChart({ className }: ProductionChartProps) {
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

    const value =
      state.activePayload?.[0]?.payload?.output ?? fallbackPoint.output
    const label = state.activeLabel ?? fallbackPoint.date
    setActivePoint({
      label,
      value,
      x: state.chartX ?? 0,
      y: state.chartY ?? 0,
    })
  }

  const handleMouseLeave = () => {
    setActivePoint(null)
  }

  const handleMouseEnter = (state: ChartMouseState) => {
    setActivePoint({
      label: fallbackPoint.date,
      value: fallbackPoint.output,
      x: state?.chartX ?? 0,
      y: state?.chartY ?? 0,
    })
  }

  const tooltipPayload = [
    {
      dataKey: 'output',
      name: chartConfig.output.label,
      value: activePoint?.value ?? fallbackPoint.output,
      color: chartConfig.output.color,
    },
  ]

  return (
    <Panel className={cn('space-y-4', className)}>
      <div>
        <p className="text-sm font-semibold text-ink">แนวโน้มการผลิต</p>
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
            <AreaChart
              data={data}
              margin={{ left: 8, right: 16 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="outputFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-output)" stopOpacity={0.35} />
                  <stop offset="90%" stopColor="var(--color-output)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Area
                type="monotone"
                dataKey="output"
                stroke="var(--color-output)"
                strokeWidth={2.5}
                fill="url(#outputFill)"
                dot={{ r: 3, fill: 'var(--color-output)' }}
                activeDot={{ r: 5, fill: 'var(--color-output)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Panel>
  )
}
