from typing import List, Optional
from pydantic import BaseModel, Field

class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Climate or heat-risk question")
    top_k: Optional[int] = Field(default=3, ge=1, le=5, description="Number of source passages to retrieve")

class RAGSourceItem(BaseModel):
    title: str = Field(..., description="Document title")
    organization: str = Field(..., description="Authoritative organization (PMD, NDMA, WHO, NASA, IPCC)")
    section: str = Field(..., description="Specific document heading or section")
    content: str = Field(..., description="Relevant authoritative excerpt")
    score: float = Field(..., description="Relevance retrieval score")

class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[RAGSourceItem]
    mode: str = Field(..., description="'local_extractive' or 'llm_synthesized'")
    disclaimer: str = Field(
        default="Answers are derived strictly from authoritative climate resources (PMD, NDMA Pakistan, WHO, NASA, IPCC). This is an educational and intelligence assistant, not an emergency warning dispatch.",
        description="Authoritative reference disclaimer"
    )

class RAGDocumentSource(BaseModel):
    filename: str
    title: str
    organization: str
    official_reference: str
    topics: List[str]
    chunk_count: int

class RAGSourcesListResponse(BaseModel):
    total_sources: int
    sources: List[RAGDocumentSource]
