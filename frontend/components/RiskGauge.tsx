import React from 'react';
import { HeatRiskLevel } from '../types';

interface RiskGaugeProps {
  temperature: number;
  heatRisk: HeatRiskLevel | string;
}

export default function RiskGauge({ temperature, heatRisk }: RiskGaugeProps) {
  // Normalize temperature: range from 20°C to 50°C
  const minTemp = 20;
  const maxTemp = 50;
  const clampedTemp = Math.min(Math.max(temperature, minTemp), maxTemp);
  const percentage = Math.min(Math.max(((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100, 2), 98);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
          Temperature-Based Thermal Scale
        </span>
        <span className="font-mono text-slate-900 font-extrabold text-sm">
          {temperature.toFixed(1)} °C
        </span>
      </div>

      {/* Bar Gauge Container */}
      <div className="relative pt-6 pb-2">
        {/* Needle pointer */}
        <div
          className="absolute top-0 transition-all duration-500 transform -translate-x-1/2 flex flex-col items-center z-10"
          style={{ left: `${percentage}%` }}
        >
          <div className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#01411c] text-white shadow-md border border-emerald-400/30 font-mono">
            {temperature.toFixed(1)}°C
          </div>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#01411c]" />
        </div>

        {/* Multi-segment Gauge track */}
        <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200 p-0.5 border border-slate-300 shadow-inner">
          <div className="h-full bg-emerald-600 rounded-l-full" style={{ width: '50%' }} title="LOW (<35°C)" />
          <div className="h-full bg-amber-500" style={{ width: '16.7%' }} title="MODERATE (35-39.9°C)" />
          <div className="h-full bg-orange-500" style={{ width: '16.7%' }} title="HIGH (40-44.9°C)" />
          <div className="h-full bg-red-600 rounded-r-full" style={{ width: '16.6%' }} title="EXTREME (≥45°C)" />
        </div>
      </div>

      {/* Threshold Labels */}
      <div className="grid grid-cols-4 gap-1 text-[11px] text-center pt-2 border-t border-slate-100">
        <div className="bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-200/50">
          <span className="text-[#01411c] font-extrabold block">LOW</span>
          <span className="text-slate-500 text-[10px]">&lt; 35.0 °C</span>
        </div>
        <div className="bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/50">
          <span className="text-amber-800 font-extrabold block">MODERATE</span>
          <span className="text-slate-500 text-[10px]">35 – 39.9 °C</span>
        </div>
        <div className="bg-orange-50/60 p-1.5 rounded-lg border border-orange-200/50">
          <span className="text-orange-800 font-extrabold block">HIGH</span>
          <span className="text-slate-500 text-[10px]">40 – 44.9 °C</span>
        </div>
        <div className="bg-red-50/60 p-1.5 rounded-lg border border-red-200/50">
          <span className="text-red-700 font-extrabold block">EXTREME</span>
          <span className="text-slate-500 text-[10px]">≥ 45.0 °C</span>
        </div>
      </div>
    </div>
  );
}
