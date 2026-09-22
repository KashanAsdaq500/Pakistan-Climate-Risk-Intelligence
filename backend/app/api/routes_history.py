from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.schemas.prediction import HistoryResponse
from app.services.db_service import get_prediction_history
from app.db.database import get_db

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
def get_history(
    limit: int = Query(50, ge=1, le=200, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    heat_risk: Optional[str] = Query(None, description="Filter by heat risk (LOW, MODERATE, HIGH, EXTREME)"),
    db: Session = Depends(get_db)
):
    """
    GET /api/v1/history
    Returns historical predictions logged in the database with optional filtering and pagination.
    """
    total, records = get_prediction_history(
        db=db,
        limit=limit,
        offset=offset,
        city=city,
        heat_risk=heat_risk
    )

    items = [r.to_dict() for r in records]
    return {
        "total": total,
        "items": items
    }
