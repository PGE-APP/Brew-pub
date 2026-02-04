import { MapPin } from 'lucide-react'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Panel } from '../../ui/panel'
import { cn } from '../../../lib/utils'

/**
 * Builds a Lucide-based Leaflet marker icon to keep iconography consistent.
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
    id: 'north',
    label: 'จุดตรวจ 01',
    position: [16.4, 99.9] as [number, number],
    icon: createMarkerIcon('text-brand'),
  },
  {
    id: 'central',
    label: 'จุดตรวจ 02',
    position: [13.7, 100.5] as [number, number],
    icon: createMarkerIcon('text-accent'),
  },
  {
    id: 'east',
    label: 'จุดตรวจ 03',
    position: [15.2, 104.8] as [number, number],
    icon: createMarkerIcon('text-success'),
  },
  {
    id: 'south',
    label: 'จุดตรวจ 04',
    position: [8.2, 98.3] as [number, number],
    icon: createMarkerIcon('text-warning'),
  },
]

export type MapPanelProps = {
  className?: string
}

/**
 * Free OpenStreetMap view with location markers.
 */
export function MapPanel({ className }: MapPanelProps) {
  return (
    <Panel className={cn('space-y-4', className)}>
      <div>
        <p className="text-sm font-semibold text-ink">แผนที่จุดตรวจ</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60">
        <MapContainer
          center={[13.7, 100.5]}
          zoom={5}
          className="h-64 w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position} icon={marker.icon}>
              <Popup>{marker.label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Panel>
  )
}
