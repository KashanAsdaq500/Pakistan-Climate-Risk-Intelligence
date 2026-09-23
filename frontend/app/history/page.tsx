'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  RefreshCw, 
  Database, 
  MapPin, 
  Flame,
  AlertCircle
} from 'lucide-react';
import HeatRiskBadge from '../../components/HeatRiskBadge';
import IconWrapper from '../../components/IconWrapper';
import { fetchPredictionHistory } from '../../lib/api';
import { HistoryRecord } from '../../types';

const CITIES = [
  'All Cities',
  'Abbottabad', 'Bahawalpur', 'Faisalabad', 'Gilgit', 'Gwadar',
  'Hyderabad', 'Islamabad', 'Karachi', 'Lahore', 'Multan',
  'Quetta', 'Rawalpindi', 'Sialkot', 'Skardu', 'Sukkur'
];

const RISK_LEVELS = ['ALL RISKS', 'LOW', 'MODERATE', 'HIGH', 'EXTREME'];

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedRisk, setSelectedRisk] = useState('ALL RISKS');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [selectedCity, selectedRisk]);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPredictionHistory({
        limit: 100,
        city: selectedCity === 'All Cities' ? undefined : selectedCity,
        heat_risk: selectedRisk === 'ALL RISKS' ? undefined : selectedRisk,
      });
      setRecords(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load historical predictions. Please ensure FastAPI backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Window */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#01411c]">
            <IconWrapper icon={Database} className="w-3.5 h-3.5 text-[#01411c]" />
            <span>Cloud Database Audit Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scenario Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Persisted logs of all evaluated climate scenarios, including input conditions, model outputs, and calculated heat-risk classifications.
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-[#01411c] text-xs font-bold transition-all shadow-2xs"
        >
          <IconWrapper icon={RefreshCw} className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#01411c]' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter Window */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          
          {/* City Filter */}
          <div className="flex items-center gap-2 text-xs">
            <IconWrapper icon={MapPin} className="w-4 h-4 text-[#01411c]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <IconWrapper icon={Flame} className="w-4 h-4 text-amber-600" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c]"
            >
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-500 self-end sm:self-auto font-medium">
          Showing <span className="font-bold text-[#01411c]">{records.length}</span> of{' '}
          <span className="font-bold text-slate-800">{total}</span> total logs
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <IconWrapper icon={AlertCircle} className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">{error}</div>
        </div>
      )}

      {/* History Table Window */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#01411c] border-b border-[#064e24] text-white uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-4 px-4">Record ID</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Scenario Date</th>
                <th className="py-4 px-4">Min Temp</th>
                <th className="py-4 px-4">Rainfall</th>
                <th className="py-4 px-4">Solar Rad</th>
                <th className="py-4 px-4">Predicted Max</th>
                <th className="py-4 px-4">Heat Risk</th>
                <th className="py-4 px-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <IconWrapper icon={RefreshCw} className="w-6 h-6 animate-spin mx-auto mb-2 text-[#01411c]" />
                    <span className="font-semibold">Loading database records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <IconWrapper icon={History} className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span className="font-semibold">No prediction records found matching the selected filter criteria.</span>
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{rec.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{rec.city}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{rec.date}</td>
                    <td className="py-3.5 px-4 font-mono">{rec.temp_min.toFixed(1)} °C</td>
                    <td className="py-3.5 px-4 font-mono">{rec.rain.toFixed(1)} mm</td>
                    <td className="py-3.5 px-4 font-mono">{rec.solar_radiation.toFixed(1)}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-[#01411c] text-sm">
                      {rec.predicted_max_temperature.toFixed(1)} °C
                    </td>
                    <td className="py-3.5 px-4">
                      <HeatRiskBadge risk={rec.heat_risk} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                      {new Date(rec.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
