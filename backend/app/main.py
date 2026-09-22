from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import init_db
from app.services.ml_service import ml_service
from app.services.rag_service import rag_service
from app.api.routes_health import router as health_router
from app.api.routes_predict import router as predict_router
from app.api.routes_history import router as history_router
from app.api.routes_rag import router as rag_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print(f"[{settings.APP_NAME}] Starting up...")
    init_db()
    # Eagerly ensure ML model and RAG index are loaded
    _ = ml_service.model
    _ = rag_service.chunks
    print(f"[{settings.APP_NAME}] Backend initialized successfully.")
    yield
    # Shutdown actions
    print(f"[{settings.APP_NAME}] Shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Full-stack AI Climate Risk Intelligence API for Pakistan heat risk estimation and authoritative scenario analysis.",
    lifespan=lifespan
)

# CORS configuration
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers under /api/v1
app.include_router(health_router, prefix="/api/v1", tags=["Health & Status"])
app.include_router(predict_router, prefix="/api/v1", tags=["Climate Prediction (ML)"])
app.include_router(history_router, prefix="/api/v1", tags=["Prediction History (DB)"])
app.include_router(rag_router, prefix="/api/v1", tags=["Climate Knowledge Assistant (RAG)"])

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "api_v1": "/api/v1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
