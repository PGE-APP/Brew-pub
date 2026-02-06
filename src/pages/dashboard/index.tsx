import { useState } from "react";
import { AlertBanner } from "../../components/dashboard/alerts/AlertBanner";
import { AlertsList } from "../../components/dashboard/alerts/AlertsList";
import { DeviceTable } from "../../components/dashboard/tables/DeviceTable";
import { FilterBar } from "../../components/dashboard/panels/FilterBar";
import { InventoryDonut } from "../../components/dashboard/charts/InventoryDonut";
import { MapPanel } from "../../components/dashboard/panels/MapPanel";
import { ProductionChart } from "../../components/dashboard/charts/ProductionChart";
import { ProductionTable } from "../../components/dashboard/tables/ProductionTable";
import { RecordsPanel } from "../../components/dashboard/tables/RecordsPanel";
import { StatGrid } from "../../components/dashboard/stats/StatGrid";
import { TaxSummary } from "../../components/dashboard/stats/TaxSummary";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { cn } from "../../lib/utils";

/**
 * Main dashboard page assembled from modular components.
 */
export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} role="presentation" />
      ) : null}

      <div className={cn("min-h-screen transition-[margin] duration-300", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
        <Topbar title="โครงการสร้างนวัตกรรมเพื่อกำกับดูแลการบริหารการจัดเก็บภาษีสุรา" onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: "แดชบอร์ด" }]} />
          <FilterBar />
          <StatGrid />

          <section className="grid gap-6 lg:grid-cols-12">
            <InventoryDonut className="lg:col-span-4" />
            <ProductionChart className="lg:col-span-5" />
            <TaxSummary className="lg:col-span-3" />
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <DeviceTable className="lg:col-span-4" />
            <div className="space-y-6 lg:col-span-4">
              <AlertBanner />
              <ProductionTable />
            </div>
            <MapPanel className="lg:col-span-4" />
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <AlertsList className="lg:col-span-4" />
            <RecordsPanel className="lg:col-span-8" />
          </section>
        </main>
      </div>
    </div>
  );
}
