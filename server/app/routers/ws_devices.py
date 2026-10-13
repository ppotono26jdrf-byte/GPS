import asyncio
from typing import List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.schemas.device import Device
from app.services.simulator import simulator

router = APIRouter(tags=["ws"])


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        try:
            self.active_connections.remove(websocket)
        except ValueError:
            pass

    async def broadcast_snapshot(self, devices: List[Device]) -> None:
        payload = {"type": "snapshot", "ts": devices[0].lastUpdate if devices else 0, "devices": [d.model_dump() for d in devices]}
        await self._broadcast(payload)

    async def broadcast_update(self, devices: List[Device]) -> None:
        ts = devices[0].lastUpdate if devices else 0
        payload = {"type": "update", "ts": ts, "devices": [d.model_dump() for d in devices]}
        await self._broadcast(payload)

    async def broadcast_ping(self, ts: int) -> None:
        await self._broadcast({"type": "ping", "ts": ts})

    async def _broadcast(self, payload: dict) -> None:
        disconnected: List[WebSocket] = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(payload)
            except Exception:
                disconnected.append(connection)
        for ws in disconnected:
            self.disconnect(ws)


manager = ConnectionManager()


@router.websocket("/ws/devices")
async def ws_devices(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        initial = await simulator.get_all()
        await manager.broadcast_snapshot(initial)
        while True:
            await asyncio.sleep(0)
            raise WebSocketDisconnect()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
