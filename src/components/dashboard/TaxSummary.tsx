import { CalendarCheck, Coins, Receipt } from 'lucide-react'
import { Panel } from '../ui/panel'
import { cn } from '../../lib/utils'

export type TaxSummaryProps = {
  className?: string
}

/**
 * Compact tax summary card.
 */
export function TaxSummary({ className }: TaxSummaryProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div>
        <p className="text-sm font-semibold text-ink">ภาษีสรรสามิต</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
          <CalendarCheck className="h-4 w-4" />
          ระยะเวลา
          <span className="ml-auto font-semibold text-ink">ก.ค. 2568</span>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-muted">
            <Receipt className="h-4 w-4" />
            ยอดขาย
          </div>
          <span className="font-semibold text-ink">1,200,000</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-muted">
            <Coins className="h-4 w-4" />
            ภาษีที่จัดเก็บได้
          </div>
          <span className="font-semibold text-ink">60,000</span>
        </div>
      </div>
    </Panel>
  )
}
