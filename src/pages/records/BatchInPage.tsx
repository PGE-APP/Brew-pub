import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { ChevronLeft, ChevronRight, Download, ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { Panel } from "../../components/ui/panel";
import { cn } from "../../lib/utils";

import { formatDate } from "../../utils/dateUtils";

type RecordData = {
  // Existing fields that might still be useful or present
  level?: string | number;
  percent?: number;
  Signal_Low?: number;
  Signal_High?: number;
  Signal_current?: string | number;
  Tank_High?: string | number;
  flowrate?: string;
  TimeStamp?: string;

  // New fields based on requested columns
  Order?: string;
  Order_date?: string;
  Tank_name?: string;
  Datatime_start?: string;
  Data_time_stop?: string;
  Order_number?: string | number;
  Volume?: string | number;
  Station?: string;

  // Allow flexible access
  [key: string]: any;
};

const ITEMS_PER_PAGE = 10;

export function BatchInPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const isFirstLoad = useRef(true);
  const lastDataStr = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        setCountdown(15);

        if (!document.hidden) {
          timerRef.current = setTimeout(fetchData, 15000);
        }
      }
    };

    fetchData();

    const updateCountdown = () => {
      setCountdown((prev) => {
        if (prev > 0) return prev - 1;
        return 15;
      });
      countdownTimerRef.current = setTimeout(updateCountdown, 1000);
    };
    countdownTimerRef.current = setTimeout(updateCountdown, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      } else {
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
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = records.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getExportData = () => {
    return records.map((record, index) => {
      return {
        ลำดับ: index + 1,
        Order: record.TimeStamp ? `TL${(index + 1).toString().padStart(3, "0")} ${formatDate(record.TimeStamp)}` : "-",
        "Order date": record.Order_date ? formatDate(record.Order_date) : "-",
        "Tank name": record.Tank_name ?? "-",
        "Datatime start": record.Datatime_start ? formatDate(record.Datatime_start) : "-",
        "Data time stop": record.Data_time_stop ? formatDate(record.Data_time_stop) : "-",
        "Tank High": record.Tank_High ?? "-",
        "Level (cm)": (() => {
          const val = record.Level ?? record.level;
          if (val === null || val === undefined) return "-";
          const num = typeof val === "string" ? parseFloat(val) : val;
          return isNaN(num) ? val : num;
        })(),
        "Order number": index + 1,
        "Volume (L)": (() => {
          const val = record.Level ?? record.level;
          if (val === null || val === undefined) return "-";
          const num = typeof val === "string" ? parseFloat(val) : val;
          if (isNaN(num)) return record.Volume ?? "-";
          return `${(num * 0.9 * Math.PI).toFixed(2)}`;
        })(),
        Station: record.Station ?? "-",
      };
    });
  };

  const handleExport = (format: "xlsx" | "csv") => {
    if (records.length === 0) return;

    const exportData = getExportData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch In Records");

    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `Batch_In_Records_${dateStr}.${format}`;

    // Write file
    XLSX.writeFile(workbook, fileName, { bookType: format });
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} role="presentation" />
      ) : null}

      <div className={cn("min-h-screen transition-[margin] duration-300", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
        <Topbar title="บันทึก Batch In" onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: "รายการ" }, { label: "Batch_In" }]} />

          <Panel>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Batch_In</h2>
              <div className="flex flex-wrap items-center gap-3">
                {records.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Export
                      <ChevronDown className={cn("h-3 w-3 opacity-80 transition-transform duration-200", showExportMenu && "rotate-180")} />
                    </button>

                    {/* Inline style for animation */}
                    <style>{`
                      @keyframes scale-in {
                        from { opacity: 0; transform: scale(0.95) translateY(-5px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                      }
                    `}</style>

                    {showExportMenu && (
                      <>
                        {/* Overlay to close menu when clicking outside */}
                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowExportMenu(false)} />
                        {/* Dropdown Menu with Animation */}
                        <div
                          className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-lg ring-1 ring-black/5"
                          style={{ animation: "scale-in 0.15s ease-out forwards", transformOrigin: "top right" }}
                        >
                          <button
                            onClick={() => handleExport("xlsx")}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink hover:bg-brand/5 hover:text-brand transition-colors"
                          >
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            Excel (.xlsx)
                          </button>
                          <button
                            onClick={() => handleExport("csv")}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink hover:bg-brand/5 hover:text-brand transition-colors"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                            CSV (.csv)
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-brand/5 px-2 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <p className="text-xs text-ink-muted">
                    อัปเดตอัตโนมัติใน
                    <span className="inline-block w-5 text-center font-mono font-medium text-brand">{countdown}</span>
                    วินาที
                  </p>
                </div>
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
                        <th className="px-4 py-3 font-semibold">Order</th>
                        <th className="px-4 py-3 font-semibold">Order date</th>
                        <th className="px-4 py-3 font-semibold">Tank name</th>
                        <th className="px-4 py-3 font-semibold">Datatime start</th>
                        <th className="px-4 py-3 font-semibold">Data time stop</th>
                        <th className="px-4 py-3 font-semibold">Tank High</th>
                        <th className="px-4 py-3 font-semibold">Level (cm)</th>
                        <th className="px-4 py-3 font-semibold">Order number</th>
                        <th className="px-4 py-3 font-semibold">Volume (L)</th>
                        <th className="px-4 py-3 font-semibold">Station</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {currentRecords.map((record, index) => {
                        return (
                          <tr key={startIndex + index} className="transition hover:bg-brand/5">
                            <td className="px-4 py-3 text-ink">{startIndex + index + 1}</td>
                            <td className="px-4 py-3 text-ink">
                              {record.TimeStamp ? `TL${(startIndex + index + 1).toString().padStart(3, "0")} ${formatDate(record.TimeStamp)}` : "-"}
                            </td>
                            <td className="px-4 py-3 text-ink">{record.Order_date ? formatDate(record.Order_date) : "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Tank_name ?? "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Datatime_start ? formatDate(record.Datatime_start) : "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Data_time_stop ? formatDate(record.Data_time_stop) : "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Tank_High ?? "-"}</td>
                            <td className="px-4 py-3 text-ink">
                              {(() => {
                                const val = record.Level ?? record.level;
                                if (val === null || val === undefined) return "-";
                                const num = typeof val === "string" ? parseFloat(val) : val;
                                if (isNaN(num)) return val;
                                // Display raw Level
                                return num;
                              })()}
                            </td>
                            <td className="px-4 py-3 text-ink">{startIndex + index + 1}</td>
                            <td className="px-4 py-3 text-ink">
                              {(() => {
                                const val = record.Level ?? record.level;
                                if (val === null || val === undefined) return "-";
                                const num = typeof val === "string" ? parseFloat(val) : val;
                                if (isNaN(num)) return record.Volume ?? "-";
                                // Convert cm to Liters: π * 0.9 * level
                                // Use calculated volume instead of record.Volume
                                return `${(num * 0.9 * Math.PI).toFixed(2)} `;
                              })()}
                            </td>
                            <td className="px-4 py-3 text-ink">{record.Station ?? "-"}</td>
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
        </main>
      </div>
    </div>
  );
}
