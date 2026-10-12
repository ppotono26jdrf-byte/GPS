import { useEffect, useState } from 'react'
import type { Device } from '../types'

const CENTER = { lat: 19.0414, lng: -98.2063 }

const INITIAL_DEVICES: Device[] = [
  { id: 'dev-01', name: 'Bateria 01', online: true, lat: 19.0414, lng: -98.2063, battery: 92, lastUpdate: Date.now() },
  { id: 'dev-02', name: 'Bateria 02', online: true, lat: 19.0477, lng: -98.213, battery: 78, lastUpdate: Date.now() },
  { id: 'dev-03', name: 'Bateria 03', online: true, lat: 19.0344, lng: -98.1947, battery: 64, lastUpdate: Date.now() },
  { id: 'dev-04', name: 'Bateria 04', online: false, lat: 19.0561, lng: -98.2036, battery: 35, lastUpdate: Date.now() },
  { id: 'dev-05', name: 'Bateria 05', online: true, lat: 19.0288, lng: -98.2171, battery: 88, lastUpdate: Date.now() },
  { id: 'dev-06', name: 'Bateria 06', online: true, lat: 19.0445, lng: -98.1914, battery: 51, lastUpdate: Date.now() },
  { id: 'dev-07', name: 'Bateria 07', online: false, lat: 19.0523, lng: -98.2217, battery: 12, lastUpdate: Date.now() },
  { id: 'dev-08', name: 'Bateria 08', online: true, lat: 19.0358, lng: -98.2076, battery: 73, lastUpdate: Date.now() },
]

function drift(max: number) {
  return (Math.random() - 0.5) * max
}

function nextState(device: Device): Device {
  const online = Math.random() < 0.02 ? !device.online : device.online

  if (!online) {
    return { ...device, online }
  }

  return {
    ...device,
    online,
    lat: device.lat + drift(0.0016),
    lng: device.lng + drift(0.0016),
    battery: Math.max(0, device.battery - Math.random() * 0.4),
    lastUpdate: Date.now(),
  }
}

export function useDevices(intervalMs = 2000): Device[] {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDevices((prev) => prev.map(nextState))
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [intervalMs])

  return devices
}

export { CENTER }
