'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  RefreshCw, 
  Database, 
  Calendar, 
  MapPin, 
  Flame,
  AlertCircle
} from 'lucide-react';
import HeatRiskBadge from '../../components/HeatRiskBadge';
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
      setError(err.message || 'Failed to load historical predictions. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            SQLite Database Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scenario Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted logs of all evaluated climate scenarios, including input parameters, model predictions, and calculated heat-risk classifications.
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          {/* City Filter */}
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-400 self-end sm:self-auto">
          Showing <span className="font-bold text-white">{records.length}</span> of{' '}
          <span className="font-bold text-white">{total}</span> records
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs">{error}</div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Scenario Date</th>
                <th className="py-3.5 px-4">Min Temp</th>
                <th className="py-3.5 px-4">Rainfall</th>
                <th className="py-3.5 px-4">Solar Rad</th>
                <th className="py-3.5 px-4">Predicted Max</th>
                <th className="py-3.5 px-4">Heat Risk</th>
                <th className="py-3.5 px-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Loading database records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No prediction records found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{rec.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{rec.city}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{rec.date}</td>
                    <td className="py-3.5 px-4 font-mono">{rec.temp_min.toFixed(1)} °C</td>
                    <td className="py-3.5 px-4 font-mono">{rec.rain.toFixed(1)} mm</td>
                    <td className="py-3.5 px-4 font-mono">{rec.solar_radiation.toFixed(1)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {rec.predicted_max_temperature.toFixed(1)} °C
                    </td>
                    <td className="py-3.5 px-4">
                      <HeatRiskBadge risk={rec.heat_risk} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
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
