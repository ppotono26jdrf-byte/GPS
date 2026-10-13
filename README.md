# Rastreo GPS en tiempo real Â· SolyLitio
Aplicación web que muestra en un mapa la ubicación en tiempo real de baterías, con un listado lateral de los dispositivos. Desarrollada con React + Vite + TypeScript y Leaflet (OpenStreetMap).


Aplicación web que muestra en un mapa la ubicación en tiempo real de baterías, con un listado lateral de los dispositivos. Desarrollada con React + Vite + TypeScript y Leaflet (OpenStreetMap).



## Lo que se lleva hecho



- **Mapa interactivo** con Leaflet + OpenStreetMap: un marcador por baterÃ­a (verde = en lÃ­nea, gris = desconectado) y leyenda del estado.

- **Panel lateral izquierdo**:

  - Cabecera verde `#2a6b2c` con el logo y el tÃ­tulo "Rastreo GPS".

  - Zona de listado en blanco: contadores (total / en lÃ­nea / offline), buscador y tarjetas de baterÃ­a con estado, nivel de baterÃ­a, coordenadas y hora de la Ãºltima actualizaciÃ³n.

- **SelecciÃ³n bidireccional**: clic en el listado â†’ el mapa hace `flyTo` al marcador y lo resalta; clic en un marcador â†’ lo selecciona en el listado; clic en el mapa vacÃ­o â†’ deselecciona.

- **SimulaciÃ³n en tiempo real**: las baterÃ­as se mueven y actualizan su baterÃ­a y estado cada 2 segundos (los dispositivos en lÃ­nea se desplazan; ocasionalmente cambian de estado). UbicaciÃ³n de ejemplo centrada en **Puebla, MÃ©xico**.

- **DiseÃ±o responsive**: en pantallas pequeÃ±as el panel se desliza y aparece un botÃ³n para abrirlo/cerrarlo.



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



## Arquitectura



```

src/

  main.tsx

  App.tsx                  # layout: sidebar + mapa

  App.css                  # estilos del layout y del listado

  index.css                # estilos globales

  types.ts                 # interfaz Device

  hooks/

    useDevices.ts          # simulaciÃ³n de datos en tiempo real

  components/

## Cómo ejecutar ambos

### 1) Backend (FastAPI)
`ash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
`
Swagger: http://localhost:8000/docs | Health: http://localhost:8000/health | Dispositivos: http://localhost:8000/devices

### 2) Frontend (React + Vite)
`ash
npm.cmd run dev  # http://localhost:5173
`
Variables opcionales: VITE_API_URL (http://localhost:8000). El hook construye el WS automáticamente.

> Nota: en Windows PowerShell usa 
pm.cmd (la política de ejecución bloquea 
pm).






