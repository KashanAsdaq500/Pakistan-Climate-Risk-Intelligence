'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Thermometer, 
  Info, 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  Database,
  Calendar,
  CloudSun,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import HeatRiskBadge from '../../components/HeatRiskBadge';
import RiskGauge from '../../components/RiskGauge';
import { predictClimateRisk } from '../../lib/api';
import { PredictionResult } from '../../types';

const PAKISTAN_CITIES = [
  'Abbottabad', 'Bahawalpur', 'Faisalabad', 'Gilgit', 'Gwadar',
  'Hyderabad', 'Islamabad', 'Karachi', 'Lahore', 'Multan',
  'Quetta', 'Rawalpindi', 'Sialkot', 'Skardu', 'Sukkur'
];

export default function ClimateAnalysisPage() {
  const [city, setCity] = useState('Multan');
  const [date, setDate] = useState('2026-06-21');
  const [tempMin, setTempMin] = useState(30.0);
  const [rain, setRain] = useState(0.0);
  const [solarRadiation, setSolarRadiation] = useState(25.0);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [cityComparisonData, setCityComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await predictClimateRisk({
        city,
        date,
        temp_min: tempMin,
        rain,
        solar_radiation: solarRadiation,
      });
      setCurrentResult(res);

      // Run multi-city scenario comparison for key benchmark cities
      runCityComparison(date, tempMin, rain, solarRadiation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runCityComparison = async (
    targetDate: string,
    tMin: number,
    r: number,
    sr: number
  ) => {
    setIsComparing(true);
    const benchmarkCities = ['Karachi', 'Lahore', 'Islamabad', 'Multan', 'Quetta', 'Sukkur', 'Gilgit'];
    const results = [];

    for (const c of benchmarkCities) {
      try {
        const p = await predictClimateRisk({
          city: c,
          date: targetDate,
          temp_min: tMin,
          rain: r,
          solar_radiation: sr,
        });
        results.push({
          city: c,
          predictedMax: p.predicted_max_temperature,
          heatRisk: p.heat_risk,
        });
      } catch {
        // skip if error
      }
    }
    setCityComparisonData(results);
    setIsComparing(false);
  };

  const getBarColor = (risk: string) => {
    switch (risk) {
      case 'EXTREME': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#f59e0b';
      case 'LOW':
      default: return '#10b981';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          Multi-Variable Climate Scenario Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Climate Scenario Analysis &amp; Modeling
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-1.5 leading-relaxed">
          Simulate environmental permutations for 2026 across Pakistan. Evaluate thermal sensitivity to minimum night-time temperatures, precipitation dampening, and solar irradiance.
        </p>

        {/* Mandatory Scenario Analysis Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Important Scientific Notice:</strong> 2026 dates are used as scenario-analysis inputs. Results are model estimates based on historical weather patterns and are not official weather forecasts.
          </div>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders / Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Scenario Control Panel
            </h2>

            {/* City */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Target City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Date (2026 Season)</label>
              <input
                type="date"
                value={date}
                min="2026-01-01"
                max="2026-12-31"
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Min Temp Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Minimum Temperature</span>
                <span className="font-mono text-emerald-400 font-bold">{tempMin.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rainfall Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Rainfall</span>
                <span className="font-mono text-cyan-400 font-bold">{rain.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={rain}
                onChange={(e) => setRain(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Solar Radiation Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Solar Radiation</span>
                <span className="font-mono text-amber-400 font-bold">{solarRadiation.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="0.5"
                value={solarRadiation}
                onChange={(e) => setSolarRadiation(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Recalculating...' : 'Update Simulation'}</span>
            </button>
          </div>

          {/* Model Performance Card */}
          {currentResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                Active Model Architecture
              </h3>
              <div className="space-y-2 text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Estimator</span>
                  <span className="font-mono text-slate-200">RandomForest (150 trees)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>R² Score</span>
                  <span className="font-mono text-emerald-400 font-semibold">{currentResult.model_information.r2}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Validation MAE</span>
                  <span className="font-mono text-blue-400 font-semibold">{currentResult.model_information.mae} °C</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Historical Range</span>
                  <span className="font-mono text-slate-200">{currentResult.model_information.training_period}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Target Variable</span>
                  <span className="font-mono text-slate-200">{currentResult.model_information.target}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Comparative Charts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Simulation Readout */}
          {currentResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                    Scenario Model Output
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                    {currentResult.city} — {currentResult.date}
                  </h3>
                </div>
                <HeatRiskBadge risk={currentResult.heat_risk} size="lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Predicted Max Temp</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {currentResult.predicted_max_temperature.toFixed(1)} <span className="text-emerald-400 text-lg">°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Simulated Min Temp</span>
                  <div className="text-3xl font-extrabold text-slate-300 mt-1">
                    {currentResult.input_values.temp_min.toFixed(1)} <span className="text-slate-400 text-lg">°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Day of Year</span>
                  <div className="text-3xl font-extrabold text-slate-300 mt-1">
                    #{currentResult.input_values.day_of_year}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <RiskGauge
                  temperature={currentResult.predicted_max_temperature}
                  heatRisk={currentResult.heat_risk}
                />
              </div>

              <p className="text-xs text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60 leading-relaxed">
                <strong>Advisory:</strong> {currentResult.risk_description}
              </p>
            </div>
          )}

          {/* Regional Sensitivity Chart (Recharts) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Cross-Regional Temperature Response
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison of predicted maximum temperatures across key Pakistani cities under identical scenario inputs ({tempMin}°C min, {rain}mm rain, {solarRadiation} solar).
                </p>
              </div>
              {isComparing && (
                <span className="text-xs text-emerald-400 animate-pulse">Running scenarios...</span>
              )}
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="city" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis domain={[20, 50]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow text-xs">
                            <span className="font-bold text-white block">{d.city}</span>
                            <span className="text-slate-400">Predicted Max: </span>
                            <span className="font-bold text-emerald-400">{d.predictedMax}°C</span>
                            <div className="mt-1">
                              <HeatRiskBadge risk={d.heatRisk} size="sm" />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'EXTREME (45°C)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={40} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'HIGH (40°C)', fill: '#f97316', fontSize: 10, position: 'insideTopRight' }} />
                  <Bar dataKey="predictedMax" radius={[6, 6, 0, 0]}>
                    {cityComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.heatRisk)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-end gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> &lt;35°C (Low)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> 35-39.9°C (Moderate)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-orange-500" /> 40-44.9°C (High)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> ≥45°C (Extreme)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
