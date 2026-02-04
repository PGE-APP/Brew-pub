import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

const records = [
  {
    id: 'R-1024',
    title: 'ใบรายงานสรุปภาษี',
    amount: '1,200,000',
    time: '09:12',
    status: 'พร้อมใช้งาน',
    tone: 'success',
  },
  {
    id: 'R-1025',
    title: 'รายการขนส่งประจำวัน',
    amount: '320,000',
    time: '10:30',
    status: 'กำลังตรวจสอบ',
    tone: 'warning',
  },
  {
    id: 'R-1026',
    title: 'ใบแจ้งเตือนอุปกรณ์',
    amount: '-',
    time: '12:44',
    status: 'ต้องแก้ไข',
    tone: 'danger',
  },
]

export type RecordsPanelProps = {
  className?: string
}

/**
 * Mock list of recent records.
 */
export function RecordsPanel({ className }: RecordsPanelProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">รายการ</p>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-ink-muted">
        <span>เลขที่</span>
        <span>รายการ</span>
        <span>สถานะ</span>
        <span className="text-right">มูลค่า</span>
      </div>
      <div className="space-y-2">
        {records.map((record) => {
          const StatusIcon =
            record.tone === 'success'
              ? CheckCircle2
              : record.tone === 'warning'
                ? Clock
                : AlertTriangle

          const statusClassName =
            record.tone === 'success'
              ? 'bg-success/10 text-success'
              : record.tone === 'warning'
                ? 'bg-accent/10 text-accent'
                : 'bg-warning/10 text-warning'

          return (
            <div
              key={record.id}
              className="grid grid-cols-4 items-center gap-2 rounded-xl border border-border/60 bg-white/70 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{record.id}</p>
                  <p className="text-xs text-ink-muted">{record.time}</p>
                </div>
              </div>
              <p className="text-ink">{record.title}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold',
                  statusClassName,
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {record.status}
              </span>
              <span className="text-right font-semibold text-ink">
                {record.amount}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
