from pydantic import BaseModel, Field

class Device(BaseModel):
    id: str
    name: str
    online: bool
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    battery: float = Field(ge=0, le=100)
    lastUpdate: int  # epoch ms
