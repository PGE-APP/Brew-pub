import { ArrowUpRight } from 'lucide-react'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

const stats = [
  {
    value: '5,000,000',
    label: 'จำนวนการผลิตรวมของเบียร์',
    change: '7.6% QoQ',
  },
  {
    value: '1,250,000',
    label: 'ภาษีที่คาดว่าจะจัดเก็บได้',
    change: '5.0% QoQ',
  },
  {
    value: '250',
    label: 'จำนวนถังหรือโรงงานที่ผลิตเบียร์',
    change: '7.6% QoQ',
  },
  {
    value: '180',
    label: 'จำนวนใบอนุญาตที่ใกล้หมดอายุ',
    change: '1.0% QoQ',
  },
]

export type StatsSummaryProps = {
  className?: string
}

/**
 * KPI summary cards for the overview dashboard.
 */
export function StatsSummary({ className }: StatsSummaryProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border/60 bg-white/90 p-4 shadow-soft"
          >
            <p className="text-3xl font-semibold text-ink">{item.value}</p>
            <p className="mt-2 text-sm text-ink-muted">{item.label}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-success">
              <ArrowUpRight className="h-4 w-4" />
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
