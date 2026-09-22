'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Thermometer, 
  BarChart2, 
  Bot, 
  History, 
  Info, 
  Activity,
  Menu,
  X
} from 'lucide-react';
import { checkHealth } from '../lib/api';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Climate Analysis', href: '/analysis', icon: BarChart2 },
  { name: 'Climate Assistant', href: '/assistant', icon: Bot },
  { name: 'Prediction History', href: '/history', icon: History },
  { name: 'About', href: '/about', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'healthy' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    let mounted = true;
    checkHealth()
      .then(() => {
        if (mounted) setBackendStatus('healthy');
      })
      .catch(() => {
        if (mounted) setBackendStatus('offline');
      });

    const interval = setInterval(() => {
      checkHealth()
        .then(() => { if (mounted) setBackendStatus('healthy'); })
        .catch(() => { if (mounted) setBackendStatus('offline'); });
    }, 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Pakistan Climate Risk
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Heat Risk & Temperature Intelligence</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'healthy'
                    ? 'bg-emerald-500 animate-pulse'
                    : backendStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-slate-300">
                {backendStatus === 'healthy'
                  ? 'API Live (FastAPI + ML)'
                  : backendStatus === 'checking'
                  ? 'Connecting...'
                  : 'Backend Offline'}
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 px-3">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            {backendStatus === 'healthy' ? 'API Online' : 'API Connecting / Offline'}
          </div>
        </div>
      )}
    </header>
  );
}
