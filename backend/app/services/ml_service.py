import os
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
import numpy as np
import pandas as pd
from app.config import settings

class MLService:
    _instance = None

    def __init__(self):
        self.model = None
        self.model_info = None
        self.load_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = MLService()
        return cls._instance

    def load_models(self):
        model_path = Path(settings.MODEL_PATH).resolve()
        info_path = Path(settings.MODEL_INFO_PATH).resolve()

        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")
        if not info_path.exists():
            raise FileNotFoundError(f"Model info file not found at {info_path}")

        print(f"[MLService] Loading ML model from {model_path}...")
        self.model = joblib.load(model_path)
        print(f"[MLService] Loading Model Info from {info_path}...")
        self.model_info = joblib.load(info_path)
        print("[MLService] ML Model & Info successfully loaded into memory.")

    def calculate_heat_risk(self, temp: float) -> Tuple[str, str]:
        """
        Calculates TEMPERATURE-BASED heat risk classification.
        Note: This is a temperature-based analytical metric and NOT an official government emergency alert.
        < 35°C = LOW
        35–39.9°C = MODERATE
        40–44.9°C = HIGH
        >= 45°C = EXTREME
        """
        if temp >= 45.0:
            return "EXTREME", "Extreme temperature-based heat risk (≥45°C). Dangerous thermal stress with high risk of heatstroke. Immediate cooling, shade, and avoidance of outdoor physical labor are vital."
        elif temp >= 40.0:
            return "HIGH", "High temperature-based heat risk (40.0–44.9°C). High risk of thermal fatigue and heat exhaustion. Minimize prolonged outdoor exposure during peak sun hours and stay hydrated."
        elif temp >= 35.0:
            return "MODERATE", "Moderate temperature-based heat risk (35.0–39.9°C). Noticeable heat discomfort. Regular hydration and basic heat awareness recommended."
        else:
            return "LOW", "Low temperature-based heat risk (<35°C). Ambient thermal levels within standard tolerable baseline."

    def predict(self, city: str, date_str: str, temp_min: float, rain: float, solar_radiation: float) -> Dict[str, Any]:
        """
        Prepares cyclical date features, evaluates the RandomForest model,
        and assigns temperature-based heat risk.
        """
        # Validate supported city
        supported_cities = self.model_info.get("cities", [])
        matched_city = next((c for c in supported_cities if c.lower() == city.lower()), None)
        if not matched_city:
            matched_city = city  # OneHotEncoder with handle_unknown='ignore' handles it, but preserve casing if matched

        # Parse date and compute cyclical features
        parsed_date = pd.to_datetime(date_str)
        month = parsed_date.month
        day_of_year = parsed_date.dayofyear

        month_sin = float(np.sin(2 * np.pi * month / 12))
        month_cos = float(np.cos(2 * np.pi * month / 12))

        # Build feature DataFrame exactly matching train_model.py schema
        feature_dict = {
            "temp_min": [float(temp_min)],
            "rain": [float(rain)],
            "solar_radiation": [float(solar_radiation)],
            "month": [int(month)],
            "day_of_year": [int(day_of_year)],
            "month_sin": [month_sin],
            "month_cos": [month_cos],
            "city": [matched_city],
        }

        input_df = pd.DataFrame(feature_dict)
        predicted_max = float(self.model.predict(input_df)[0])
        predicted_max_rounded = round(predicted_max, 1)

        heat_risk, risk_description = self.calculate_heat_risk(predicted_max_rounded)

        return {
            "predicted_max_temperature": predicted_max_rounded,
            "heat_risk": heat_risk,
            "risk_description": risk_description,
            "city": matched_city,
            "date": parsed_date.strftime("%Y-%m-%d"),
            "input_values": {
                "city": matched_city,
                "date": parsed_date.strftime("%Y-%m-%d"),
                "temp_min": float(temp_min),
                "rain": float(rain),
                "solar_radiation": float(solar_radiation),
                "month": month,
                "day_of_year": day_of_year,
                "month_sin": round(month_sin, 4),
                "month_cos": round(month_cos, 4),
            },
            "model_information": {
                "algorithm": "RandomForestRegressor (Pipeline with OneHotEncoder)",
                "target": self.model_info.get("target", "temp_max"),
                "training_period": f"{self.model_info.get('training_start')} to {self.model_info.get('training_end')}",
                "mae": round(float(self.model_info.get("mae", 0.0)), 2),
                "r2": round(float(self.model_info.get("r2", 0.0)), 4),
                "cities_count": len(supported_cities),
                "cities": supported_cities,
            }
        }

ml_service = MLService.get_instance()
