from .ws_devices import router as ws_router
from .devices import router as devices_router

__all__ = ["devices_router", "ws_router"]
