import React from 'react';
import { 
  Info, 
  ShieldAlert, 
  Cpu, 
  Database, 
  BookOpen, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import IconWrapper from '../../components/IconWrapper';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Window */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#01411c]">
          <IconWrapper icon={Info} className="w-3.5 h-3.5 text-[#01411c]" />
          <span>Project Methodology &amp; Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About Pakistan Climate Risk Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          An enterprise-grade full-stack research platform integrating machine learning temperature prediction with authoritative RAG climate guidance.
        </p>
      </div>

      {/* Mandatory Research Notice Card */}
      <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-[#01411c] font-extrabold text-sm">
          <IconWrapper icon={ShieldAlert} className="w-5 h-5 text-[#01411c]" />
          <span>Academic &amp; Portfolio Research Scope</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-700">
          This system is an academic engineering and portfolio project designed to demonstrate full-stack AI system architecture, machine learning inference, retrieval-augmented generation (RAG), and relational data auditing.
        </p>
        <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-700 pt-1">
          <li><strong>Historical Weather Observations:</strong> Cleaned 10-year observational datasets (2013–2023) across 15 major Pakistani cities were utilized for model training.</li>
          <li><strong>2026 Scenario Analysis:</strong> Dates within 2026 serve strictly as scenario-analysis parameter inputs.</li>
          <li><strong>No Official Forecasting:</strong> The platform does <em>not</em> issue official meteorological forecasts or emergency government warnings. For operational advisories, consult the <strong>Pakistan Meteorological Department (PMD)</strong> and <strong>NDMA Pakistan</strong>.</li>
        </ul>
      </div>

      {/* Technical Architecture Windows */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <IconWrapper icon={Layers} className="w-5 h-5 text-[#01411c]" />
          <span>System Architecture &amp; Tech Stack</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#01411c] font-bold text-sm">
              <IconWrapper icon={Cpu} className="w-4 h-4 text-[#01411c]" />
              <span>Machine Learning Pipeline</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Trained <strong>RandomForestRegressor</strong> with 150 estimators and maximum depth of 15. Evaluates features including minimum temperature, rainfall, solar radiation, and sine/cosine cyclical date transforms.
            </p>
            <div className="pt-2 text-slate-800 font-mono text-[11px] font-bold">
              R² Score: 0.9708 • MAE: 1.27 °C
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <IconWrapper icon={BookOpen} className="w-4 h-4 text-blue-700" />
              <span>RAG Knowledge Engine</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              BM25 / TF-IDF retrieval index built over authoritative publications from PMD, NDMA Pakistan, WHO, NASA, and IPCC. Operates with local high-precision extractive retrieval out-of-the-box and optional LLM synthesis.
            </p>
            <div className="pt-2 text-slate-800 font-mono text-[11px] font-bold">
              5 Authoritative Sources • 21 Indexed Chunks
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <IconWrapper icon={Database} className="w-4 h-4 text-purple-700" />
              <span>FastAPI &amp; SQLAlchemy Database</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              High-performance asynchronous backend written with FastAPI, Pydantic v2 validation, and SQLAlchemy ORM. Production audit logs and scenario records are persisted in Supabase PostgreSQL (with SQLite fallback for local development).
            </p>
            <div className="pt-2 text-slate-800 font-mono text-[11px] font-bold">
              Auditing Every Inference with Created Timestamp
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <IconWrapper icon={Layers} className="w-4 h-4 text-amber-700" />
              <span>Next.js 14 &amp; Tailwind Frontend</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Engineered with TypeScript, Tailwind CSS, Lucide icons, and Recharts. Implements responsive layouts, thermal gauge visualizers, real-time health connectivity, and multi-variable scenario modeling.
            </p>
            <div className="pt-2 text-slate-800 font-mono text-[11px] font-bold">
              Strict separation of ML predictions and RAG insights
            </div>
          </div>

        </div>
      </div>

      {/* Temperature-Based Heat Risk Tiers Window */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Temperature-Based Heat Risk Tiers
        </h3>
        <p className="text-xs text-slate-600">
          The heat-risk metric in this application is strictly defined as a <em>temperature-based threshold indicator</em>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
            <span className="font-extrabold text-[#01411c] block">LOW RISK</span>
            <span className="text-slate-800 font-mono font-bold">&lt; 35.0 °C</span>
            <p className="text-[11px] text-slate-600 pt-1">Standard baseline daytime temperatures.</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <span className="font-extrabold text-amber-800 block">MODERATE RISK</span>
            <span className="text-slate-800 font-mono font-bold">35.0 – 39.9 °C</span>
            <p className="text-[11px] text-slate-600 pt-1">Elevated thermal discomfort; hydration needed.</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-1">
            <span className="font-extrabold text-orange-800 block">HIGH RISK</span>
            <span className="text-slate-800 font-mono font-bold">40.0 – 44.9 °C</span>
            <p className="text-[11px] text-slate-600 pt-1">Risk of heat exhaustion during outdoor exposure.</p>
          </div>
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-1">
            <span className="font-extrabold text-red-700 block">EXTREME RISK</span>
            <span className="text-slate-800 font-mono font-bold">≥ 45.0 °C</span>
            <p className="text-[11px] text-slate-600 pt-1">Critical danger of heatstroke; cooling imperative.</p>
          </div>
        </div>
      </div>

      {/* Authoritative Sources Bibliography Window */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-sm text-xs">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Authoritative References
        </h3>
        <div className="space-y-2.5 text-slate-600">
          <div className="flex items-start gap-2.5">
            <IconWrapper icon={CheckCircle2} className="w-4 h-4 text-[#01411c] mt-0.5" />
            <div>
              <strong className="text-slate-800">Pakistan Meteorological Department (PMD):</strong> National Heatwave Early Warning Center technical thresholds and regional climatology.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <IconWrapper icon={CheckCircle2} className="w-4 h-4 text-[#01411c] mt-0.5" />
            <div>
              <strong className="text-slate-800">National Disaster Management Authority (NDMA) Pakistan:</strong> National Heatwave Management Guidelines and SOPs for cooling stations and public health alert levels.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <IconWrapper icon={CheckCircle2} className="w-4 h-4 text-[#01411c] mt-0.5" />
            <div>
              <strong className="text-slate-800">World Health Organization (WHO):</strong> Public health guidance on preventing health impacts of heat, thermal physiology, and clinical heat illness definitions.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <IconWrapper icon={CheckCircle2} className="w-4 h-4 text-[#01411c] mt-0.5" />
            <div>
              <strong className="text-slate-800">NASA Earth Observatory:</strong> Remote sensing of Land Surface Temperature (LST), Urban Heat Islands (UHI), and albedo dynamics.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <IconWrapper icon={CheckCircle2} className="w-4 h-4 text-[#01411c] mt-0.5" />
            <div>
              <strong className="text-slate-800">IPCC Sixth Assessment Report (AR6):</strong> Working Groups I &amp; II assessments on South Asian regional warming and compound extreme events.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
