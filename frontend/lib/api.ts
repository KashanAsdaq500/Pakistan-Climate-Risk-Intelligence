import {
  PredictionInput,
  PredictionResult,
  HistoryResponse,
  RAGResponse,
  RAGSourcesListResponse,
  HealthCheckResponse
} from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function checkHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${BASE_URL}/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function predictClimateRisk(input: PredictionInput): Promise<PredictionResult> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Prediction failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchPredictionHistory(params?: {
  limit?: number;
  offset?: number;
  city?: string;
  heat_risk?: string;
}): Promise<HistoryResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.offset) query.set('offset', params.offset.toString());
  if (params?.city) query.set('city', params.city);
  if (params?.heat_risk) query.set('heat_risk', params.heat_risk);

  const res = await fetch(`${BASE_URL}/history?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch history: ${res.statusText}`);
  }
  return res.json();
}

export async function queryRAGAssistant(query: string, top_k = 3): Promise<RAGResponse> {
  const res = await fetch(`${BASE_URL}/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `RAG query failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRAGSources(): Promise<RAGSourcesListResponse> {
  const res = await fetch(`${BASE_URL}/rag/sources`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch RAG sources: ${res.statusText}`);
  }
  return res.json();
}
