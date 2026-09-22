# Pakistan Climate Risk Intelligence — 2026

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy_2.0-003B57.svg?style=flat&logo=sqlite&logoColor=white)](https://www.sqlalchemy.org/)

An enterprise-grade, full-stack climate scenario intelligence and heat-risk modeling platform for Pakistan. The system integrates a trained **RandomForestRegressor** machine learning model on historical Pakistan weather observations (2013–2023) with a **RAG (Retrieval-Augmented Generation) Climate Assistant** grounded strictly in authoritative publications from the **Pakistan Meteorological Department (PMD)**, **NDMA Pakistan**, **World Health Organization (WHO)**, **NASA Earth Observatory**, and the **IPCC**.

---

## Architecture Overview

```
                               ┌─────────────────────────────────────────┐
                               │       Next.js 14+ Frontend (SPA/SSR)    │
                               │  - TypeScript & Tailwind CSS            │
                               │  - Recharts Visualizations              │
                               │  - Lucide Icons & Responsive Layout     │
                               └────────────────────┬────────────────────┘
                                                    │ HTTP / REST
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │           FastAPI Backend               │
                               │  - Pydantic v2 Schema Validation        │
                               │  - CORS Middleware & Modular Routers    │
                               │  - Lifespan State Management            │
                               └──────────────┬──────────────────┬───────┘
                                              │                  │
                         ┌────────────────────▼─────┐ ┌──────────▼──────────────────────────┐
                         │   ML Prediction Service  │ │        RAG Knowledge Assistant      │
                         │ - RandomForestRegressor  │ │ - Authoritative PMD/NDMA/WHO Index │
                         │ - Cyclical Date Features │ │ - BM25 / TF-IDF Extractive Engine   │
                         │ - Heat Risk Categorizer  │ │ - Optional External LLM Synthesizer │
                         └────────────────────┬─────┘ └─────────────────────────────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────────────────┐
                               │       SQLite Database (SQLAlchemy)      │
                               │  - Auto-audits every scenario inference │
                               │  - Indexed by City, Risk, & Timestamp   │
                               │  - PostgreSQL-ready for production      │
                               └─────────────────────────────────────────┘
```

---

## Key Features

1. **Machine Learning Climate Inference:**
   - Evaluates minimum temperature, rainfall, solar radiation, and sine/cosine cyclical date transforms.
   - Evaluates maximum ambient temperatures across 15 Pakistani cities: Abbottabad, Bahawalpur, Faisalabad, Gilgit, Gwadar, Hyderabad, Islamabad, Karachi, Lahore, Multan, Quetta, Rawalpindi, Sialkot, Skardu, Sukkur.
   - Model Metrics: **R² = 0.9708**, **MAE = 1.27 °C** on 10-year historical validation set.

2. **Calibrated Temperature-Based Heat Risk Classification:**
   - **LOW RISK (< 35.0 °C):** Standard ambient thermal tolerance baseline.
   - **MODERATE RISK (35.0 – 39.9 °C):** Heightened discomfort; hydration and sun precautions advised.
   - **HIGH RISK (40.0 – 44.9 °C):** Rapid onset of heat exhaustion likely; prolonged outdoor exertion dangerous.
   - **EXTREME RISK (≥ 45.0 °C):** Critical risk of heatstroke without active cooling and shelter.

3. **Authoritative RAG Knowledge Assistant:**
   - Dedicated conversational assistant answering thermal physiology, heat safety, and climatology inquiries.
   - Zero invented citations: strictly indexes verified publications from PMD, NDMA Pakistan, WHO, NASA, and IPCC.
   - Operates with local extractive BM25 retrieval out-of-the-box, with optional LLM generation via Gemini or OpenAI.

4. **Relational Scenario Auditing:**
   - Automatically records every scenario inference with input parameters, predictions, heat-risk tier, and UTC timestamp into SQLite.
   - Searchable, filterable audit log in the frontend UI.

5. **Responsive Dashboard & Analysis:**
   - Dynamic thermal gauge visualizing the 4-tier heat risk scale.
   - Multi-city comparison chart built with Recharts.
   - Instant parameter presets (Lahore Pre-Monsoon Heatwave, Multan Thermal Peak, Karachi Summer, etc.).

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Recharts, Lucide React, Fetch API |
| **Backend** | FastAPI, Uvicorn, Pydantic v2, Python 3.11+ |
| **Machine Learning** | Scikit-Learn (RandomForestRegressor Pipeline, OneHotEncoder), Pandas, NumPy, Joblib |
| **Database** | SQLite, SQLAlchemy ORM (PostgreSQL-ready) |
| **RAG** | BM25 / TF-IDF Vector Space Index, Markdown Knowledge Base, Optional Gemini/OpenAI synthesis |

---

## Project Structure

```
Pakistan Climate Risk Intelligence/
├── app.py                     # Legacy Streamlit prototype (preserved)
├── train_model.py             # Model training script
├── data/
│   └── weather.csv            # 10-year historical Pakistan meteorological dataset
├── models/
│   ├── temperature_model.pkl  # Trained RandomForestRegressor pipeline
│   └── model_info.pkl         # Model metadata, performance metrics, and cities
├── backend/
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Backend environment template
│   ├── climate_intelligence.db# Local SQLite database
│   ├── documents/             # Authoritative RAG markdown corpus
│   │   ├── pmd_pakistan_meteorological_dept.md
│   │   ├── ndma_pakistan_heatwave_management.md
│   │   ├── who_heatwaves_health_guidance.md
│   │   ├── nasa_earth_observatory_urban_heat.md
│   │   └── ipcc_south_asia_climate_assessment.md
│   ├── app/
│   │   ├── main.py            # FastAPI entry point & CORS
│   │   ├── config.py          # Pydantic Settings
│   │   ├── api/               # API endpoints (health, predict, history, rag)
│   │   ├── db/                # SQLAlchemy models and sessionmaker
│   │   ├── schemas/           # Pydantic request/response validation
│   │   └── services/          # ML inference, RAG engine, DB persistence
│   └── tests/
│       └── test_api.py        # Automated test suite
└── frontend/
    ├── package.json           # Node.js dependencies
    ├── tsconfig.json          # TypeScript config
    ├── tailwind.config.js     # Tailwind CSS theme & tokens
    ├── app/                   # Next.js App Router (Dashboard, Analysis, Assistant, History, About)
    ├── components/            # Reusable UI components (Navbar, Gauge, MetricCard, ScenarioForm)
    ├── lib/                   # API client and formatting utilities
    └── types/                 # TypeScript interfaces
```

---

## Local Setup & Installation

### 1. Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
5. Run automated tests to verify model, database, and RAG:
   ```bash
   python tests/test_api.py
   ```
6. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The backend will be live at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### Health Check
- `GET /api/v1/health`
  - Returns backend status, ML model readiness, RAG indexed chunk count, and database status.

### Climate Scenario Prediction
- `POST /api/v1/predict`
  - **Payload:**
    ```json
    {
      "city": "Lahore",
      "date": "2026-06-15",
      "temp_min": 28.0,
      "rain": 0.0,
      "solar_radiation": 22.0
    }
    ```
  - **Response:**
    ```json
    {
      "predicted_max_temperature": 40.1,
      "heat_risk": "HIGH",
      "risk_description": "High temperature-based heat risk (40.0–44.9°C)...",
      "city": "Lahore",
      "date": "2026-06-15",
      "input_values": { ... },
      "model_information": { "r2": 0.9708, "mae": 1.27 },
      "prediction_id": 1,
      "scenario_disclaimer": "2026 dates are used as scenario-analysis inputs..."
    }
    ```

### Prediction Audit History
- `GET /api/v1/history?limit=50&city=Lahore&heat_risk=HIGH`
  - Returns paginated prediction records logged in SQLite.

### Climate Assistant RAG Query
- `POST /api/v1/rag/query`
  - **Payload:**
    ```json
    {
      "query": "What are PMD criteria for declaring a heatwave in Pakistan?",
      "top_k": 3
    }
    ```
  - **Response:** Grounded answer accompanied by citations from PMD, NDMA, or WHO.

### Indexed Knowledge Sources
- `GET /api/v1/rag/sources`
  - Lists all 5 authoritative publications, chunk counts, and associated climate topics.

---

## Limitations & Scientific Disclaimer

> [!IMPORTANT]
> **Academic & Portfolio Disclaimer:**
> 1. **Scenario Analysis Input:** Dates within 2026 are supplied strictly as scenario-analysis variables. Outputs represent mathematical model estimates based on historical observations (2013–2023) and are **not** official weather forecasts.
> 2. **Temperature-Based Risk Metric:** The heat-risk classifications (LOW, MODERATE, HIGH, EXTREME) are derived strictly from ambient temperature thresholds for analytical evaluation and do **not** represent official government emergency declarations.
> 3. **Authoritative Directives:** For active weather warnings and disaster alerts, consult the [Pakistan Meteorological Department (PMD)](https://pmd.gov.pk) and [National Disaster Management Authority (NDMA Pakistan)](https://ndma.gov.pk).

---

## Deployment Notes

- **Docker:** A standard multi-stage `Dockerfile` can build both the FastAPI backend and Next.js frontend.
- **Production Database:** To switch from SQLite to PostgreSQL, update `DATABASE_URL` in `backend/.env` to `postgresql://user:password@host:5432/dbname`. SQLAlchemy models will automatically adapt without code modifications.
- **Frontend Hosting:** The Next.js application is ready for deployment on Vercel, AWS Amplify, or containerized ECS/K8s clusters by specifying `NEXT_PUBLIC_API_URL`.
