import { useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
  FileText,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  to?: string;
  end?: boolean;
  children?: {
    label: string;
    to: string;
    icon?: typeof LayoutDashboard;
  }[];
};

const navItems: NavItem[] = [
  { label: "แดชบอร์ด", icon: LayoutDashboard, to: "/dashboard", end: true },
  { label: "แดชบอร์ดภาพรวม", icon: BarChart3, to: "/dashboard/overview" },
  {
    label: "รายการ",
    icon: ClipboardList,
    children: [
      { label: "ข้อมูลเซ็นเซอร์", to: "/records/sensor", icon: Activity },
      { label: "บันทึก Batch", to: "/records/batch", icon: FileText },
    ],
  },
  { label: "การผลิต", icon: Activity },
  { label: "คลังข้อมูล", icon: Database },
  { label: "ตั้งค่า", icon: Settings },
];

export type SidebarProps = {
  /** Controls if the sidebar is visible. */
  isOpen: boolean;
  /** Callback used when the sidebar should close. */
  onClose: () => void;
};

/**
 * Collapsible navigation sidebar for the dashboard.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["รายการ"]); // Default expand "รายการ"

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border/70 bg-surface/95 px-4 pb-6 pt-5 shadow-soft backdrop-blur transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
      aria-hidden={!isOpen}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">dashboard</p>
          <h2 className="font-display text-lg font-semibold text-ink">Brew Pub</h2>
          <p className="text-xs text-ink-muted">v.1.0.0</p>
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

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const baseClassName = "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition select-none";

          // Render Single Item
          if (!item.children && item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(baseClassName, isActive ? "bg-brand/10 text-brand" : "text-ink-muted hover:bg-brand/5 hover:text-ink")
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          }

          // Render Single Item (No Link - Placeholder)
          if (!item.children && !item.to) {
            return (
              <button key={item.label} type="button" className={cn(baseClassName, "text-ink-muted hover:bg-brand/5 hover:text-ink")}>
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          }

          // Render Parent with Children
          const isExpanded = expandedMenus.includes(item.label);
          // Check if any child is active to highlight parent
          const isChildActive = item.children?.some((child) => location.pathname.startsWith(child.to));

          return (
            <div key={item.label} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleMenu(item.label)}
                className={cn(baseClassName, isChildActive ? "text-brand" : "text-ink-muted hover:text-ink")}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-1 border-l border-border/50 pl-2">
                  {item.children?.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.to}
                      className={({ isActive }) =>
                        cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                          isActive ? "bg-brand/10 text-brand" : "text-ink-muted hover:bg-brand/5 hover:text-ink",
                        )
                      }
                    >
                      {/* Optional Icon for subitem, or just text */}
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="mt-6 border-t border-border/30 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-warning transition hover:bg-warning/10"
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-xs text-ink-muted">
        <p className="font-semibold text-ink">สถานะระบบ</p>
        <p className="mt-1">อัปเดตล่าสุด 09:12 น.</p>
        <div className="mt-3 flex items-center gap-2 text-success">
          <span className="h-2 w-2 rounded-full bg-success" />
          ระบบทำงานปกติ
        </div>
      </div>
    </aside>
  );
}
