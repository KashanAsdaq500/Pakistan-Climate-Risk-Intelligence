from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    city: str = Field(..., description="Target Pakistan city name (e.g., Lahore, Karachi, Islamabad)")
    date: str = Field(..., description="Scenario date in YYYY-MM-DD format (e.g., 2026-06-15)")
    temp_min: float = Field(..., description="Minimum daily temperature in °C", ge=-20.0, le=55.0)
    rain: float = Field(..., description="Daily rainfall in mm", ge=0.0, le=1000.0)
    solar_radiation: float = Field(..., description="Daily solar radiation (MJ/m² or index)", ge=0.0, le=50.0)

class PredictionResponse(BaseModel):
    predicted_max_temperature: float = Field(..., description="Predicted maximum temperature in °C")
    heat_risk: str = Field(..., description="Temperature-based heat risk category (LOW, MODERATE, HIGH, EXTREME)")
    risk_description: str = Field(..., description="Descriptive heat advisory for the temperature tier")
    city: str = Field(..., description="City analyzed")
    date: str = Field(..., description="Scenario analysis date")
    input_values: Dict[str, Any] = Field(..., description="Input parameters and computed temporal features")
    model_information: Dict[str, Any] = Field(..., description="Metadata, R², MAE, and training period")
    prediction_id: Optional[int] = Field(None, description="Database record ID for the saved prediction")
    scenario_disclaimer: str = Field(
        default="2026 dates are used as scenario-analysis inputs. Results are model estimates based on historical weather patterns and are not official weather forecasts.",
        description="Mandatory scientific scenario disclaimer"
    )

class HistoryItem(BaseModel):
    id: int
    city: str
    date: str
    temp_min: float
    rain: float
    solar_radiation: float
    predicted_max_temperature: float
    heat_risk: str
    risk_description: str
    created_at: str

class HistoryResponse(BaseModel):
    total: int
    items: List[HistoryItem]
