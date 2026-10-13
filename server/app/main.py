import asyncio
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import devices_router, ws_router
from app.services.simulator import simulator
from app.routers.ws_devices import manager

app = FastAPI(title="SolyLitio GPS API", version="1.0.0", description="API para rastreo de baterías (solo lectura)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices_router)
app.include_router(ws_router)


@app.get("/health")
async def health():
    return {"status": "ok"}


async def _simulator_task() -> None:
    while True:
        await asyncio.sleep(settings.tick_ms / 1000.0)
        updated = await simulator.tick()
        await manager.broadcast_update(updated)
        if time.time() % 30 < 1:
            await manager.broadcast_ping(int(time.time() * 1000))


@app.on_event("startup")
async def on_startup() -> None:
    app.state.sim_task = asyncio.create_task(_simulator_task())


@app.on_event("shutdown")
async def on_shutdown() -> None:
    task = getattr(app.state, "sim_task", None)
    if task is not None:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
