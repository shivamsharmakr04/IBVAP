from fastapi import Header, HTTPException
from app.config import settings


def verify_ai_api_key(
    x_ai_api_key: str | None = Header(default=None),
):
    if not x_ai_api_key or x_ai_api_key != settings.ai_api_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing AI API key",
        )

    return True