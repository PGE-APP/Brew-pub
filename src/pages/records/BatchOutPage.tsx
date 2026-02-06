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

// Helper to calculate Volume from record
const getCalculatedVolume = (record: RecordData): number => {
  let volume = 0;
  // Try calculating from Level first: Volume = Level * 0.9 * PI
  const val = record.Level ?? record.level;
  if (val !== null && val !== undefined) {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (!isNaN(num)) {
      volume = num * 0.9 * Math.PI;
    }
  }

  // Fallback to existing Volume field if calculation yielded 0 but Volume exists
  if (volume === 0 && record.Volume) {
    const v = typeof record.Volume === "string" ? parseFloat(record.Volume) : record.Volume;
    if (!isNaN(v)) volume = v;
  }

  return volume;
};

export function BatchOutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // liveRecords stores the latest data fetched from the API (monitoring current state)
  const [liveRecords, setLiveRecords] = useState<RecordData[]>([]);

  // historyRecords stores the accumulated history from LocalStorage
  const [historyRecords, setHistoryRecords] = useState<RecordData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const isFirstLoad = useRef(true);
  const lastDataStr = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize history from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("batch_out_records");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          // Sort by timestamp descending (newest first)
          const sorted = parsed.sort((a, b) => {
            const tA = a.Data_time_stop || a.TimeStamp || "";
            const tB = b.Data_time_stop || b.TimeStamp || "";
            return tB.localeCompare(tA);
          });
          setHistoryRecords(sorted);
        }
      } catch (err) {
        console.error("Error parsing localStorage batch_out_records:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (document.hidden) return;

      try {
        if (isFirstLoad.current) setLoading(true);

        const response = await axios.get("http://192.168.1.120:1880/restData");
        const recordsArray = Array.isArray(response.data) ? response.data : [response.data];

        // Update live records
        const currentDataStr = JSON.stringify(recordsArray);
        if (currentDataStr !== lastDataStr.current) {
          setLiveRecords(recordsArray);
          lastDataStr.current = currentDataStr;

          // LOGIC: Check for completed batches and save to LocalStorage

          setHistoryRecords((prevHistory) => {
            const newHistory = [...prevHistory];
            let changed = false;

            // Important: Sort incoming records by time ascending (Oldest -> Newest)
            // This ensures we process the sequence of events correctly against the "Last Saved" state.
            const sortedIncoming = [...recordsArray].sort((a, b) => {
              const tA = a.Data_time_stop || a.TimeStamp || "";
              const tB = b.Data_time_stop || b.TimeStamp || "";
              return tA.localeCompare(tB);
            });

            sortedIncoming.forEach((record) => {
              // Identification Key
              const key = record.Data_time_stop || record.TimeStamp;
              if (!key) return;

              // Calculate Volume
              const volume = getCalculatedVolume(record);

              // VALIDATION 1: Must be > 0.01 (valid reading)
              if (volume <= 0.01) return;

              // Check if already exists (by ID)
              const exists = newHistory.some((h) => (h.Data_time_stop || h.TimeStamp) === key);
              if (exists) return;

              // VALIDATION 2: Decreasing Volume Logic (Strictly less than previous)
              // Check against the LATEST saved record (which is at index 0 because we unshift)
              if (newHistory.length > 0) {
                const lastSavedRecord = newHistory[0];
                const lastVolume = getCalculatedVolume(lastSavedRecord);

                // User Requirement:
                // If Current Volume < Last Volume -> Save
                // If Current Volume >= Last Volume -> Do NOT Save
                if (volume >= lastVolume) {
                  return; // Skip this record, volume increased or stayed same
                }
              }

              // If passed all checks:
              newHistory.unshift(record); // Add to top
              changed = true;
            });

            if (changed) {
              // Ensure sorted Newest First
              newHistory.sort((a, b) => {
                const tA = a.Data_time_stop || a.TimeStamp || "";
                const tB = b.Data_time_stop || b.TimeStamp || "";
                return tB.localeCompare(tA);
              });

              localStorage.setItem("batch_out_records", JSON.stringify(newHistory));
              return newHistory;
            }
            return prevHistory;
          });
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
          timerRef.current = setTimeout(fetchData, 15000); // 15s refresh
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

  // Pagination for HISTORY records
  const totalPages = Math.ceil(historyRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = historyRecords.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleExport = (format: "xlsx" | "csv") => {
    if (historyRecords.length === 0) return;

    // Prepare data for export
    const exportData = historyRecords.map((record, index) => {
      // Calculate row number correctly relative to the entire dataset (descending)
      const rowNumber = historyRecords.length - index;

      return {
        ลำดับ: rowNumber,
        Order: record.TimeStamp ? `TL${rowNumber.toString().padStart(3, "0")} ${formatDate(record.TimeStamp)}` : "-",
        "Order date": record.Order_date ? formatDate(record.Order_date) : "-",
        "Tank name": record.Tank_name ?? "-",
        "Tank High": record.Tank_High ?? "-",
        "Level (cm)": (() => {
          const val = record.Level ?? record.level;
          if (val === null || val === undefined) return "-";
          const num = typeof val === "string" ? parseFloat(val) : val;
          return isNaN(num) ? val : num;
        })(),
        "Signal Low": record.Signal_Low ?? "-",
        "Signal High": record.Signal_High ?? "-",
        Current: typeof record.Signal_current === "number" ? record.Signal_current.toFixed(3) : (record.Signal_current ?? "-"),
        "Order number": rowNumber,
        "Volume (L)": (() => {
          const v = getCalculatedVolume(record);
          return v > 0 ? v.toFixed(2) : "-";
        })(),
        Station: record.Station ?? "-",
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Out Records");

    // Generate filename
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `Batch_Out_History_${dateStr}.${format}`;

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
        <Topbar title="บันทึก Batch Out" onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: "รายการ" }, { label: "Batch_Out" }]} />

          <Panel>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Batch_Out (ประวัติการจ่ายน้ำ)</h2>
              <div className="flex flex-wrap items-center gap-3">
                {historyRecords.length > 0 && (
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

            {loading && historyRecords.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                <p className="ml-3 text-ink-muted">กำลังโหลดข้อมูล...</p>
              </div>
            )}

            {error && historyRecords.length === 0 && (
              <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-warning">
                <p className="font-semibold">⚠️ ไม่สามารถโหลดข้อมูลได้</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            )}

            {!loading && !error && historyRecords.length === 0 && (
              <div className="py-12 text-center text-ink-muted">
                <p>ไม่พบประวัติ Batch Out</p>
                <p className="text-xs mt-2">ข้อมูลจะถูกบันทึกเมื่อมีการจ่ายน้ำ (Volume ลดลง)</p>
              </div>
            )}

            {historyRecords.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-brand/5 text-xs uppercase tracking-wide text-ink-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ลำดับ</th>
                        <th className="px-4 py-3 font-semibold">Order</th>
                        <th className="px-4 py-3 font-semibold">Order date</th>
                        <th className="px-4 py-3 font-semibold">Tank name</th>
                        <th className="px-4 py-3 font-semibold">Tank High</th>
                        <th className="px-4 py-3 font-semibold">Level (cm)</th>
                        <th className="px-4 py-3 font-semibold">Signal Low</th>
                        <th className="px-4 py-3 font-semibold">Signal High</th>
                        <th className="px-4 py-3 font-semibold">Current</th>
                        <th className="px-4 py-3 font-semibold">Order number</th>
                        <th className="px-4 py-3 font-semibold">Volume (L)</th>
                        <th className="px-4 py-3 font-semibold">Station</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {currentRecords.map((record, index) => {
                        const rowNumber = historyRecords.length - (startIndex + index);
                        return (
                          <tr key={index} className="transition hover:bg-brand/5">
                            <td className="px-4 py-3 text-ink">{rowNumber}</td>
                            <td className="px-4 py-3 text-ink">
                              {record.TimeStamp ? `TL${rowNumber.toString().padStart(3, "0")} ${formatDate(record.TimeStamp)}` : "-"}
                            </td>
                            <td className="px-4 py-3 text-ink">{record.Order_date ? formatDate(record.Order_date) : "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Tank_name ?? "-"}</td>
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
                            <td className="px-4 py-3 text-ink">{record.Signal_Low ?? "-"}</td>
                            <td className="px-4 py-3 text-ink">{record.Signal_High ?? "-"}</td>
                            <td className="px-4 py-3 text-ink">
                              {typeof record.Signal_current === "number"
                                ? record.Signal_current.toFixed(3)
                                : typeof record.Signal_current === "string" && !isNaN(Number(record.Signal_current))
                                  ? Number(record.Signal_current).toFixed(3)
                                  : (record.Signal_current ?? "-")}
                            </td>
                            <td className="px-4 py-3 text-ink">{rowNumber}</td>
                            <td className="px-4 py-3 text-ink">
                              {(() => {
                                const v = getCalculatedVolume(record);
                                return v > 0 ? v.toFixed(2) : "-";
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
                    แสดง {startIndex + 1} - {Math.min(endIndex, historyRecords.length)} จาก {historyRecords.length} รายการ
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
