# Rastreo GPS en tiempo real · SolyLitio

Aplicación web que muestra en un mapa la ubicación en tiempo real de baterías, con un listado lateral de los dispositivos. Desarrollada con React + Vite + TypeScript y Leaflet (OpenStreetMap).

## Lo que se lleva hecho

- **Mapa interactivo** con Leaflet + OpenStreetMap: un marcador por batería (verde = en línea, gris = desconectado) y leyenda del estado.
- **Panel lateral izquierdo**:
  - Cabecera verde `#2a6b2c` con el logo y el título "Rastreo GPS".
  - Zona de listado en blanco: contadores (total / en línea / offline), buscador y tarjetas de batería con estado, nivel de batería, coordenadas y hora de la última actualización.
- **Selección bidireccional**: clic en el listado → el mapa hace `flyTo` al marcador y lo resalta; clic en un marcador → lo selecciona en el listado; clic en el mapa vacío → deselecciona.
- **Simulación en tiempo real**: las baterías se mueven y actualizan su batería y estado cada 2 segundos (los dispositivos en línea se desplazan; ocasionalmente cambian de estado). Ubicación de ejemplo centrada en **Puebla, México**.
- **Diseño responsive**: en pantallas pequeñas el panel se desliza y aparece un botón para abrirlo/cerrarlo.

## Stack

- React 19 + Vite 8 + TypeScript
- [react-leaflet](https://react-leaflet.js.org/) 5 + [Leaflet](https://leafletjs.com/) 1.9
- Oxlint para linting

## Modelo de datos

```ts
interface Device {
  id: string
  name: string
  online: boolean
  lat: number
  lng: number
  battery: number
  lastUpdate: number
}
```

## Estructura de archivos

```
src/
  main.tsx
  App.tsx                  # layout: sidebar + mapa
  App.css                  # estilos del layout y del listado
  index.css                # estilos globales
  types.ts                 # interfaz Device
  hooks/
    useDevices.ts          # simulación de datos en tiempo real
  components/
    DeviceList.tsx         # resumen + buscador + listado
    DeviceListItem.tsx     # tarjeta de cada batería
    DeviceMap.tsx          # contenedor del mapa (Leaflet)
    DeviceMarker.tsx       # marcador individual
    StatusBadge.tsx        # indicador en línea / desconectado
  utils/
    icons.ts               # icono SVG de los marcadores según estado
```

## Cómo ejecutar

Requisitos: Node.js 18+ (probado con v24).

```sh
npm install
npm run dev        # entorno de desarrollo (HMR)
npm run build      # compilación y verificación de tipos (tsc -b && vite build)
npm run lint       # lint con Oxlint
npm run preview    # sirve la build de producción
```

> **Importante (Windows/PowerShell):** si `npm` falla por la política de ejecución de scripts, usa `npm.cmd` (p. ej. `npm.cmd run dev`) o habilítala con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Conectando el backend real (futuro)

Los datos actuales son simulados. Para conectar un backend real solo hay que reemplazar la implementación de `src/hooks/useDevices.ts` (p. ej. por WebSocket o MQTT), manteniendo el contrato de la interfaz `Device`; el resto de la aplicación queda igual.