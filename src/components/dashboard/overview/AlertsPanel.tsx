import { AlertTriangle } from 'lucide-react'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

const alerts = [
  {
    date: '13-06-68',
    message: 'ใบอนุญาตกำลังจะหมดอายุ',
    tone: 'danger',
  },
  {
    date: '10-06-68',
    message: 'ใบอนุญาตหมดอายุเร็วๆนี้',
    tone: 'caution',
  },
]

export type AlertsPanelProps = {
  className?: string
}

/**
 * Highlighted alerts for time-sensitive notices.
 */
export function AlertsPanel({ className }: AlertsPanelProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <p className="text-sm font-semibold text-ink">แจ้งเตือน</p>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const toneClassName =
            alert.tone === 'danger'
              ? 'border-warning/30 bg-warning/15 text-warning'
              : 'border-accent/30 bg-accent/15 text-accent'

          return (
            <div
              key={alert.date}
              className={cn(
                'flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft',
                toneClassName,
              )}
            >
              <div className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{alert.date}</p>
                <p className="text-sm font-semibold text-ink">{alert.message}</p>
              </div>
            </div>
          )}
        )}
      </div>
    </Panel>
  )
}
