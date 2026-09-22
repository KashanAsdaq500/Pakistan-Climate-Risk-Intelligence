from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.ml_service import ml_service
from app.services.db_service import save_prediction
from app.db.database import get_db

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict_temperature(payload: PredictionRequest, db: Session = Depends(get_db)):
    """
    POST /api/v1/predict
    Predicts maximum temperature and assigns temperature-based heat risk using the trained ML model.
    Saves the prediction record into the SQLite database.
    """
    try:
        # Run ML inference
        result = ml_service.predict(
            city=payload.city,
            date_str=payload.date,
            temp_min=payload.temp_min,
            rain=payload.rain,
            solar_radiation=payload.solar_radiation
        )

        # Save to database
        saved_record = save_prediction(
            db=db,
            city=result["city"],
            date=result["date"],
            temp_min=payload.temp_min,
            rain=payload.rain,
            solar_radiation=payload.solar_radiation,
            predicted_max_temperature=result["predicted_max_temperature"],
            heat_risk=result["heat_risk"],
            risk_description=result["risk_description"]
        )

        result["prediction_id"] = saved_record.id

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction calculation failed: {str(e)}"
        )
