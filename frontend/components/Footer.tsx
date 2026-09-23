import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import IconWrapper from './IconWrapper';
import CrescentStarLogo from './CrescentStarLogo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Scientific Scenario Disclaimer Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-slate-800 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-xl bg-[#01411c] text-white shrink-0 mt-0.5">
            <IconWrapper icon={ShieldAlert} className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1 leading-relaxed text-xs">
            <span className="font-bold text-[#01411c] text-sm block">Scientific Scenario Disclaimer:</span>
            <p className="text-slate-700">
              This is an academic research and AI engineering portfolio project. 2026 dates are used strictly as scenario-analysis inputs.
              Results are statistical estimates from a RandomForest model trained on historical weather observations (2013–2023).
              This application does <strong>not</strong> provide official weather forecasts, early warnings, or emergency declarations.
              Refer to the <strong>Pakistan Meteorological Department (PMD)</strong> and <strong>NDMA Pakistan</strong> for official advisories.
            </p>
          </div>
        </div>

        {/* Footer Meta & External Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2.5">
            <CrescentStarLogo size={20} />
            <span className="font-semibold text-slate-700">Pakistan Climate Risk Intelligence — 2026</span>
            <span>•</span>
            <span>FastAPI • Next.js • PostgreSQL • RAG • Scikit-Learn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#01411c] font-medium transition-colors">
              Methodology &amp; Sources
            </Link>
            <a 
              href="https://pmd.gov.pk" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 hover:text-[#01411c] font-medium transition-colors"
            >
              <span>PMD Official</span>
              <IconWrapper icon={ExternalLink} className="w-3 h-3" />
            </a>
            <a 
              href="https://ndma.gov.pk" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 hover:text-[#01411c] font-medium transition-colors"
            >
              <span>NDMA Pakistan</span>
              <IconWrapper icon={ExternalLink} className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
