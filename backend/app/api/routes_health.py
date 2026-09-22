from fastapi import APIRouter
from app.services.ml_service import ml_service
from app.services.rag_service import rag_service
from app.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Health check endpoint returning system status, ML model availability,
    and RAG indexed document count.
    """
    ml_loaded = ml_service.model is not None and ml_service.model_info is not None
    rag_sources_count = len(rag_service.chunks)
    
    return {
        "status": "healthy" if ml_loaded else "degraded",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "services": {
            "ml_model": {
                "loaded": ml_loaded,
                "algorithm": "RandomForestRegressor",
                "target": "temp_max",
                "cities_monitored": len(ml_service.model_info.get("cities", [])) if ml_loaded else 0
            },
            "rag_assistant": {
                "active": rag_sources_count > 0,
                "indexed_chunks": rag_sources_count,
                "documents_indexed": len(rag_service.doc_metadata),
                "llm_key_configured": bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
            },
            "database": {
                "engine": "SQLite" if settings.DATABASE_URL.startswith("sqlite") else "PostgreSQL",
                "status": "connected"
            }
        }
    }
