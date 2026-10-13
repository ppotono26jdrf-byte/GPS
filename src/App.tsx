import { useCallback, useState } from 'react'
import './App.css'
import DeviceList from './components/DeviceList'
import DeviceMap from './components/DeviceMap'
import { useDevicesWs } from './hooks/useDevicesWs'
import logo from './assets/Logo_SolyLitio.svg'

function App() {
  const devices = useDevicesWs()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const clearSelection = useCallback(() => setSelectedId(null), [])

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <header className="sidebar__header">
          <div className="sidebar__brand">
            <img src={logo} className="sidebar__logo" alt="Logo_SolyLitio" />
            <div>
              <h1>Rastreo GPS</h1>
              <p>Monitoreo en tiempo real</p>
            </div>
          </div>
          <button
            type="button"
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar panel"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <DeviceList devices={devices} selectedId={selectedId} onSelect={toggleSelect} />
      </aside>

      <main className="map-area">
        <button
          type="button"
          className="map-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir panel de baterias"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <DeviceMap
          devices={devices}
          selectedId={selectedId}
          onSelect={toggleSelect}
          onClear={clearSelection}
        />

        <div className="map-legend">
          <span className="map-legend__item">
            <span className="map-legend__dot is-online" /> En linea
          </span>
          <span className="map-legend__item">
            <span className="map-legend__dot is-offline" /> Desconectado
          </span>
        </div>
      </main>
    </div>
  )
}

export default App
