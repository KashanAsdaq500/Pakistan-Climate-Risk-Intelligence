'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sliders, 
  Sparkles, 
  Database,
  Info,
  Activity,
  MapPin,
  Calendar,
  CloudRain,
  Sun,
  ThermometerSnowflake,
  Loader2
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
import IconWrapper from '../../components/IconWrapper';
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

      // Run multi-city benchmark comparison
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
        // Continue loop if single city prediction errors
      }
    }
    setCityComparisonData(results);
    setIsComparing(false);
  };

  const getBarColor = (risk: string) => {
    switch (risk) {
      case 'EXTREME': return '#dc2626';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#f59e0b';
      case 'LOW':
      default: return '#01411c';
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#01411c]">
          <IconWrapper icon={BarChart3} className="w-3.5 h-3.5 text-[#01411c]" />
          <span>Multi-Variable Climate Scenario Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Climate Scenario Analysis &amp; Modeling
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Simulate environmental permutations for 2026 across Pakistan. Evaluate thermal sensitivity to minimum night-time temperatures, precipitation dampening, and solar irradiance.
        </p>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-[#01411c] text-xs flex items-start gap-3">
          <div className="p-1 rounded-lg bg-[#01411c] text-white shrink-0 mt-0.5">
            <IconWrapper icon={Info} className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-relaxed">
            <strong className="font-bold">Scenario Analysis Notice:</strong> 2026 dates are used as scenario-analysis inputs. Results are model estimates based on historical weather patterns (2013–2023) and are not official weather forecasts.
          </div>
        </div>
      </div>

      {/* Grid containing Window 1 and Window 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================================= */}
        {/* WINDOW 1: SCENARIO CONTROL PANEL                                        */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#01411c] text-white shadow-2xs">
                <IconWrapper icon={Sliders} className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Scenario Control Panel
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">Fine-tune scenario inputs</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Variables
            </span>
          </div>

          <div className="space-y-4">
            {/* City */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <IconWrapper icon={MapPin} className="w-3.5 h-3.5 text-[#01411c]" />
                <span>Target City</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <IconWrapper icon={Calendar} className="w-3.5 h-3.5 text-[#01411c]" />
                <span>Date (2026 Season)</span>
              </label>
              <input
                type="date"
                value={date}
                min="2026-01-01"
                max="2026-12-31"
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              />
            </div>

            {/* Minimum Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <IconWrapper icon={ThermometerSnowflake} className="w-3.5 h-3.5 text-blue-600" />
                  <span>Minimum Temperature</span>
                </span>
                <span className="font-mono text-[#01411c]">{tempMin.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(parseFloat(e.target.value))}
                className="w-full accent-[#01411c] bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rainfall Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <IconWrapper icon={CloudRain} className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Rainfall</span>
                </span>
                <span className="font-mono text-cyan-700">{rain.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={rain}
                onChange={(e) => setRain(parseFloat(e.target.value))}
                className="w-full accent-cyan-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Solar Radiation Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <IconWrapper icon={Sun} className="w-3.5 h-3.5 text-amber-600" />
                  <span>Solar Radiation</span>
                </span>
                <span className="font-mono text-amber-700">{solarRadiation.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="0.5"
                value={solarRadiation}
                onChange={(e) => setSolarRadiation(parseFloat(e.target.value))}
                className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={runAnalysis}
              disabled={isLoading}
              className="w-full mt-2 bg-[#01411c] hover:bg-[#064e24] active:bg-[#0b532e] text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <IconWrapper icon={Loader2} className="w-4 h-4 text-white animate-spin" />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <IconWrapper icon={Sparkles} className="w-4 h-4 text-emerald-200" />
                  <span>Update Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* WINDOW 2: SCENARIO MODEL OUTPUT                                         */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          {currentResult ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Scenario Model Output
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {currentResult.city} — {currentResult.date}
                  </h3>
                </div>
                <HeatRiskBadge risk={currentResult.heat_risk} size="lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Predicted Max</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#01411c] mt-1 font-mono">
                    {currentResult.predicted_max_temperature.toFixed(1)} <span className="text-base font-bold text-emerald-700">°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Simulated Min</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 font-mono">
                    {currentResult.input_values.temp_min.toFixed(1)} <span className="text-base font-bold text-slate-500">°C</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Day of Year</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 font-mono">
                    #{currentResult.input_values.day_of_year}
                  </div>
                </div>
              </div>

              {/* Thermal Scale Bar */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <RiskGauge
                  temperature={currentResult.predicted_max_temperature}
                  heatRisk={currentResult.heat_risk}
                />
              </div>

              {/* Advisory description */}
              <p className="text-xs text-slate-700 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 leading-relaxed">
                <strong className="text-[#01411c]">Advisory Assessment:</strong> {currentResult.risk_description}
              </p>

              {/* Model Specifications */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-700 flex items-center gap-2">
                  <IconWrapper icon={Database} className="w-4 h-4 text-[#01411c]" />
                  <span>Model Specifications</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Algorithm</span>
                    <span className="font-bold text-slate-800">RandomForest</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">R² Score</span>
                    <span className="font-bold font-mono text-[#01411c]">{currentResult.model_information.r2}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Validation MAE</span>
                    <span className="font-bold font-mono text-blue-700">{currentResult.model_information.mae} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Training Range</span>
                    <span className="font-bold text-slate-800">2013 → 2023</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">Loading scenario output...</div>
          )}
        </div>

      </div>

      {/* ======================================================================= */}
      {/* WINDOW 3: CROSS-REGIONAL TEMPERATURE RESPONSE (LARGE DEDICATED WINDOW)   */}
      {/* ======================================================================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#01411c] uppercase tracking-wider mb-1">
              <IconWrapper icon={Activity} className="w-4 h-4 text-[#01411c]" />
              <span>Comparative Regional Analysis</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Cross-Regional Temperature Response
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated maximum daytime temperatures across Pakistani benchmark stations under identical scenario conditions ({tempMin}°C min temp, {rain}mm rain, {solarRadiation} solar irradiance).
            </p>
          </div>
          {isComparing && (
            <span className="text-xs font-bold text-[#01411c] animate-pulse bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
              Simulating across stations...
            </span>
          )}
        </div>

        {/* Large dedicated chart container */}
        <div className="h-80 sm:h-96 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityComparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="city" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} dy={8} />
              <YAxis domain={[20, 50]} stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-300 p-3 rounded-xl shadow-lg text-xs space-y-1">
                        <span className="font-extrabold text-slate-900 text-sm block">{d.city}</span>
                        <div className="text-slate-600">
                          <span>Predicted Max: </span>
                          <span className="font-mono font-bold text-[#01411c] text-sm">{d.predictedMax}°C</span>
                        </div>
                        <div className="pt-1">
                          <HeatRiskBadge risk={d.heatRisk} size="sm" />
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={45} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'EXTREME (≥45°C)', fill: '#dc2626', fontSize: 11, fontWeight: 700, position: 'insideTopRight' }} />
              <ReferenceLine y={40} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'HIGH (40°C)', fill: '#f97316', fontSize: 11, fontWeight: 700, position: 'insideTopRight' }} />
              <Bar dataKey="predictedMax" radius={[8, 8, 0, 0]}>
                {cityComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.heatRisk)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-end gap-5 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-[#01411c]" aria-hidden="true" />
            <span>&lt; 35.0 °C (Low)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-amber-500" aria-hidden="true" />
            <span>35 – 39.9 °C (Moderate)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-orange-500" aria-hidden="true" />
            <span>40 – 44.9 °C (High)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-600" aria-hidden="true" />
            <span>≥ 45.0 °C (Extreme)</span>
          </span>
        </div>

      </section>

    </div>
  );
}
