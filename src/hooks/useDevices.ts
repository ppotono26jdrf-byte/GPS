import { useEffect, useState } from 'react'
import type { Device } from '../types'

const CENTER = { lat: 40.4168, lng: -3.7038 }

const INITIAL_DEVICES: Device[] = [
  { id: 'dev-01', name: 'Camion 01', online: true, lat: 40.4168, lng: -3.7038, battery: 92, lastUpdate: Date.now() },
  { id: 'dev-02', name: 'Camion 02', online: true, lat: 40.4231, lng: -3.7105, battery: 78, lastUpdate: Date.now() },
  { id: 'dev-03', name: 'Furgoneta 03', online: true, lat: 40.4098, lng: -3.6922, battery: 64, lastUpdate: Date.now() },
  { id: 'dev-04', name: 'Movil 04', online: false, lat: 40.4315, lng: -3.7011, battery: 35, lastUpdate: Date.now() },
  { id: 'dev-05', name: 'Sensor 05', online: true, lat: 40.4042, lng: -3.7146, battery: 88, lastUpdate: Date.now() },
  { id: 'dev-06', name: 'Movil 06', online: true, lat: 40.4199, lng: -3.6889, battery: 51, lastUpdate: Date.now() },
  { id: 'dev-07', name: 'Sensor 07', online: false, lat: 40.4277, lng: -3.7192, battery: 12, lastUpdate: Date.now() },
  { id: 'dev-08', name: 'Furgoneta 08', online: true, lat: 40.4112, lng: -3.7051, battery: 73, lastUpdate: Date.now() },
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
