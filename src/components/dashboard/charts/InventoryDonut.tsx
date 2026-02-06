import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '../../ui/chart'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

type InventoryKey = 'remaining' | 'used'

const data: Array<{ key: InventoryKey; name: string; value: number }> = [
  { key: 'remaining', name: 'คงเหลือ', value: 5400 },
  { key: 'used', name: 'ใช้แล้ว', value: 2800 },
]

const chartConfig = {
  remaining: {
    label: 'คงเหลือ',
    color: 'hsl(var(--chart-1))',
  },
  used: {
    label: 'ใช้แล้ว',
    color: 'hsl(var(--chart-2))',
  },
} satisfies Record<InventoryKey, { label: string; color: string }> & ChartConfig

const tooltipMock = data.map((item) => ({
  dataKey: item.key,
  name: item.name,
  value: item.value,
  color: chartConfig[item.key].color,
}))

export type InventoryDonutProps = {
  className?: string
}

/**
 * Donut chart showing remaining vs used inventory.
 */
export function InventoryDonut({ className }: InventoryDonutProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">ปริมาณคงเหลือ</p>
        </div>
      </div>
      <div className="h-48">
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip mockLabel="สรุป" mockPayload={tooltipMock} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={`var(--color-${entry.key})`}
                    stroke="transparent"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        {data.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ink">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: chartConfig[item.key].color }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-ink">{item.name}</span>
            </div>
            <span className="font-semibold text-ink">
              {item.value.toLocaleString('th-TH')}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
