import { AlertTriangle } from 'lucide-react'
import { cn } from '../../../lib/utils'

export type AlertBannerProps = {
  className?: string
}

/**
 * Highlighted alert banner for urgent system warnings.
 */
export function AlertBanner({ className }: AlertBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning shadow-soft',
        className,
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning text-warning-foreground">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">
          เตือน : มีเซ็นเซอร์ 2 ตัว หยุดทำงาน เวลา 09.12
        </p>
      </div>
    </div>
  )
}
