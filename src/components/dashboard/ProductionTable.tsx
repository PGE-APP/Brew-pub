import { Panel } from '../ui/panel'
import { cn } from '../../lib/utils'

const rows = [
  { period: 'ก.ค. 2568', capacity: '7,500', volume: '4,500', total: '12,000' },
  { period: 'มิ.ย. 2568', capacity: '7,500', volume: '3,500', total: '11,000' },
  { period: 'พ.ค. 2568', capacity: '7,500', volume: '4,500', total: '12,000' },
]

export type ProductionTableProps = {
  className?: string
}

/**
 * Historical production table.
 */
export function ProductionTable({ className }: ProductionTableProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-ink-muted">
        <span>ช่วงเวลา</span>
        <span>กำลังการผลิต</span>
        <span>ปริมาณ</span>
        <span>จำนวน</span>
      </div>
      <div className="space-y-2 text-sm">
        {rows.map((row) => (
          <div
            key={row.period}
            className="grid grid-cols-4 gap-2 rounded-xl border border-border/60 bg-white/70 px-3 py-2"
          >
            <span className="font-semibold text-ink">{row.period}</span>
            <span>{row.capacity}</span>
            <span>{row.volume}</span>
            <span>{row.total}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
