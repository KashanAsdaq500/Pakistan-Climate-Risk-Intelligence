from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models import PredictionHistory

def save_prediction(
    db: Session,
    city: str,
    date: str,
    temp_min: float,
    rain: float,
    solar_radiation: float,
    predicted_max_temperature: float,
    heat_risk: str,
    risk_description: str
) -> PredictionHistory:
    """
    Persists a prediction record into the SQLite/PostgreSQL database.
    """
    record = PredictionHistory(
        city=city,
        date=date,
        temp_min=temp_min,
        rain=rain,
        solar_radiation=solar_radiation,
        predicted_max_temperature=predicted_max_temperature,
        heat_risk=heat_risk,
        risk_description=risk_description
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_prediction_history(
    db: Session,
    limit: int = 50,
    offset: int = 0,
    city: Optional[str] = None,
    heat_risk: Optional[str] = None
) -> Tuple[int, List[PredictionHistory]]:
    """
    Retrieves recent predictions with optional filtering by city and heat risk.
    """
    query = db.query(PredictionHistory)
    if city:
        query = query.filter(PredictionHistory.city.ilike(f"%{city}%"))
    if heat_risk:
        query = query.filter(PredictionHistory.heat_risk == heat_risk.upper())

    total = query.count()
    items = query.order_by(desc(PredictionHistory.created_at)).offset(offset).limit(limit).all()
    return total, items
