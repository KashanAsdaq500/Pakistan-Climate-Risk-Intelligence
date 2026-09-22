import os
import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.db.database import init_db

# Initialize tables
init_db()

def run_tests():
    with TestClient(app) as client:
        # 1. Health check
        print("Testing /api/v1/health...")
        response = client.get("/api/v1/health")
        assert response.status_code == 200, f"Health check failed: {response.text}"
        data = response.json()
        assert data["status"] == "healthy"
        assert data["services"]["ml_model"]["loaded"] is True
        assert data["services"]["rag_assistant"]["active"] is True
        print(" -> [PASS] Health endpoint verified.")

        # 2. Prediction and DB Persistence
        print("Testing /api/v1/predict...")
        payload = {
            "city": "Lahore",
            "date": "2026-06-15",
            "temp_min": 28.0,
            "rain": 0.0,
            "solar_radiation": 22.0
        }
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200, f"Prediction failed: {response.text}"
        pred_data = response.json()
        assert "predicted_max_temperature" in pred_data
        assert "heat_risk" in pred_data
        assert pred_data["city"] == "Lahore"
        assert pred_data["date"] == "2026-06-15"
        assert pred_data["prediction_id"] is not None
        assert pred_data["heat_risk"] in ["LOW", "MODERATE", "HIGH", "EXTREME"]
        print(f" -> [PASS] Prediction successful: {pred_data['predicted_max_temperature']}°C, Heat Risk: {pred_data['heat_risk']}, DB ID: {pred_data['prediction_id']}")

        # 3. History Retrieval
        print("Testing /api/v1/history...")
        hist_resp = client.get("/api/v1/history?limit=10")
        assert hist_resp.status_code == 200, f"History failed: {hist_resp.text}"
        hist_data = hist_resp.json()
        assert hist_data["total"] >= 1
        recent = hist_data["items"][0]
        assert recent["city"] == "Lahore"
        assert recent["heat_risk"] == pred_data["heat_risk"]
        print(f" -> [PASS] History endpoint verified with {hist_data['total']} saved prediction(s).")

        # 4. RAG Query
        print("Testing /api/v1/rag/query...")
        query_payload = {
            "query": "What are PMD criteria for declaring a heatwave in Pakistan?",
            "top_k": 3
        }
        rag_resp = client.post("/api/v1/rag/query", json=query_payload)
        assert rag_resp.status_code == 200, f"RAG query failed: {rag_resp.text}"
        rag_data = rag_resp.json()
        assert "answer" in rag_data
        assert len(rag_data["sources"]) > 0
        assert any("PMD" in s["organization"] or "Pakistan" in s["title"] for s in rag_data["sources"])
        print(f" -> [PASS] RAG query answered with {len(rag_data['sources'])} authoritative citation(s).")

        # 5. RAG Sources list
        print("Testing /api/v1/rag/sources...")
        sources_resp = client.get("/api/v1/rag/sources")
        assert sources_resp.status_code == 200
        sources_data = sources_resp.json()
        assert sources_data["total_sources"] >= 4
        print(f" -> [PASS] RAG sources listed: {sources_data['total_sources']} documents indexed.")

        print("\n=======================================================")
        print(" ALL BACKEND API AND ML INTEGRATION TESTS PASSED! ")
        print("=======================================================\n")

if __name__ == "__main__":
    run_tests()
