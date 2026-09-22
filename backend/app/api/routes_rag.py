from fastapi import APIRouter
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse, RAGSourcesListResponse
from app.services.rag_service import rag_service

router = APIRouter()

@router.post("/rag/query", response_model=RAGQueryResponse)
def query_climate_assistant(payload: RAGQueryRequest):
    """
    POST /api/v1/rag/query
    Answers climate, heatwave, and thermal risk questions strictly using
    authoritative sources (PMD, NDMA Pakistan, WHO, NASA, IPCC).
    """
    response_data = rag_service.query(
        user_query=payload.query,
        top_k=payload.top_k or 3
    )
    return response_data

@router.get("/rag/sources", response_model=RAGSourcesListResponse)
def list_rag_sources():
    """
    GET /api/v1/rag/sources
    Returns metadata on all authoritative documents currently indexed in the knowledge base.
    """
    sources = rag_service.get_indexed_sources()
    return {
        "total_sources": len(sources),
        "sources": sources
    }
