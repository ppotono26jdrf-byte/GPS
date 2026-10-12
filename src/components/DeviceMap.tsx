import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Device } from '../types'
import { CENTER } from '../hooks/useDevices'
import DeviceMarker from './DeviceMarker'

interface DeviceMapProps {
  devices: Device[]
  selectedId: string | null
  onSelect: (id: string) => void
  onClear: () => void
}

interface MapControllerProps {
  selectedId: string | null
  target: [number, number] | null
}

function MapController({ selectedId, target }: MapControllerProps) {
  const map = useMap()
  const previousId = useRef<string | null>(null)

  useEffect(() => {
    if (target && selectedId && selectedId !== previousId.current) {
      map.flyTo(target, Math.max(map.getZoom(), 14), { duration: 0.8 })
    }
    previousId.current = selectedId
  }, [selectedId, target, map])

  return null
}

function MapClickHandler({ onClear }: { onClear: () => void }) {
  useMapEvents({ click: onClear })
  return null
}

function DeviceMap({ devices, selectedId, onSelect, onClear }: DeviceMapProps) {
  const target = (() => {
    const device = devices.find((item) => item.id === selectedId)
    return device ? ([device.lat, device.lng] as [number, number]) : null
  })()

  return (
    <MapContainer
      center={[CENTER.lat, CENTER.lng]}
      zoom={13}
      className="map"
      zoomControl={false}
      preferCanvas
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedId={selectedId} target={target} />
      <MapClickHandler onClear={onClear} />

      {devices.map((device) => (
        <DeviceMarker
          key={device.id}
          device={device}
          selected={device.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  )
}

export default DeviceMap
