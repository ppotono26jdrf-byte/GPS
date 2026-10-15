from datetime import datetime
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from app.config import settings
from app.schemas.device import Device
from app.services.simulator import simulator
from app.routers.ws_devices import manager

router = APIRouter(prefix="/api", tags=["positions"])


class ArduinoPosition(BaseModel):
    """Payload que envía el tracker Arduino vía GPRS (HTTP POST)."""
    device_id: str
    lat: float
    lng: float
    ts: str  # "YYYY-MM-DD HH:MM:SS"
    sats: int | None = None
    speed_kmh: float | None = None
    alt_m: float | None = None


def _ts_to_epoch_ms(ts: str) -> int:
    """Convierte 'YYYY-MM-DD HH:MM:SS' a epoch milisegundos."""
    try:
        dt = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
        return int(dt.timestamp() * 1000)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de ts inválido. Usar 'YYYY-MM-DD HH:MM:SS'",
        )


@router.post("/positions")
async def receive_position(
    payload: ArduinoPosition,
    authorization: str | None = Header(default=None),
) -> Device:
    """Recibe una posición del tracker Arduino y la publica por WebSocket.

    Headers:
        Authorization: Bearer <DEVICE_API_TOKEN>
    """
    # --- Autenticación ---
    expected = f"Bearer {settings.device_api_token}"
    if authorization != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o ausente",
        )

    # --- Transformar payload Arduino -> Device ---
    last_update_ms = _ts_to_epoch_ms(payload.ts)

    device = Device(
        id=payload.device_id,
        name=payload.device_id,  # device_id como nombre visible
        online=True,
        lat=payload.lat,
        lng=payload.lng,
        battery=100.0,  # valor por defecto (el Arduino no envía batería)
        lastUpdate=last_update_ms,
        source="arduino_gprs",
    )

    # --- Guardar/actualizar en el simulador y hacer broadcast WS ---
    await simulator.upsert_device(device)
    await manager.broadcast_update([device])

    return device
