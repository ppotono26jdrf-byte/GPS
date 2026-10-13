# Rastreo GPS en tiempo real



Aplicación web que muestra en un mapa la ubicación en tiempo real de baterías, con un listado lateral de los dispositivos. Desarrollada con React + Vite + TypeScript y Leaflet (OpenStreetMap).



## Lo que se lleva hecho



- **Mapa interactivo** con Leaflet + OpenStreetMap: un marcador por baterÃ­a (verde = en lÃ­nea, gris = desconectado) y leyenda del estado.

- **Panel lateral izquierdo**:

  - Cabecera verde `#2a6b2c` con el logo y el tí­tulo "Rastreo GPS".

  - Zona de listado en blanco: contadores (total / en lí­nea / offline), buscador y tarjetas de batería con estado, nivel de baterí­a, coordenadas y hora de la última actualización.

- **Selección bidireccional**: clic en el listado, el mapa hace `flyTo` al marcador y lo resalta; clic en un marcador, lo selecciona en el listado; clic en el mapa vacío lo deselecciona.

- **Simulación en tiempo real**: las baterí­as se mueven y actualizan su batería y estado cada 2 segundos (los dispositivos en línea se desplazan; ocasionalmente cambian de estado). Ubicación de ejemplo centrada en **Puebla, México**.

- **Diseño responsivo**: en pantallas pequeñas el panel se desliza y aparece un botón para abrirlo/cerrarlo.



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

```

## Cómo ejecutar ambos

### 1) Backend (FastAPI)
`bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
`
Swagger: http://localhost:8000/docs | Health: http://localhost:8000/health | Dispositivos: http://localhost:8000/devices

### 2) Frontend (React + Vite)
`bash
npm.cmd run dev  # http://localhost:5173
`
Variables opcionales: VITE_API_URL (http://localhost:8000). El hook construye el WS automáticamente.

> Nota: en Windows PowerShell usa 
pm.cmd (la política de ejecución bloquea 
pm).