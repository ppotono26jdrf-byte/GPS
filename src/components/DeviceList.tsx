import { useMemo, useState } from 'react'
import type { Device } from '../types'
import DeviceListItem from './DeviceListItem'

interface DeviceListProps {
  devices: Device[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function DeviceList({ devices, selectedId, onSelect }: DeviceListProps) {
  const [query, setQuery] = useState('')

  const onlineCount = useMemo(
    () => devices.filter((device) => device.online).length,
    [devices],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return devices
    return devices.filter((device) => device.name.toLowerCase().includes(term))
  }, [devices, query])

  return (
    <>
      <div className="sidebar__summary">
        <div className="summary-stat">
          <span className="summary-stat__value">{devices.length}</span>
          <span className="summary-stat__label">Dispositivos</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__value is-online">{onlineCount}</span>
          <span className="summary-stat__label">En linea</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__value is-offline">{devices.length - onlineCount}</span>
          <span className="summary-stat__label">Offline</span>
        </div>
      </div>

      <div className="sidebar__search">
        <input
          type="search"
          placeholder="Buscar dispositivo..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="device-list">
        {filtered.map((device) => (
          <DeviceListItem
            key={device.id}
            device={device}
            selected={device.id === selectedId}
            onSelect={onSelect}
          />
        ))}

        {filtered.length === 0 && (
          <p className="device-list__empty">Sin resultados</p>
        )}
      </div>
    </>
  )
}

export default DeviceList
