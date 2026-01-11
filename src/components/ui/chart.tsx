import * as React from 'react'
import { Tooltip, type TooltipProps } from 'recharts'
import { cn } from '../../lib/utils'

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

/**
 * Provides chart color tokens and shared styling for Recharts-based charts.
 */
export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
  }
>(({ className, config, style, children, ...props }, ref) => {
  const chartVars = Object.entries(config).reduce(
    (acc, [key, item]) => {
      acc[`--color-${key}`] = item.color
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          'relative flex h-full w-full items-center justify-center text-xs text-ink-muted [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-cartesian-axis-tick_text]:fill-ink-muted [&_.recharts-tooltip-cursor]:stroke-border/80',
          className,
        )}
        style={{ ...chartVars, ...style }}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'ChartContainer'

/**
 * Shadcn-style tooltip wrapper for Recharts.
 */
type ChartTooltipPayloadItem = {
  dataKey?: string | number
  name?: string | number
  value?: number | string
  color?: string
}

type ChartTooltipProps = TooltipProps<number, string> & {
  mockPayload?: ChartTooltipPayloadItem[]
  mockLabel?: string | number
}

export function ChartTooltip({
  mockPayload,
  mockLabel,
  ...props
}: ChartTooltipProps) {
  return (
    <Tooltip
      {...props}
      cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }}
      wrapperStyle={{ zIndex: 30 }}
      content={(tooltipProps) => (
        <ChartTooltipContent
          {...tooltipProps}
          mockPayload={mockPayload}
          mockLabel={mockLabel}
        />
      )}
    />
  )
}

/**
 * Tooltip content that reads labels and colors from ChartContainer config.
 */
type ChartTooltipContentProps = {
  className?: string
  active?: boolean
  payload?: ChartTooltipPayloadItem[]
  label?: string | number
  mockPayload?: ChartTooltipPayloadItem[]
  mockLabel?: string | number
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({ active, payload, label, className, mockPayload, mockLabel }, ref) => {
  const chart = React.useContext(ChartContext)
  const resolvedPayload = payload?.length ? payload : mockPayload
  const resolvedLabel = label ?? mockLabel

  if (!active || !resolvedPayload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border/70 bg-surface/95 px-3 py-2 text-xs shadow-soft backdrop-blur',
        className,
      )}
    >
      {resolvedLabel ? (
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {resolvedLabel}
        </div>
      ) : null}
      <div className="space-y-1">
        {resolvedPayload.map((item) => {
          const key = item.dataKey?.toString() ?? item.name?.toString() ?? ''
          const configItem = key ? chart?.config[key] : undefined
          const color =
            configItem?.color ?? item.color ?? 'hsl(var(--chart-1))'
          const value =
            typeof item.value === 'number'
              ? item.value.toLocaleString('th-TH')
              : item.value ?? '-'

          return (
            <div key={`${key}-${item.value}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-ink">
                  {configItem?.label ?? item.name ?? key}
                </span>
              </div>
              <span className="font-semibold text-ink">{value}</span>
            </div>
          )}
        )}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = 'ChartTooltipContent'
