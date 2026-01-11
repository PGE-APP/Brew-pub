import { AlertCircle } from 'lucide-react'
import { Panel } from '../ui/panel'
import { cn } from '../../lib/utils'

const alerts = [
  'เตือน : เซ็นเซอร์2 หยุดทำงาน เวลา 09.12',
  'เซ็นเซอร์4 หยุดทำงาน เวลา 12.44',
]

export type AlertsListProps = {
  className?: string
}

/**
 * Compact list of recent alert messages.
 */
export function AlertsList({ className }: AlertsListProps) {
  return (
    <Panel className={cn('space-y-3', className)}>
      <div className="space-y-2 text-sm text-ink-muted">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-warning" />
              <span>{alert}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
