import { useCallback, useEffect, useRef, useState } from 'react'
import type { Device } from '../types'

export interface UseDevicesWsOptions {
  apiUrl?: string
  wsUrl?: string
  reconnectIntervalMs?: number
  maxReconnectMs?: number
  pollFallbackMs?: number
}

const DEFAULT_API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL

function buildWsUrl(apiUrl: string, wsUrl?: string): string {
  if (wsUrl) return wsUrl
  try {
    const url = new URL(apiUrl)
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${url.host}/ws/devices`
  } catch {
    return 'ws://localhost:8000/ws/devices'
  }
}

export function useDevicesWs(options: UseDevicesWsOptions = {}): Device[] {
  const {
    apiUrl = DEFAULT_API_URL,
    wsUrl = DEFAULT_WS_URL,
    reconnectIntervalMs = 1000,
    maxReconnectMs = 30000,
  } = options

  const [devices, setDevices] = useState<Device[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<number | null>(null)
  const backoffRef = useRef(1000)
  const shouldReconnect = useRef(true)

  const connect = useCallback(() => {
    const doConnect = () => {
      if (!shouldReconnect.current) return
      const target = buildWsUrl(apiUrl, wsUrl)
      const ws = new WebSocket(target)
      wsRef.current = ws

      ws.onopen = () => {
        backoffRef.current = reconnectIntervalMs
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data?.type === 'snapshot' && Array.isArray(data.devices)) {
            setDevices(data.devices as Device[])
            return
          }
          if (data?.type === 'update' && Array.isArray(data.devices)) {
            setDevices(data.devices as Device[])
            return
          }
          if (data?.type === 'ping') {
            return
          }
        } catch {
          // ignore
        }
      }

      ws.onclose = () => {
        if (!shouldReconnect.current) return
        const next = Math.min(backoffRef.current * 2, maxReconnectMs)
        backoffRef.current = next
        reconnectTimeout.current = window.setTimeout(doConnect, next)
      }

      ws.onerror = () => {
        try {
          ws.close()
        } catch {
          // ignore
        }
      }
    }
    doConnect()
  }, [apiUrl, wsUrl, reconnectIntervalMs, maxReconnectMs])

  useEffect(() => {
    shouldReconnect.current = true

    // Initial REST fetch as fallback
    ;(async () => {
      try {
        const res = await fetch(`${apiUrl.replace(/\/$/, '')}/devices`)
        if (res.ok) {
          const list = (await res.json()) as Device[]
          setDevices(list)
        }
      } catch {
        // ignore
      }
    })()

    connect()

    return () => {
      shouldReconnect.current = false
      if (reconnectTimeout.current) {
        window.clearTimeout(reconnectTimeout.current)
        reconnectTimeout.current = null
      }
      if (wsRef.current) {
        try {
          wsRef.current.close()
        } catch {
          // ignore
        }
        wsRef.current = null
      }
    }
  }, [apiUrl, connect])

  return devices
}

export { DEFAULT_API_URL, buildWsUrl }
