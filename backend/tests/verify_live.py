import time
import sys
import threading
from pathlib import Path

# Add backend root to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import uvicorn
import httpx
from app.main import app

class ServerThread(threading.Thread):
    def __init__(self, host="127.0.0.1", port=8000):
        super().__init__(daemon=True)
        config = uvicorn.Config(app, host=host, port=port, log_level="error")
        self.server = uvicorn.Server(config)

    def run(self):
        self.server.run()

    def stop(self):
        self.server.should_exit = True

def verify_live_backend():
    print("=" * 60)
    print("STARTING LIVE BACKEND VERIFICATION WITH AUTO-SHUTDOWN")
    print("=" * 60)
    
    server_thread = ServerThread(host="127.0.0.1", port=8000)
    server_thread.start()
    
    base_url = "http://127.0.0.1:8000/api/v1"
    
    try:
        # 1. Wait for server to become responsive
        with httpx.Client(timeout=5.0) as client:
            connected = False
            for _ in range(15):
                try:
                    res = client.get(f"{base_url}/health")
                    if res.status_code == 200:
                        connected = True
                        break
                except Exception:
                    time.sleep(0.3)
            
            if not connected:
                raise RuntimeError("Failed to connect to live server on port 8000")
            
            print("[1/5] GET /api/v1/health -> HTTP 200 OK")
            health_data = res.json()
            assert health_data["status"] == "healthy"
            assert health_data["services"]["ml_model"]["loaded"] is True
            assert health_data["services"]["ml_model"]["cities_monitored"] == 15
            print(f"      - ML Model: {health_data['services']['ml_model']['algorithm']}")
            print(f"      - Monitored Cities: {health_data['services']['ml_model']['cities_monitored']}")
            print(f"      - RAG Chunks: {health_data['services']['rag_assistant']['indexed_chunks']}")

            # 2. Test Prediction Scenarios (POST /api/v1/predict)
            scenarios = [
                {"city": "Lahore", "date": "2026-06-15", "temp_min": 28.5, "rain": 0.0, "solar_radiation": 23.0},
                {"city": "Multan", "date": "2026-06-21", "temp_min": 32.0, "rain": 0.0, "solar_radiation": 26.0},
                {"city": "Islamabad", "date": "2026-07-15", "temp_min": 22.0, "rain": 25.0, "solar_radiation": 12.0},
            ]
            print("\n[2/5] POST /api/v1/predict -> Testing Multiple Scenarios")
            for sc in scenarios:
                pred_res = client.post(f"{base_url}/predict", json=sc)
                assert pred_res.status_code == 200, f"Predict failed: {pred_res.text}"
                data = pred_res.json()
                print(f"      - {sc['city']} ({sc['date']}): Min {sc['temp_min']}°C -> "
                      f"Predicted Max: {data['predicted_max_temperature']}°C | "
                      f"Risk: {data['heat_risk']} | DB ID: #{data['prediction_id']}")
                assert data["heat_risk"] in ["LOW", "MODERATE", "HIGH", "EXTREME"]
                assert data["prediction_id"] is not None

            # 3. Test History Retrieval (GET /api/v1/history)
            print("\n[3/5] GET /api/v1/history -> Verifying SQLite Database Audit")
            hist_res = client.get(f"{base_url}/history?limit=10")
            assert hist_res.status_code == 200, f"History failed: {hist_res.text}"
            hist_data = hist_res.json()
            assert hist_data["total"] >= 3
            print(f"      - Total Recorded Inferences in Database: {hist_data['total']}")
            print(f"      - Most Recent Record: {hist_data['items'][0]['city']} "
                  f"({hist_data['items'][0]['date']}) -> {hist_data['items'][0]['predicted_max_temperature']}°C")

            # 4. Test RAG Query (POST /api/v1/rag/query)
            print("\n[4/5] POST /api/v1/rag/query -> Testing Knowledge Assistant")
            rag_query = {
                "query": "What are PMD criteria for declaring a heatwave in Pakistan?",
                "top_k": 2
            }
            rag_res = client.post(f"{base_url}/rag/query", json=rag_query)
            assert rag_res.status_code == 200, f"RAG query failed: {rag_res.text}"
            rag_data = rag_res.json()
            assert len(rag_data["sources"]) > 0
            print(f"      - Mode: {rag_data['mode']}")
            print(f"      - Citations Retrieved: {len(rag_data['sources'])}")
            for src in rag_data["sources"]:
                print(f"        * [{src['organization']}] {src['title']} ({src['section']})")

            # 5. Test RAG Sources List (GET /api/v1/rag/sources)
            print("\n[5/5] GET /api/v1/rag/sources -> Verifying Indexed Publications")
            src_res = client.get(f"{base_url}/rag/sources")
            assert src_res.status_code == 200
            src_data = src_res.json()
            assert src_data["total_sources"] == 5
            print(f"      - Verified 5 Authoritative Document Sources:")
            for s in src_data["sources"]:
                print(f"        * {s['organization']}: {s['title']}")

        print("\n" + "=" * 60)
        print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY (100% PASS)")
        print("SHUTTING DOWN LIVE SERVER GRACEFULLY...")
        print("=" * 60)
        
    finally:
        server_thread.stop()
        # Allow thread to finish
        time.sleep(0.5)
        print("Server shutdown complete. Exiting.\n")

if __name__ == "__main__":
    verify_live_backend()
