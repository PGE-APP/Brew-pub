import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { Panel } from "../../components/ui/panel";
import { TankGauge } from "../../components/ui/TankGauge";
import { cn } from "../../lib/utils";

type RecordData = {
  level: string;
  percent: number;
  Signal_Low: number;
  Signal_High: number;
  Signal_current: string | number;
  Tank_High: string;
  flowrate: string;
  TimeStamp: string;
};

const ITEMS_PER_PAGE = 10;

/**
 * Records list page displaying data from REST API.
 */
export function RecordsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Use refs to track state without triggering re-renders and avoiding stale closures in intervals
  const isFirstLoad = useRef(true);
  const lastDataStr = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if tab is hidden (save resources)
      if (document.hidden) return;

      try {
        if (isFirstLoad.current) setLoading(true);

        const response = await axios.get("http://192.168.1.120:1880/restData");
        const recordsArray = Array.isArray(response.data) ? response.data : [response.data];

        const currentDataStr = JSON.stringify(recordsArray);
        if (currentDataStr !== lastDataStr.current) {
          setRecords(recordsArray);
          lastDataStr.current = currentDataStr;
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Only show error if we have no data at all (first load failed)
        if (lastDataStr.current === "") {
          if (axios.isAxiosError(err)) {
            setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
          } else {
            setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
          }
        }
      } finally {
        if (isFirstLoad.current) {
          setLoading(false);
          isFirstLoad.current = false;
        }

        // Reset countdown
        setCountdown(15);

        // Schedule next fetch only after current one finishes (Prevent pile-up)
        if (!document.hidden) {
          timerRef.current = setTimeout(fetchData, 15000); // 15 seconds
        }
      }
    };

    // Initial fetch
    fetchData();

    // Countdown ticker - updates every second
    const updateCountdown = () => {
      setCountdown((prev) => {
        if (prev > 0) return prev - 1;
        return 15; // Reset when reaches 0
      });
      countdownTimerRef.current = setTimeout(updateCountdown, 1000);
    };
    countdownTimerRef.current = setTimeout(updateCountdown, 1000);

    // Handle visibility change to resume/pause
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      } else {
        // Resume immediately when visible
        setCountdown(15);
        fetchData();
        countdownTimerRef.current = setTimeout(updateCountdown, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(records.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = records.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} role="presentation" />
      ) : null}

      <div className={cn("min-h-screen transition-[margin] duration-300", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
        <Topbar title="รายการข้อมูลจากเซ็นเซอร์" onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: "รายการ" }, { label: "ข้อมูลเซ็นเซอร์" }]} />

          {/* Data Table Panel - at the top */}
          <Panel>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">ข้อมูลการตรวจวัด</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-xs text-ink-muted">อัปเดตอัตโนมัติใน {countdown} วินาที</p>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                <p className="ml-3 text-ink-muted">กำลังโหลดข้อมูล...</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-warning">
                <p className="font-semibold">⚠️ ไม่สามารถโหลดข้อมูลได้</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            )}

            {!loading && !error && records.length === 0 && (
              <div className="py-12 text-center text-ink-muted">
                <p>ไม่พบข้อมูล</p>
              </div>
            )}

            {!loading && !error && records.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-brand/5 text-xs uppercase tracking-wide text-ink-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ลำดับ</th>
                        <th className="px-4 py-3 font-semibold">Level (L)</th>
                        <th className="px-4 py-3 font-semibold">เปอร์เซ็นต์</th>
                        <th className="px-4 py-3 font-semibold">Signal Low</th>
                        <th className="px-4 py-3 font-semibold">Signal High</th>
                        <th className="px-4 py-3 font-semibold">Signal Current</th>
                        <th className="px-4 py-3 font-semibold">Tank High</th>
                        <th className="px-4 py-3 font-semibold">อัตราการไหล</th>
                        <th className="px-4 py-3 font-semibold">เวลาบันทึก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {currentRecords.map((record, index) => {
                        const levelValue = typeof record.level === "string" ? parseFloat(record.level) : record.level || 0;
                        // π × r² × level(cm) / 1000 = π × 900 × level / 1000 = π × 0.9 × level (liters)
                        const volumeLiters = Math.PI * 0.9 * levelValue;

                        return (
                          <tr key={startIndex + index} className="transition hover:bg-brand/5">
                            <td className="px-4 py-3 text-ink">{startIndex + index + 1}</td>
                            <td className="px-4 py-3 text-ink">{volumeLiters.toFixed(2)} L</td>
                            <td className="px-4 py-3 text-ink">
                              {typeof record.percent === "number" ? `${record.percent.toFixed(2)}%` : record.percent}
                            </td>
                            <td className="px-4 py-3 text-ink-muted">{record.Signal_Low}</td>
                            <td className="px-4 py-3 text-ink-muted">{record.Signal_High}</td>
                            <td className="px-4 py-3 text-ink-muted">
                              {typeof record.Signal_current === "number"
                                ? record.Signal_current.toFixed(3)
                                : typeof record.Signal_current === "string" && !isNaN(Number(record.Signal_current))
                                  ? Number(record.Signal_current).toFixed(3)
                                  : record.Signal_current}
                            </td>
                            <td className="px-4 py-3 text-ink-muted">{record.Tank_High}</td>
                            <td className="px-4 py-3 text-ink-muted">{record.flowrate}</td>
                            <td className="px-4 py-3 text-ink-muted">{record.TimeStamp}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Always show */}
                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <p className="text-sm text-ink-muted">
                    แสดง {startIndex + 1} - {Math.min(endIndex, records.length)} จาก {records.length} รายการ
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-border/70 px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-brand/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      ก่อนหน้า
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => goToPage(pageNum)}
                            className={cn(
                              "h-8 w-8 rounded-lg text-sm font-medium transition",
                              currentPage === pageNum ? "bg-brand text-brand-foreground" : "text-ink-muted hover:bg-brand/10 hover:text-ink",
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-border/70 px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-brand/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ถัดไป
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </Panel>

          {/* Tank Gauges Panel - at the bottom */}
          <Panel>
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold text-ink">สถานะถังเก็บ (Real-time Tank Status)</h2>
            </div>

            {!loading && !error && records.length > 0 && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {records.map((record, index) => {
                  const levelValue = typeof record.level === "string" ? parseFloat(record.level) : record.level || 0;
                  // π × r² × level(cm) / 1000 = π × 900 × level / 1000 = π × 0.9 × level (liters)
                  const volumeLiters = Math.PI * 0.9 * levelValue;
                  const MAX_CAPACITY_LITERS = 254;
                  const fillPercent = (volumeLiters / MAX_CAPACITY_LITERS) * 100;

                  return (
                    <div
                      key={`gauge-${index}`}
                      className="flex flex-col items-center rounded-2xl border border-border/50 bg-surface/50 p-6 shadow-sm"
                    >
                      <TankGauge percent={fillPercent} displayValue={volumeLiters} unit="L" width={160} height={300} label={`Tank ${index + 1}`} />
                      <p className="mt-4 text-center font-display text-base font-semibold text-ink">Tank {index + 1}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </main>
      </div>
    </div>
  );
}
