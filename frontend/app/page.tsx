'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Thermometer, 
  Flame, 
  ShieldAlert, 
  BarChart3, 
  Layers, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Info,
  Calendar,
  Sun,
  AlertCircle
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ScenarioForm from '../components/ScenarioForm';
import HeatRiskBadge from '../components/HeatRiskBadge';
import RiskGauge from '../components/RiskGauge';
import { predictClimateRisk, fetchPredictionHistory } from '../lib/api';
import { PredictionInput, PredictionResult, HistoryRecord } from '../types';

export default function DashboardPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial prediction on mount to populate dashboard
  useEffect(() => {
    handleAnalyze({
      city: 'Lahore',
      date: '2026-06-15',
      temp_min: 28.0,
      rain: 0.0,
      solar_radiation: 22.0,
    });
    loadRecentHistory();
  }, []);

  const loadRecentHistory = async () => {
    try {
      const data = await fetchPredictionHistory({ limit: 4 });
      setRecentPredictions(data.items);
    } catch {
      // Ignore if offline
    }
  };

  const handleAnalyze = async (input: PredictionInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await predictClimateRisk(input);
      setResult(res);
      loadRecentHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze climate scenario. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
          <Thermometer className="w-3.5 h-3.5" />
          Pakistan Climate Risk Intelligence — 2026
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          2026 Heat Risk &amp; Temperature Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-1.5 leading-relaxed">
          ML-powered climate scenario analysis using historical Pakistan weather data.
          Estimate maximum temperatures and evaluate temperature-based heat risk across 15 major meteorological regions.
        </p>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Model Accuracy (R²)"
          value="0.9708"
          subtitle="RandomForest on Historical Pakistan Data"
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Mean Absolute Error"
          value="1.27 °C"
          subtitle="Holdout cross-validation error"
          icon={Thermometer}
          color="blue"
        />
        <MetricCard
          title="Monitored Cities"
          value="15 Cities"
          subtitle="Punjab, Sindh, KP, Balochistan, GB"
          icon={Compass}
          color="purple"
        />
        <MetricCard
          title="Historical Baseline"
          value="10 Years"
          subtitle="2013 → 2023 Cleaned Observations"
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white text-sm">Prediction Service Error</h4>
            <p className="text-xs text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Scenario Form (5 cols) */}
        <div className="lg:col-span-5">
          <ScenarioForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            initialValues={{
              city: 'Lahore',
              date: '2026-06-15',
              temp_min: 28.0,
              rain: 0.0,
              solar_radiation: 22.0
            }}
          />
        </div>

        {/* Right: Results & Thermal Gauge (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Result Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Scenario Prediction Result
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {result.city}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {result.date}
                    </span>
                  </div>
                </div>

                <HeatRiskBadge risk={result.heat_risk} size="lg" />
              </div>

              {/* Core Temperature Readout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-medium block">
                    Predicted Maximum Temperature
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 flex items-baseline gap-1">
                    <span>{result.predicted_max_temperature.toFixed(1)}</span>
                    <span className="text-xl text-emerald-400 font-normal">°C</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Target: Maximum Daytime Ambient Temperature
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">
                      Input Temperature Spread
                    </span>
                    <div className="text-lg font-bold text-slate-200 mt-1">
                      Min: {result.input_values.temp_min}°C → Max: {result.predicted_max_temperature.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Diurnal Range: <span className="font-mono text-emerald-400">{(result.predicted_max_temperature - result.input_values.temp_min).toFixed(1)}°C</span>
                  </div>
                </div>
              </div>

              {/* Visual Heat Risk Scale */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <RiskGauge
                  temperature={result.predicted_max_temperature}
                  heatRisk={result.heat_risk}
                />
              </div>

              {/* Risk Description Advisory */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">
                      Temperature-Based Risk Assessment
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {result.risk_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario Detail Breakdown */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Engineered Scenario Features
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Rainfall</span>
                    <span className="font-mono font-medium text-slate-200">{result.input_values.rain} mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Solar Radiation</span>
                    <span className="font-mono font-medium text-slate-200">{result.input_values.solar_radiation}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Day of Year</span>
                    <span className="font-mono font-medium text-slate-200">Day #{result.input_values.day_of_year}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Cyclical Sine</span>
                    <span className="font-mono font-medium text-slate-200">{result.input_values.month_sin}</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Scenario Disclaimer */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-300/90 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {result.scenario_disclaimer}
                </span>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <Thermometer className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Scenario Analyzed Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Select parameters on the left and click &apos;Analyze Climate Risk&apos;.</p>
            </div>
          )}

          {/* Quick Recent Predictions List */}
          {recentPredictions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recently Logged Scenarios (Database)
                </h3>
                <Link
                  href="/history"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                >
                  View Full History <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recentPredictions.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{rec.city}</span>
                      <span className="text-slate-500 text-[11px]">{rec.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white block">
                        {rec.predicted_max_temperature.toFixed(1)}°C
                      </span>
                      <HeatRiskBadge risk={rec.heat_risk} size="sm" showDot={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
