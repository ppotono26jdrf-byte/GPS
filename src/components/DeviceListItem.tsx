import type { Device } from '../types'
import StatusBadge from './StatusBadge'

interface DeviceListItemProps {
  device: Device
  selected: boolean
  onSelect: (id: string) => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function DeviceListItem({ device, selected, onSelect }: DeviceListItemProps) {
  return (
    <button
      type="button"
      className={`device-item ${selected ? 'is-selected' : ''} ${device.online ? '' : 'is-offline'}`}
      onClick={() => onSelect(device.id)}
      aria-pressed={selected}
    >
      <div className="device-item__top">
        <span className="device-item__name">{device.name}</span>
        <StatusBadge online={device.online} />
      </div>

      <div className="device-item__meta">
        <span className="device-item__coords">
          {device.lat.toFixed(5)}, {device.lng.toFixed(5)}
        </span>
        <span className="device-item__battery">
          <span className="device-item__battery-bar">
            <span
              className="device-item__battery-fill"
              style={{ width: `${Math.round(device.battery)}%` }}
            />
          </span>
          {Math.round(device.battery)}%
        </span>
      </div>

      <span className="device-item__time">Actualizado {formatTime(device.lastUpdate)}</span>
    </button>
  )
}

export default DeviceListItem
