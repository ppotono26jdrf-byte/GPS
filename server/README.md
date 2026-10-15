# Rastreo GPS - API Backend

API REST + WebSocket para el seguimiento en tiempo real de baterías, construida con [FastAPI](https://fastapi.tiangolo.com/).

## Estructura

```
server/
  app/
    main.py           # Aplicación FastAPI + CORS + tareas en segundo plano
    config.py         # Configuración (.env)
    routers/
      devices.py      # Endpoints REST GET /devices, GET /devices/{id}
      ws_devices.py    # WebSocket /ws/devices (snapshot + updates)
      positions.py    # POST /api/positions (tracker Arduino GPRS)
    schemas/
      device.py       # Modelo Pydantic Device (coincide con frontend)
    services/
      simulator.py     # Simulador en memoria (movimiento + batería + online/offline)
  .env.example
  requirements.txt
  README.md
```

## Modelo de datos

Coincide exactamente con el `Device` del frontend:

```json
{
  "id": "dev-01",
  "name": "Bateria 01",
  "online": true,
  "lat": 19.0414,
  "lng": -98.2063,
  "battery": 92.0,
  "lastUpdate": 1750000000000
}
```

## Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Health check. Respuesta: `{"status":"ok"}` |
| `GET` | `/devices` | Lista todos los dispositivos. |
| `GET` | `/devices/{device_id}` | Obtiene un dispositivo. 404 si no existe. |
| `POST` | `/api/positions` | Recibe posición del tracker Arduino (requiere `Authorization: Bearer <token>`). |

## WebSocket

**Ruta:** `ws://127.0.0.1:8000/ws/devices`

Mensajes (JSON):

- **Snapshot inicial** (al conectar):
  ```json
  {"type": "snapshot", "ts": 1750000000000, "devices": [...]}
  ```

- **Update periódico** (cada ~2s):
  ```json
  {"type": "update", "ts": 1750000002000, "devices": [...]}
  ```

- **Ping** (heartbeat, cada ~30s):
  ```json
  {"type": "ping", "ts": 1750000004000}
  ```

Solo lectura. Broadcast a todas las conexiones activas.

## Instalación y ejecución

### 1. Instalar dependencias

```bash
cd server
pip install -r requirements.txt
```

### 2. Variables de entorno (opcional)

Copiar `.env.example` a `.env` y ajustar:

```bash
cp .env.example .env
```

Valores por defecto:
- `HOST=127.0.0.1`
- `PORT=8000`
- `CORS_ORIGINS=http://localhost:5173`
- `TICK_MS=2000`
- `DEVICE_API_TOKEN=cambiar_por_un_token_seguro`

### 3. Ejecutar en desarrollo (con recarga automática)

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Abrir documentación

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health: [http://localhost:8000/health](http://localhost:8000/health)
- Dispositivos: [http://localhost:8000/devices](http://localhost:8000/devices)

## Tracker Arduino (GPRS / HTTP POST)

El tracker (`ArduinoGPS/ArduinoGPS/tracker-code_onlygps.ino`) envía posiciones mediante `POST` a `/api/positions`.

**Payload esperado (JSON):**
```json
{
  "device_id": "tracker_01",
  "lat": 19.0414,
  "lng": -98.2063,
  "ts": "2026-10-15 09:12:34",
  "sats": 8,
  "speed_kmh": 45.20,
  "alt_m": 2200.50
}
```

**Autenticación:** header `Authorization: Bearer <DEVICE_API_TOKEN>`. El token debe coincidir con `.env`.

**Transformación a `Device`:**
| Arduino | `Device` backend |
|---------|------------------|
| `device_id` | `id` y `name` (nombre visible) |
| `lat`, `lng` | `lat`, `lng` |
| `ts` ("YYYY-MM-DD HH:MM:SS") | `lastUpdate` (epoch ms) |
| *(no enviado)* | `online = true` |
| *(no enviado)* | `battery = 100.0` (por defecto) |
| `sats`, `speed_kmh`, `alt_m` | ignorados (metadatos futuros) |

**Para pruebas con ngrok / Cloudflare:**
1. Expón tu backend local: `ngrok http 8000` (o Cloudflare Tunnel).
2. Copia la URL pública, ej. `https://abc123.ngrok-free.app`.
3. En el Arduino: `serverUrl = "https://abc123.ngrok-free.app/api/positions"`.
4. En el Arduino y `.env`: mismo `authToken`.

## Simulador

- Centro: **Puebla, México** (19.0414, -98.2063)
- Dispositivos: `Bateria 01–08` (coinciden con el frontend)
- Solo los dispositivos `online` se desplazan (drift ~0.0016)
- Batería disminuye gradualmente (máx 0)
- Cambio online/offline ocasional (~2 % por tick)
- Los dispositivos reportados por el tracker Arduino (`source="arduino_gprs"`) **no son tocados** por el simulador: se conservan hasta que el Arduino los actualice nuevamente.
- Estado en memoria (sin persistencia)

## Integración con frontend

El frontend puede consumir esta API de dos formas:
1. **REST inicial**: `GET http://localhost:8000/devices` para obtener el snapshot inicial.
2. **WebSocket en tiempo real**: `ws://localhost:8000/ws/devices` para recibir `snapshot` y `update` cada 2s.

CORS está configurado para permitir `http://localhost:5173` (Vite dev server).
