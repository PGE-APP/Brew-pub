import { Bell, Download, Menu, UserCircle2 } from 'lucide-react'

export type TopbarProps = {
  /** Dashboard header title. */
  title: string
  /** Hamburger toggle callback. */
  onMenuClick: () => void
}

/**
 * Top navigation bar with title, quick actions, and user info.
 */
export function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-border/70 p-2 text-ink-muted transition hover:text-ink"
            aria-label="เปิดเมนูด้านข้าง"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="max-w-xl font-display text-base font-semibold text-ink md:text-lg">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-ink-muted transition hover:text-ink"
          >
            <Download className="h-4 w-4" />
            ดาวน์โหลดข้อมูล
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-ink-muted transition hover:text-ink"
          >
            <UserCircle2 className="h-5 w-5" />
            Admin 01
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-ink-muted transition hover:text-ink"
            aria-label="การแจ้งเตือน"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
