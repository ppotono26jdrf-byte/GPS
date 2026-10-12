import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import type { Device } from '../types'
import { createDeviceIcon } from '../utils/icons'

interface DeviceMarkerProps {
  device: Device
  selected: boolean
  onSelect: (id: string) => void
}

function DeviceMarker({ device, selected, onSelect }: DeviceMarkerProps) {
  const icon = useMemo(
    () => createDeviceIcon(device.online, selected),
    [device.online, selected],
  )

  const eventHandlers = useMemo(
    () => ({ click: () => onSelect(device.id) }),
    [device.id, onSelect],
  )

  return (
    <Marker position={[device.lat, device.lng]} icon={icon} eventHandlers={eventHandlers}>
      <Popup>
        <div className="device-popup">
          <strong>{device.name}</strong>
          <span className={device.online ? 'is-online' : 'is-offline'}>
            {device.online ? 'En linea' : 'Desconectado'}
          </span>
          <span>Bateria: {Math.round(device.battery)}%</span>
          <span>
            {device.lat.toFixed(5)}, {device.lng.toFixed(5)}
          </span>
        </div>
      </Popup>
    </Marker>
  )
}

export default DeviceMarker
