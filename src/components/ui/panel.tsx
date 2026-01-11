import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

/**
 * Shared card surface used across the dashboard sections.
 */
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-surface/95 p-5 shadow-soft backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
