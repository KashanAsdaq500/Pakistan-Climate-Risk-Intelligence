from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.db.database import Base

class PredictionHistory(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    city = Column(String(100), nullable=False, index=True)
    date = Column(String(50), nullable=False, index=True)
    temp_min = Column(Float, nullable=False)
    rain = Column(Float, nullable=False)
    solar_radiation = Column(Float, nullable=False)
    predicted_max_temperature = Column(Float, nullable=False)
    heat_risk = Column(String(50), nullable=False, index=True)
    risk_description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "city": self.city,
            "date": self.date,
            "temp_min": self.temp_min,
            "rain": self.rain,
            "solar_radiation": self.solar_radiation,
            "predicted_max_temperature": self.predicted_max_temperature,
            "heat_risk": self.heat_risk,
            "risk_description": self.risk_description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
