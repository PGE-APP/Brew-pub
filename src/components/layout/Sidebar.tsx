import {
  Activity,
  BarChart3,
  ClipboardList,
  Database,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  to?: string
  end?: boolean
}

const navItems: NavItem[] = [
  { label: 'แดชบอร์ด', icon: LayoutDashboard, to: '/dashboard', end: true },
  { label: 'แดชบอร์ดภาพรวม', icon: BarChart3, to: '/dashboard/overview' },
  { label: 'รายการ', icon: ClipboardList, to: '/records' },
  { label: 'การผลิต', icon: Activity },
  { label: 'คลังข้อมูล', icon: Database },
  { label: 'ตั้งค่า', icon: Settings },
]

export type SidebarProps = {
  /** Controls if the sidebar is visible. */
  isOpen: boolean
  /** Callback used when the sidebar should close. */
  onClose: () => void
}

/**
 * Collapsible navigation sidebar for the dashboard.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 border-r border-border/70 bg-surface/95 px-4 pb-6 pt-5 shadow-soft backdrop-blur transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      aria-hidden={!isOpen}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            dashboard
          </p>
          <h2 className="font-display text-lg font-semibold text-ink">
            Brew Pub
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-border/70 p-2 text-ink-muted transition hover:text-ink"
          aria-label="ปิดเมนูด้านข้าง"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const baseClassName =
            'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition'

          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    baseClassName,
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-ink-muted hover:bg-brand/5 hover:text-ink',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          }

          return (
            <button
              key={item.label}
              type="button"
              className={cn(baseClassName, 'text-ink-muted hover:bg-brand/5 hover:text-ink')}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-xs text-ink-muted">
        <p className="font-semibold text-ink">สถานะระบบ</p>
        <p className="mt-1">อัปเดตล่าสุด 09:12 น.</p>
        <div className="mt-3 flex items-center gap-2 text-success">
          <span className="h-2 w-2 rounded-full bg-success" />
          ระบบทำงานปกติ
        </div>
      </div>
    </aside>
  )
}
