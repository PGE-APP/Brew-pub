import { CalendarDays, ListFilter, Search, SlidersHorizontal } from 'lucide-react'

/**
 * Search and filter bar matching the screenshot layout.
 */
export function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-soft">
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/70 px-3 py-2 text-sm text-ink-muted">
        <CalendarDays className="h-4 w-4" />
        <select className="bg-transparent text-sm text-ink outline-none">
          <option>วันที่</option>
          <option>ก.ค. 2568</option>
          <option>มิ.ย. 2568</option>
        </select>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/70 px-3 py-2 text-sm text-ink-muted">
        <ListFilter className="h-4 w-4" />
        <select className="bg-transparent text-sm text-ink outline-none">
          <option>รายการ</option>
          <option>ภาษีสุรา</option>
          <option>ยอดผลิต</option>
        </select>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/70 px-3 py-2 text-sm text-ink-muted">
        <SlidersHorizontal className="h-4 w-4" />
        <select className="bg-transparent text-sm text-ink outline-none">
          <option>ปริมาณ</option>
          <option>0 - 3,000</option>
          <option>3,001 - 9,000</option>
        </select>
      </div>
      <button
        type="button"
        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-soft transition hover:brightness-95"
      >
        <Search className="h-4 w-4" />
        ค้นหา
      </button>
    </div>
  )
}
