import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Panel } from '../ui/panel'
import { cn } from '../../lib/utils'

const devices = [
  { id: 'A1', name: 'เซ็นเซอร์1', status: 'ปกติ', variant: 'success' },
  { id: 'A2', name: 'เซ็นเซอร์2', status: 'หยุดทำงาน', variant: 'warning' },
  { id: 'A3', name: 'เซ็นเซอร์3', status: 'ปกติ', variant: 'success' },
  { id: 'A4', name: 'เซ็นเซอร์3', status: 'หยุดทำงาน', variant: 'warning' },
] as const

export type DeviceTableProps = {
  className?: string
}

/**
 * Table listing sensor devices and their current status.
 */
export function DeviceTable({ className }: DeviceTableProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">อุปกรณ์</p>
        <button type="button" className="text-xs text-ink-muted">
          สถานะ &gt;
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-ink-muted">
        <span>เครื่อง</span>
        <span>ชื่อ</span>
        <span>สถานะ</span>
      </div>
      <div className="space-y-2 text-sm">
        {devices.map((device) => (
          <div
            key={device.id}
            className="grid grid-cols-3 items-center gap-2 rounded-xl border border-border/60 bg-white/70 px-3 py-2"
          >
            <span className="font-semibold text-ink">{device.id}</span>
            <span className="text-ink">{device.name}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
                device.variant === 'success'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning',
              )}
            >
              {device.variant === 'success' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {device.status}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
