import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Disclaimer Card */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-300">
            <span className="font-semibold text-white">Scientific Scenario Disclaimer:</span>{' '}
            <span>
              This is an academic research and portfolio project. 2026 dates are used strictly as scenario-analysis inputs.
              Results are statistical estimates from a RandomForest model trained on historical weather observations (2013–2023).
              This application does <strong>not</strong> provide official weather forecasts, early warnings, or emergency declarations.
              Refer to the <strong>Pakistan Meteorological Department (PMD)</strong> and <strong>NDMA Pakistan</strong> for official advisories.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>Pakistan Climate Risk Intelligence — 2026</span>
            <span>•</span>
            <span>FastAPI • Next.js • SQLite • RAG • Scikit-Learn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Methodology & Sources
            </Link>
            <a 
              href="https://pmd.gov.pk" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              PMD Official <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://ndma.gov.pk" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              NDMA Pakistan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
