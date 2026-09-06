from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "IBVAP Backend"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = "sqlite:///./ibvap.db"
    ai_api_key: str = "development-secret-key"

    media_root: str = "media"

    # Maximum upload sizes in bytes
    max_image_size: int = 10 * 1024 * 1024      # 10 MB
    max_video_size: int = 200 * 1024 * 1024     # 200 MB

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()