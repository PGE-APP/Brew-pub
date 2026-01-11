import { FileDown, FileSpreadsheet, MapPin, Search } from 'lucide-react'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

/**
 * Creates a Leaflet marker using Lucide icons for status colors.
 */
const createMarkerIcon = (className: string) =>
  L.divIcon({
    className: 'map-pin-icon',
    html: renderToStaticMarkup(
      <div className={`drop-shadow-lg ${className}`}>
        <MapPin className="h-6 w-6" fill="currentColor" strokeWidth={1.5} />
      </div>,
    ),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })

const markers = [
  {
    id: 'A1',
    position: [13.8, 100.5] as [number, number],
    icon: createMarkerIcon('text-success'),
  },
  {
    id: 'A2',
    position: [14.5, 100.9] as [number, number],
    icon: createMarkerIcon('text-accent'),
  },
  {
    id: 'A3',
    position: [13.2, 100.2] as [number, number],
    icon: createMarkerIcon('text-warning'),
  },
  {
    id: 'A4',
    position: [15.1, 100.4] as [number, number],
    icon: createMarkerIcon('text-success'),
  },
]

const rows = [
  {
    tank: 'A1',
    volume: '8,360.78',
    expire: '01-09-68',
    owner: 'สมใจ อยาก',
  },
  {
    tank: 'A2',
    volume: '4,460.28',
    expire: '20-05-68',
    owner: 'จัสติน บีบอย',
  },
  {
    tank: 'A3',
    volume: '6,068.38',
    expire: '15-06-68',
    owner: 'แดง น้ำเงิน',
  },
]

export type OperationsPanelProps = {
  className?: string
}

/**
 * Operations map with table and export actions.
 */
export function OperationsPanel({ className }: OperationsPanelProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">แผนที่และการดำเนินงาน</p>
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/80 px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            placeholder="ค้นหา"
            className="w-32 bg-transparent text-sm text-ink outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <MapContainer
              center={[13.8, 100.5]}
              zoom={6}
              className="h-60 w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position} icon={marker.icon} />
              ))}
            </MapContainer>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success" />
              <span className="text-ink">ปกติ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-ink">เตือน</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-ink">มีปัญหา</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-ink-muted">
            <span>ถัง</span>
            <span>ปริมาณเบียร์</span>
            <span>วันหมดอายุ</span>
            <span>ชื่อบัตร</span>
          </div>
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.tank}
                className="grid grid-cols-4 items-center gap-2 rounded-xl border border-border/60 bg-white/70 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-ink">{row.tank}</span>
                <span>{row.volume}</span>
                <span>{row.expire}</span>
                <span>{row.owner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-white/80 px-4 py-2 text-sm font-semibold text-ink"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-white/80 px-4 py-2 text-sm font-semibold text-ink"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </button>
      </div>
    </Panel>
  )
}
