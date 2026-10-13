import asyncio
import random
import time
from typing import List

from app.schemas.device import Device


CENTER_LAT = 19.0414
CENTER_LNG = -98.2063

_INITIAL_DEVICES = [
    {"id": "dev-01", "name": "Bateria 01", "online": True, "lat": 19.0414, "lng": -98.2063, "battery": 92.0},
    {"id": "dev-02", "name": "Bateria 02", "online": True, "lat": 19.0477, "lng": -98.213, "battery": 78.0},
    {"id": "dev-03", "name": "Bateria 03", "online": True, "lat": 19.0344, "lng": -98.1947, "battery": 64.0},
    {"id": "dev-04", "name": "Bateria 04", "online": False, "lat": 19.0561, "lng": -98.2036, "battery": 35.0},
    {"id": "dev-05", "name": "Bateria 05", "online": True, "lat": 19.0288, "lng": -98.2171, "battery": 88.0},
    {"id": "dev-06", "name": "Bateria 06", "online": True, "lat": 19.0445, "lng": -98.1914, "battery": 51.0},
    {"id": "dev-07", "name": "Bateria 07", "online": False, "lat": 19.0523, "lng": -98.2217, "battery": 12.0},
    {"id": "dev-08", "name": "Bateria 08", "online": True, "lat": 19.0358, "lng": -98.2076, "battery": 73.0},
]


def _now_ms() -> int:
    return int(time.time() * 1000)


def _drift(max_d: float) -> float:
    return (random.random() - 0.5) * max_d


class DeviceSimulator:
    def __init__(self) -> None:
        now = _now_ms()
        self._devices: List[Device] = [
            Device(**d, lastUpdate=now) for d in _INITIAL_DEVICES
        ]
        self._lock = asyncio.Lock()

    async def get_all(self) -> List[Device]:
        async with self._lock:
            return list(self._devices)

    async def get_by_id(self, device_id: str) -> Device | None:
        async with self._lock:
            for d in self._devices:
                if d.id == device_id:
                    return d
            return None

    async def tick(self) -> List[Device]:
        now = _now_ms()
        async with self._lock:
            next_list: List[Device] = []
            for d in self._devices:
                online_new = d.online
                if random.random() < 0.02:
                    online_new = not d.online

                if not online_new:
                    next_list.append(
                        Device(
                            id=d.id,
                            name=d.name,
                            online=False,
                            lat=d.lat,
                            lng=d.lng,
                            battery=d.battery,
                            lastUpdate=now,
                        )
                    )
                    continue

                lat_n = d.lat + _drift(0.0016)
                lng_n = d.lng + _drift(0.0016)
                batt_n = max(0.0, d.battery - random.random() * 0.4)
                next_list.append(
                    Device(
                        id=d.id,
                        name=d.name,
                        online=True,
                        lat=lat_n,
                        lng=lng_n,
                        battery=batt_n,
                        lastUpdate=now,
                    )
                )
            self._devices = next_list
            return list(self._devices)


simulator = DeviceSimulator()
