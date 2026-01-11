import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export type StatCardProps = {
  title: string
  value: string
  helper?: string
  icon: LucideIcon
  accentClass?: string
}

/**
 * Metric card used for the top KPI row.
 */
export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  accentClass,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-2xl border border-border/70 bg-surface/95 p-5 shadow-soft',
        accentClass,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted">{title}</p>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4">
        <p className="font-display text-3xl font-semibold text-ink">{value}</p>
        {helper ? (
          <p className="mt-1 text-sm text-ink-muted">{helper}</p>
        ) : null}
      </div>
    </div>
  )
}
