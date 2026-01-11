import { useState } from 'react'
import { AlertsPanel } from '../components/dashboard/overview/AlertsPanel'
import { OperationsPanel } from '../components/dashboard/overview/OperationsPanel'
import { ProductionOverviewChart } from '../components/dashboard/overview/ProductionOverviewChart'
import { StatsSummary } from '../components/dashboard/overview/StatsSummary'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { cn } from '../lib/utils'

/**
 * Secondary dashboard page matching the overview layout.
 */
export function DashboardOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      ) : null}

      <div
        className={cn(
          'min-h-screen transition-[margin] duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0',
        )}
      >
        <Topbar
          title="แดชบอร์ดภาพรวมการผลิตและการกำกับดูแล"
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: 'แดชบอร์ดภาพรวม' }]} />

          <section className="grid gap-6 lg:grid-cols-12">
            <StatsSummary className="lg:col-span-8" />
            <AlertsPanel className="lg:col-span-4" />
          </section>

          <ProductionOverviewChart />

          <OperationsPanel />
        </main>
      </div>
    </div>
  )
}
