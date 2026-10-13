import os
from pydantic import BaseModel

class Settings(BaseModel):
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    tick_ms: int = int(os.getenv("TICK_MS", "2000"))

settings = Settings()
