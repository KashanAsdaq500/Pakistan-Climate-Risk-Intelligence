import os
from pathlib import Path
from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    APP_NAME: str = "Pakistan Climate Risk Intelligence API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BACKEND_DIR / 'climate_intelligence.db'}"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000"
    
    # ML Model Paths
    MODEL_PATH: str = str(PROJECT_ROOT / "models" / "temperature_model.pkl")
    MODEL_INFO_PATH: str = str(PROJECT_ROOT / "models" / "model_info.pkl")
    
    # RAG Knowledge Documents Path
    DOCUMENTS_DIR: str = str(BACKEND_DIR / "documents")
    
    # Optional LLM keys
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = str(BACKEND_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
