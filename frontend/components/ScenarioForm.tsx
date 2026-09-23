'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  ThermometerSnowflake, 
  CloudRain, 
  Sun, 
  Sparkles,
  Loader2,
  Sliders
} from 'lucide-react';
import IconWrapper from './IconWrapper';
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
    name: 'Karachi Coastal Summer',
    city: 'Karachi',
    date: '2026-05-28',
    temp_min: 29.5,
    rain: 0.0,
    solar_radiation: 22.0
  },
  {
    name: 'Multan Thermal Peak',
    city: 'Multan',
    date: '2026-06-20',
    temp_min: 32.0,
    rain: 0.0,
    solar_radiation: 26.5
  },
  {
    name: 'Islamabad Monsoon Rain',
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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Window Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#01411c] text-white shadow-sm">
            <IconWrapper icon={Sliders} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Climate Scenario Control
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure parameters for 2026 Pakistan weather simulation
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#01411c] border border-emerald-200">
          Simulation Input
        </span>
      </div>

      {/* Reference Scenario Presets */}
      <div className="mb-6">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Historical Reference Scenarios
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#01411c] transition-all shadow-2xs"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Target City */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <IconWrapper icon={MapPin} className="w-4 h-4 text-[#01411c]" />
              <span>Target City</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Date */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <IconWrapper icon={Calendar} className="w-4 h-4 text-[#01411c]" />
              <span>Scenario Date (2026)</span>
            </label>
            <input
              type="date"
              value={date}
              min="2026-01-01"
              max="2026-12-31"
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              required
            />
          </div>

          {/* Minimum Temperature */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <IconWrapper icon={ThermometerSnowflake} className="w-4 h-4 text-blue-600" />
                <span>Minimum Temperature</span>
              </span>
              <span className="text-[#01411c] font-mono font-bold text-xs">{tempMin.toFixed(1)} °C</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="-10"
              max="45"
              value={tempMin}
              onChange={(e) => setTempMin(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              required
            />
          </div>

          {/* Rainfall */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <IconWrapper icon={CloudRain} className="w-4 h-4 text-cyan-600" />
                <span>Rainfall</span>
              </span>
              <span className="text-cyan-700 font-mono font-bold text-xs">{rain.toFixed(1)} mm</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="500"
              value={rain}
              onChange={(e) => setRain(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              required
            />
          </div>

          {/* Solar Radiation */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <IconWrapper icon={Sun} className="w-4 h-4 text-amber-600" />
                <span>Solar Radiation</span>
              </span>
              <span className="text-amber-700 font-mono font-bold text-xs">{solarRadiation.toFixed(1)}</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="40"
              value={solarRadiation}
              onChange={(e) => setSolarRadiation(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              required
            />
          </div>

        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-[#01411c] hover:bg-[#064e24] active:bg-[#0b532e] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-[#01411c]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <IconWrapper icon={Loader2} className="w-5 h-5 text-white animate-spin" />
              <span>Analyzing Climate Scenario...</span>
            </>
          ) : (
            <>
              <IconWrapper icon={Sparkles} className="w-5 h-5 text-emerald-200" />
              <span>Analyze Climate Risk</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
