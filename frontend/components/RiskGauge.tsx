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
  const percentage = ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100;

  const tiers = [
    { label: 'LOW', range: '<35°C', color: 'bg-emerald-500', width: '50%' }, // 20 to 35 = 15/30 = 50%
    { label: 'MOD', range: '35–39.9°C', color: 'bg-amber-500', width: '16.6%' }, // 35 to 40 = 5/30 = 16.6%
    { label: 'HIGH', range: '40–44.9°C', color: 'bg-orange-500', width: '16.6%' }, // 40 to 45 = 5/30 = 16.6%
    { label: 'EXTR', range: '≥45°C', color: 'bg-red-500', width: '16.8%' }, // 45 to 50 = 5/30 = 16.8%
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-300">Temperature Thermal Scale</span>
        <span className="font-mono text-white font-semibold">{temperature.toFixed(1)} °C</span>
      </div>

      {/* Bar Gauge */}
      <div className="relative pt-4 pb-2">
        {/* Needle pointer */}
        <div
          className="absolute -top-1 transition-all duration-500 transform -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${percentage}%` }}
        >
          <div className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-slate-900 shadow">
            {temperature.toFixed(1)}°C
          </div>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white" />
        </div>

        {/* Multi-segment Gauge track */}
        <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-800 p-0.5 border border-slate-700">
          <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '50%' }} title="LOW (<35°C)" />
          <div className="h-full bg-amber-500" style={{ width: '16.7%' }} title="MODERATE (35-39.9°C)" />
          <div className="h-full bg-orange-500" style={{ width: '16.7%' }} title="HIGH (40-44.9°C)" />
          <div className="h-full bg-red-500 rounded-r-full" style={{ width: '16.6%' }} title="EXTREME (≥45°C)" />
        </div>
      </div>

      {/* Threshold Labels */}
      <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 border-t border-slate-800">
        <div>
          <span className="text-emerald-400 font-bold block">LOW</span>
          <span className="text-slate-500">&lt; 35°C</span>
        </div>
        <div>
          <span className="text-amber-400 font-bold block">MODERATE</span>
          <span className="text-slate-500">35 – 39.9°C</span>
        </div>
        <div>
          <span className="text-orange-400 font-bold block">HIGH</span>
          <span className="text-slate-500">40 – 44.9°C</span>
        </div>
        <div>
          <span className="text-red-400 font-bold block">EXTREME</span>
          <span className="text-slate-500">≥ 45°C</span>
        </div>
      </div>
    </div>
  );
}
