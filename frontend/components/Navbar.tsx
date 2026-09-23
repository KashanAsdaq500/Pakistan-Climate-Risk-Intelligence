'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  BarChart2, 
  Bot, 
  History, 
  Info, 
  Menu, 
  X 
} from 'lucide-react';
import CrescentStarLogo from './CrescentStarLogo';
import IconWrapper from './IconWrapper';
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
    <header className="sticky top-0 z-50 bg-[#01411c] text-white shadow-md shadow-emerald-950/15 border-b border-[#0b532e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <CrescentStarLogo size={36} className="transition-transform group-hover:scale-105" />
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>Pakistan Climate Risk</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/25 font-mono font-semibold">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium tracking-wide">
                Heat Risk &amp; Temperature Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-white text-[#01411c] shadow-sm font-bold'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconWrapper
                    icon={item.icon}
                    className={`w-3.5 h-3.5 ${isActive ? 'text-[#01411c]' : 'text-emerald-200'}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Status Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-[#064e24] border border-[#0b532e] text-emerald-100">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'healthy'
                    ? 'bg-emerald-400 animate-pulse'
                    : backendStatus === 'checking'
                    ? 'bg-amber-300'
                    : 'bg-red-400'
                }`}
                aria-hidden="true"
              />
              <span className="font-medium text-[11px]">
                {backendStatus === 'healthy'
                  ? 'ML & RAG Online'
                  : backendStatus === 'checking'
                  ? 'Connecting API...'
                  : 'Backend Offline'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <IconWrapper icon={isOpen ? X : Menu} className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-[#0b532e] bg-[#0b532e] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-white text-[#01411c] font-bold'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconWrapper icon={item.icon} className={`w-4 h-4 ${isActive ? 'text-[#01411c]' : 'text-emerald-200'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-200 px-3">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'healthy' ? 'bg-emerald-400' : 'bg-red-400'
              }`}
              aria-hidden="true"
            />
            <span>{backendStatus === 'healthy' ? 'API Online' : 'API Connecting / Offline'}</span>
          </div>
        </div>
      )}
    </header>
  );
}
