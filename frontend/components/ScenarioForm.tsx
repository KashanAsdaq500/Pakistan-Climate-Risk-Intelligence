'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  ThermometerSnowflake, 
  CloudRain, 
  Sun, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { PredictionInput } from '../types';

interface ScenarioFormProps {
  onAnalyze: (input: PredictionInput) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<PredictionInput>;
}

const PAKISTAN_CITIES = [
  'Abbottabad',
  'Bahawalpur',
  'Faisalabad',
  'Gilgit',
  'Gwadar',
  'Hyderabad',
  'Islamabad',
  'Karachi',
  'Lahore',
  'Multan',
  'Quetta',
  'Rawalpindi',
  'Sialkot',
  'Skardu',
  'Sukkur'
];

const PRESETS = [
  {
    name: 'Lahore Pre-Monsoon Heatwave',
    city: 'Lahore',
    date: '2026-06-12',
    temp_min: 30.0,
    rain: 0.0,
    solar_radiation: 25.0
  },
  {
    name: 'Karachi High Humidity Summer',
    city: 'Karachi',
    date: '2026-05-28',
    temp_min: 29.5,
    rain: 0.0,
    solar_radiation: 22.0
  },
  {
    name: 'Multan Extreme Thermal Peak',
    city: 'Multan',
    date: '2026-06-20',
    temp_min: 32.0,
    rain: 0.0,
    solar_radiation: 26.5
  },
  {
    name: 'Islamabad Monsoon Transition',
    city: 'Islamabad',
    date: '2026-07-25',
    temp_min: 24.0,
    rain: 18.5,
    solar_radiation: 14.0
  }
];

export default function ScenarioForm({ onAnalyze, isLoading, initialValues }: ScenarioFormProps) {
  const [city, setCity] = useState<string>(initialValues?.city || 'Lahore');
  const [date, setDate] = useState<string>(initialValues?.date || '2026-06-15');
  const [tempMin, setTempMin] = useState<number>(initialValues?.temp_min ?? 26.5);
  const [rain, setRain] = useState<number>(initialValues?.rain ?? 0.0);
  const [solarRadiation, setSolarRadiation] = useState<number>(initialValues?.solar_radiation ?? 20.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      city,
      date,
      temp_min: Number(tempMin),
      rain: Number(rain),
      solar_radiation: Number(solarRadiation),
    });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setCity(preset.city);
    setDate(preset.date);
    setTempMin(preset.temp_min);
    setRain(preset.rain);
    setSolarRadiation(preset.solar_radiation);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            2026 Scenario Parameters
          </h2>
          <p className="text-xs text-slate-400">
            Configure climate variables for Pakistan temperature &amp; heat-risk model inference.
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Historical Reference Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* City Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Pakistan City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Scenario Date (2026)
            </label>
            <input
              type="date"
              value={date}
              min="2026-01-01"
              max="2026-12-31"
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Min Temp */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-blue-400" />
                Minimum Temperature (°C)
              </span>
              <span className="text-slate-400 font-mono">{tempMin}°C</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="-10"
              max="45"
              value={tempMin}
              onChange={(e) => setTempMin(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Rainfall */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                Rainfall (mm)
              </span>
              <span className="text-slate-400 font-mono">{rain} mm</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="500"
              value={rain}
              onChange={(e) => setRain(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Solar Radiation */}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                Solar Radiation (MJ/m²)
              </span>
              <span className="text-slate-400 font-mono">{solarRadiation}</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="40"
              value={solarRadiation}
              onChange={(e) => setSolarRadiation(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Climate Risk Scenario...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Climate Risk</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
