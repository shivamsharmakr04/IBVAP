from pathlib import Path
from uuid import uuid4

from app.config import settings


ALLOWED_MEDIA_TYPES = {
    "events": {".jpg", ".jpeg", ".png"},
    "faces": {".jpg", ".jpeg", ".png"},
    "plates": {".jpg", ".jpeg", ".png"},
    "clips": {".mp4", ".avi", ".mov", ".mkv"},
}


def get_media_root() -> Path:
    """
    Return the absolute media directory.

    The location comes from MEDIA_ROOT, so the backend
    does not depend on a specific laptop or operating system.
    """
    root = Path(settings.media_root)

    if not root.is_absolute():
        root = Path.cwd() / root

    return root


def ensure_media_directories() -> None:
    """
    Create all required media directories if they don't exist.
    """
    root = get_media_root()

    for media_type in ALLOWED_MEDIA_TYPES:
        (root / media_type).mkdir(parents=True, exist_ok=True)


def save_media(
    media_type: str,
    file_data: bytes,
    extension: str,
) -> str:
    """
    Save a media file and return its relative path.

    Example:
        events/550e8400-e29b-41d4-a716-446655440000.jpg
    """

    if media_type not in ALLOWED_MEDIA_TYPES:
        raise ValueError("Invalid media type")

    extension = extension.lower()

    if extension not in ALLOWED_MEDIA_TYPES[media_type]:
        raise ValueError(
            f"Unsupported file type for {media_type}: {extension}"
        )

    ensure_media_directories()

    filename = f"{uuid4()}{extension}"

    relative_path = Path(media_type) / filename
    absolute_path = get_media_root() / relative_path

    absolute_path.write_bytes(file_data)

    return relative_path.as_posix()


def get_media_path(relative_path: str) -> Path:
    """
    Convert a stored relative media path into an absolute path.
    """

    root = get_media_root()
    path = (root / relative_path).resolve()

    # Prevent path traversal outside MEDIA_ROOT.
    if root.resolve() not in path.parents:
        raise ValueError("Invalid media path")

    return path


def delete_media(relative_path: str) -> None:
    """
    Delete a media file if it exists.
    """

    path = get_media_path(relative_path)

    if path.exists() and path.is_file():
        path.unlink()