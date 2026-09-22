import React from 'react';
import { 
  Info, 
  ShieldAlert, 
  Cpu, 
  Database, 
  BookOpen, 
  Layers, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
          <Info className="w-3.5 h-3.5" />
          Project Methodology &amp; Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About Pakistan Climate Risk Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          An enterprise-grade full-stack research platform integrating machine learning temperature prediction and authoritative RAG climate guidance.
        </p>
      </div>

      {/* Mandatory Research Notice Card */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          Academic &amp; Portfolio Research Scope
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          This system is an academic engineering and portfolio project designed to demonstrate full-stack AI system architecture, machine learning inference, retrieval-augmented generation (RAG), and relational data auditing.
        </p>
        <ul className="text-xs space-y-1 list-disc list-inside text-slate-300 pt-1">
          <li><strong>Historical Weather Observations:</strong> Cleaned 10-year observational datasets (2013–2023) across 15 major Pakistani cities were utilized for model training.</li>
          <li><strong>2026 Scenario Analysis:</strong> Dates within 2026 serve strictly as scenario-analysis parameter inputs.</li>
          <li><strong>No Official Forecasting:</strong> The platform does <em>not</em> issue official meteorological forecasts or emergency government warnings. For operational advisories, consult the <strong>Pakistan Meteorological Department (PMD)</strong> and <strong>NDMA Pakistan</strong>.</li>
        </ul>
      </div>

      {/* Technical Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          System Architecture &amp; Tech Stack
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              Machine Learning Pipeline
            </div>
            <p className="text-slate-400 leading-relaxed">
              Trained <strong>RandomForestRegressor</strong> with 150 estimators and maximum depth of 15. Evaluates features including minimum temperature, rainfall, solar radiation, and sine/cosine cyclical date transforms.
            </p>
            <div className="pt-2 text-slate-300 font-mono text-[11px]">
              R² Score: 0.9708 • MAE: 1.27 °C
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <BookOpen className="w-4 h-4" />
              RAG Knowledge Engine
            </div>
            <p className="text-slate-400 leading-relaxed">
              BM25 / TF-IDF retrieval index built over authoritative publications from PMD, NDMA Pakistan, WHO, NASA, and IPCC. Operates with local high-precision extractive retrieval out-of-the-box and optional LLM synthesis.
            </p>
            <div className="pt-2 text-slate-300 font-mono text-[11px]">
              5 Authoritative Sources • 21 Indexed Chunks
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              FastAPI &amp; SQLAlchemy Database
            </div>
            <p className="text-slate-400 leading-relaxed">
              High-performance asynchronous backend written with FastAPI, Pydantic v2 validation, and SQLAlchemy ORM. Local development uses SQLite; fully PostgreSQL-ready for production deployments.
            </p>
            <div className="pt-2 text-slate-300 font-mono text-[11px]">
              Auditing Every Inference with Created Timestamp
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              Next.js 14 &amp; Tailwind Frontend
            </div>
            <p className="text-slate-400 leading-relaxed">
              Engineered with TypeScript, Tailwind CSS, Lucide icons, and Recharts. Implements responsive layouts, thermal gauge visualizers, real-time health connectivity, and multi-variable scenario modeling.
            </p>
            <div className="pt-2 text-slate-300 font-mono text-[11px]">
              Clean separation of ML predictions and RAG insights
            </div>
          </div>

        </div>
      </div>

      {/* Temperature-Based Heat Risk Tiers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Temperature-Based Heat Risk Tiers
        </h3>
        <p className="text-xs text-slate-400">
          The heat-risk metric in this application is strictly defined as a <em>temperature-based threshold indicator</em>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
            <span className="font-bold text-emerald-400 block">LOW RISK</span>
            <span className="text-slate-300 font-mono">&lt; 35.0 °C</span>
            <p className="text-[11px] text-slate-400 pt-1">Standard baseline daytime temperatures.</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-1">
            <span className="font-bold text-amber-400 block">MODERATE RISK</span>
            <span className="text-slate-300 font-mono">35.0 – 39.9 °C</span>
            <p className="text-[11px] text-slate-400 pt-1">Elevated thermal discomfort; hydration needed.</p>
          </div>
          <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/40 space-y-1">
            <span className="font-bold text-orange-400 block">HIGH RISK</span>
            <span className="text-slate-300 font-mono">40.0 – 44.9 °C</span>
            <p className="text-[11px] text-slate-400 pt-1">Risk of heat exhaustion during outdoor exposure.</p>
          </div>
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 space-y-1">
            <span className="font-bold text-red-400 block">EXTREME RISK</span>
            <span className="text-slate-300 font-mono">≥ 45.0 °C</span>
            <p className="text-[11px] text-slate-400 pt-1">Critical danger of heatstroke; cooling imperative.</p>
          </div>
        </div>
      </div>

      {/* Authoritative Sources Bibliography */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs">
        <h3 className="text-base font-bold text-white tracking-tight">
          Authoritative References
        </h3>
        <div className="space-y-2 text-slate-400">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Pakistan Meteorological Department (PMD):</strong> National Heatwave Early Warning Center technical thresholds and regional climatology.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>National Disaster Management Authority (NDMA) Pakistan:</strong> National Heatwave Management Guidelines and SOPs for cooling stations and public health alert levels.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>World Health Organization (WHO):</strong> Public health guidance on preventing health impacts of heat, thermal physiology, and clinical heat illness definitions.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>NASA Earth Observatory:</strong> Remote sensing of Land Surface Temperature (LST), Urban Heat Islands (UHI), and albedo dynamics.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>IPCC Sixth Assessment Report (AR6):</strong> Working Groups I &amp; II assessments on South Asian regional warming and compound extreme events.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
