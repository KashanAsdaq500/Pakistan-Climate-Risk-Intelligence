'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Thermometer, 
  Flame, 
  ShieldAlert, 
  Layers, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Info,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ScenarioForm from '../components/ScenarioForm';
import HeatRiskBadge from '../components/HeatRiskBadge';
import RiskGauge from '../components/RiskGauge';
import IconWrapper from '../components/IconWrapper';
import { predictClimateRisk, fetchPredictionHistory } from '../lib/api';
import { PredictionInput, PredictionResult, HistoryRecord } from '../types';

export default function DashboardPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate with Lahore scenario on mount
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
      // Backend may be offline during initial client boot
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
      setError(err.message || 'Failed to analyze climate scenario. Ensure FastAPI backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* ========================================================================= */}
      {/* WINDOW 1: HERO / INTRODUCTION                                             */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background watermarks inspired by Pakistan Flag colors */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-50/60 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#01411c]/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-[#01411c] shadow-2xs">
            <IconWrapper icon={Sparkles} className="w-3.5 h-3.5 text-[#01411c]" />
            <span>Pakistan Climate Risk Intelligence — 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            2026 Heat Risk &amp; Temperature Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            ML-powered climate scenario analysis using historical Pakistan weather data.
            Evaluate temperature-based heat risk across 15 major meteorological regions using a validated
            RandomForest architecture and authoritative heatwave climatology.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WINDOW 2: MODEL PERFORMANCE METRICS                                       */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <IconWrapper icon={TrendingUp} className="w-4 h-4 text-[#01411c]" />
            <span>Validated Model Architecture &amp; Baseline</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Scikit-Learn Verified</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Model Accuracy (R²)"
            value="0.9708"
            subtitle="RandomForest on Pakistan observations"
            icon={TrendingUp}
            color="green"
            trend="+0.9708"
            trendPositive={true}
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
      </section>

      {/* Error Alert Display */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 shadow-sm">
          <div className="p-1 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
            <IconWrapper icon={AlertCircle} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-red-950">Simulation Service Error</h4>
            <p className="text-xs text-red-800 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 3 & WINDOW 4: SCENARIO CONTROL & SEPARATE RESULT WINDOW            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* WINDOW 3: Scenario Control Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
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

        {/* WINDOW 4: Prediction Result (MUST BE SEPARATE LARGE WINDOW) (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-md shadow-[#01411c]/5 space-y-7 relative overflow-hidden">
              {/* Subtle green aesthetic accent banner */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#01411c] via-emerald-600 to-teal-600" />

              {/* Result Window Title & Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#01411c] uppercase tracking-wider">
                    <IconWrapper icon={Sparkles} className="w-4 h-4 text-[#01411c]" />
                    <span>Climate Risk Assessment</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {result.city}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">
                      {result.date}
                    </span>
                  </div>
                </div>

                {/* Highly Visible Heat Risk Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Category</span>
                  <HeatRiskBadge risk={result.heat_risk} size="lg" />
                </div>
              </div>

              {/* Core Output Numbers & Diurnal Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Predicted Max Temperature */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Predicted Maximum Temperature
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-[#01411c] tracking-tight flex items-baseline gap-1">
                    <span>{result.predicted_max_temperature.toFixed(1)}</span>
                    <span className="text-2xl font-bold text-emerald-700">°C</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block pt-1">
                    Target Variable: Peak Ambient Day Temperature
                  </span>
                </div>

                {/* Simulated Min Temp & Diurnal Spread */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Simulated Diurnal Temperature Range
                    </span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">
                      Min: {result.input_values.temp_min.toFixed(1)}°C → Max: {result.predicted_max_temperature.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Diurnal Range:</span>
                    <span className="font-mono font-black text-[#01411c] text-sm">
                      +{(result.predicted_max_temperature - result.input_values.temp_min).toFixed(1)} °C
                    </span>
                  </div>
                </div>

              </div>

              {/* Visual Heat Risk Scale Bar */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
                <RiskGauge
                  temperature={result.predicted_max_temperature}
                  heatRisk={result.heat_risk}
                />
              </div>

              {/* Risk Advisory Explanation Box */}
              <div className="p-5 rounded-2xl bg-[#01411c]/5 border border-[#01411c]/20 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-[#01411c] text-white shrink-0 mt-0.5">
                  <IconWrapper icon={Flame} className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#01411c]">
                    Temperature-Based Heat Advisory
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {result.risk_description}
                  </p>
                </div>
              </div>

              {/* Engineered Model Features */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Engineered Model Features &amp; Cyclical Encodings
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Rainfall</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{result.input_values.rain} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Solar Radiation</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{result.input_values.solar_radiation}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Day of Year</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">Day #{result.input_values.day_of_year}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Cyclical Sine</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{result.input_values.month_sin}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <div className="p-4 rounded-full bg-emerald-50 text-[#01411c] inline-flex">
                <IconWrapper icon={Thermometer} className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Awaiting Scenario Simulation</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your meteorological parameters in the Climate Scenario Control window and click &apos;Analyze Climate Risk&apos;.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* WINDOW 5: RECENTLY LOGGED SCENARIOS                                       */}
      {/* ========================================================================= */}
      {recentPredictions.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-[#01411c]">
                <IconWrapper icon={Clock} className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recently Logged Scenarios (Cloud Database)
              </h3>
            </div>
            <Link
              href="/history"
              className="text-xs text-[#01411c] hover:text-emerald-700 font-bold flex items-center gap-1 transition-colors"
            >
              <span>View Full History</span>
              <IconWrapper icon={ArrowRight} className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentPredictions.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{rec.city}</span>
                  <HeatRiskBadge risk={rec.heat_risk} size="sm" showDot={false} />
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-mono">{rec.date}</span>
                  <span className="font-mono font-black text-[#01411c] text-sm">
                    {rec.predicted_max_temperature.toFixed(1)} °C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 6: SCIENTIFIC DISCLAIMER                                           */}
      {/* ========================================================================= */}
      <section className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#01411c] text-white shrink-0 mt-0.5">
          <IconWrapper icon={Info} className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1 text-xs leading-relaxed text-slate-600">
          <h4 className="font-bold text-slate-900 text-sm">
            Research Project Scenario Notice
          </h4>
          <p>
            2026 dates are used strictly as scenario-analysis inputs. Results are model estimates based on historical weather patterns (2013–2023) and are not official weather forecasts or emergency warnings. For active alerts, please consult the <strong>Pakistan Meteorological Department (PMD)</strong> and <strong>NDMA Pakistan</strong>.
          </p>
        </div>
      </section>

    </div>
  );
}
