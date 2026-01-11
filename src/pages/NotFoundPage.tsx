import { ArrowLeft, BarChart3, LayoutDashboard, SearchX } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel } from '../components/ui/panel'

/**
 * Standalone 404 page aligned with the system theme.
 */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.12),transparent_55%)]" />
      <main className="relative z-10 w-full max-w-5xl">
        <Panel className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-10 left-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-muted">
                error 404
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-ink">
                ไม่พบหน้านี้
              </h2>
              <p className="mt-3 max-w-xl text-sm text-ink-muted">
                หน้าที่คุณต้องการอาจถูกย้าย ลบ หรือพิมพ์ URL ไม่ถูกต้อง
                ลองใช้ปุ่มด้านล่างเพื่อกลับไปยังหน้าหลักของระบบ
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-white/80 px-4 py-2 text-sm font-semibold text-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                  กลับหน้าก่อนหน้า
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  แดชบอร์ดหลัก
                </Link>
                <Link
                  to="/dashboard/overview"
                  className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand"
                >
                  <BarChart3 className="h-4 w-4" />
                  แดชบอร์ดภาพรวม
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-white/80 p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning">
                  <SearchX className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    แนะนำการตรวจสอบ
                  </p>
                  <p className="text-xs text-ink-muted">
                    เคล็ดลับเพื่อกลับสู่ระบบเร็วขึ้น
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  ตรวจสอบการพิมพ์ URL ให้ถูกต้อง
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  ใช้เมนูหลักเพื่อไปยังหน้าที่ต้องการ
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  หากพบปัญหาซ้ำให้แจ้งผู้ดูแลระบบ
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </main>
    </div>
  )
}
