export type HeatRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export interface PredictionInput {
  city: string;
  date: string;
  temp_min: number;
  rain: number;
  solar_radiation: number;
}

export interface ModelInformation {
  algorithm: string;
  target: string;
  training_period: string;
  mae: number;
  r2: number;
  cities_count: number;
  cities: string[];
}

export interface PredictionResult {
  predicted_max_temperature: number;
  heat_risk: HeatRiskLevel;
  risk_description: string;
  city: string;
  date: string;
  input_values: {
    city: string;
    date: string;
    temp_min: number;
    rain: number;
    solar_radiation: number;
    month: number;
    day_of_year: number;
    month_sin: number;
    month_cos: number;
  };
  model_information: ModelInformation;
  prediction_id: number;
  scenario_disclaimer: string;
}

export interface HistoryRecord {
  id: number;
  city: string;
  date: string;
  temp_min: number;
  rain: number;
  solar_radiation: number;
  predicted_max_temperature: number;
  heat_risk: HeatRiskLevel;
  risk_description: string;
  created_at: string;
}

export interface HistoryResponse {
  total: number;
  items: HistoryRecord[];
}

export interface RAGSourceCitation {
  title: string;
  organization: string;
  section: string;
  content: string;
  score: number;
}

export interface RAGResponse {
  query: string;
  answer: string;
  sources: RAGSourceCitation[];
  mode: string;
  disclaimer: string;
}

export interface RAGSourceDoc {
  filename: string;
  title: string;
  organization: string;
  official_reference: string;
  topics: string[];
  chunk_count: number;
}

export interface RAGSourcesListResponse {
  total_sources: number;
  sources: RAGSourceDoc[];
}

export interface HealthCheckResponse {
  status: string;
  app_name: string;
  version: string;
  services: {
    ml_model: {
      loaded: boolean;
      algorithm: string;
      target: string;
      cities_monitored: number;
    };
    rag_assistant: {
      active: boolean;
      indexed_chunks: number;
      documents_indexed: number;
      llm_key_configured: boolean;
    };
    database: {
      engine: string;
      status: string;
    };
  };
}
