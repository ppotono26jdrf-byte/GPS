from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.device import Device
from app.services.simulator import simulator

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=List[Device])
async def list_devices() -> List[Device]:
    return await simulator.get_all()


@router.get("/{device_id}", response_model=Device)
async def get_device(device_id: str) -> Device:
    dev = await simulator.get_by_id(device_id)
    if dev is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return dev
