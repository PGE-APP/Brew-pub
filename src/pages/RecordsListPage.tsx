import { useEffect, useState } from 'react'
import axios from 'axios'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { Panel } from '../components/ui/panel'
import { cn } from '../lib/utils'

type RecordData = {
  level: string
  percent: number
  Signal_Low: number
  Signal_High: number
  Signal_current: string
  Tank_High: string
  flowrate: string
  TimeStamp: string
}

/**
 * Records list page displaying data from REST API.
 */
export function RecordsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [records, setRecords] = useState<RecordData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://192.168.200.1:1880/restData')
        
        // Handle both single object and array responses
        const recordsArray = Array.isArray(response.data) ? response.data : [response.data]
        setRecords(recordsArray)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        if (axios.isAxiosError(err)) {
          setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Optional: Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

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
          title="รายการข้อมูลจากเซ็นเซอร์"
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="space-y-6 px-6 pb-10 pt-6">
          <Breadcrumbs items={[{ label: 'รายการ' }]} />

          <Panel>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                ข้อมูลการตรวจวัด
              </h2>
              <p className="text-xs text-ink-muted">
                อัปเดตอัตโนมัติทุก 30 วินาที
              </p>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-brand/5 text-xs uppercase tracking-wide text-ink-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">ลำดับ</th>
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
                    {records.map((record, index) => (
                      <tr
                        key={index}
                        className="transition hover:bg-brand/5"
                      >
                        <td className="px-4 py-3 text-ink">
                          {record.level}
                        </td>
                        <td className="px-4 py-3 text-ink">
                          {typeof record.percent === 'number' 
                            ? `${record.percent.toFixed(2)}%` 
                            : record.percent}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                          {typeof record.Signal_Low === 'number'
                            ? record.Signal_Low.toLocaleString()
                            : record.Signal_Low}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                          {typeof record.Signal_High === 'number'
                            ? record.Signal_High.toLocaleString()
                            : record.Signal_High}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                          {record.Signal_current}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {record.Tank_High}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {record.flowrate}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-muted">
                          {record.TimeStamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </main>
      </div>
    </div>
  )
}
