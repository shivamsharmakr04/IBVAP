from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.config import settings
from app.services.media_service import get_media_path, save_media


router = APIRouter(
    prefix="/api/v1/media",
    tags=["Media"],
)


MEDIA_TYPES = {
    "events": {".jpg", ".jpeg", ".png"},
    "faces": {".jpg", ".jpeg", ".png"},
    "plates": {".jpg", ".jpeg", ".png"},
    "clips": {".mp4", ".avi", ".mov", ".mkv"},
}


@router.post("/{media_type}")
async def upload_media(
    media_type: str,
    file: UploadFile = File(...),
):
    """
    Upload a media file.
    """

    if media_type not in MEDIA_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid media type",
        )

    extension = Path(file.filename or "").suffix.lower()

    if extension not in MEDIA_TYPES[media_type]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}",
        )

    file_data = await file.read()

    if not file_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    # Check file size
    if media_type == "clips":
        max_size = settings.max_video_size
    else:
        max_size = settings.max_image_size

    if len(file_data) > max_size:
        max_size_mb = max_size // (1024 * 1024)

        raise HTTPException(
            status_code=413,
            detail=f"File is too large. Maximum allowed size is {max_size_mb} MB",
        )

    try:
        relative_path = save_media(
            media_type=media_type,
            file_data=file_data,
            extension=extension,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    return {
        "message": "Media uploaded successfully",
        "path": relative_path,
        "filename": Path(relative_path).name,
        "media_type": media_type,
    }


@router.get("/{media_type}/{filename}")
def get_media(
    media_type: str,
    filename: str,
):
    """
    Retrieve a stored media file.
    """

    if media_type not in MEDIA_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid media type",
        )

    extension = Path(filename).suffix.lower()

    if extension not in MEDIA_TYPES[media_type]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported media file type",
        )

    try:
        media_path = get_media_path(
            f"{media_type}/{filename}"
        )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid media path",
        )

    if not media_path.exists() or not media_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Media file not found",
        )

    return FileResponse(
        path=media_path,
    )