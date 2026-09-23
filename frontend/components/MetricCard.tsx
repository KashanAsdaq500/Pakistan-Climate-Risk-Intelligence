import React from 'react';
import { LucideIcon } from 'lucide-react';
import IconWrapper from './IconWrapper';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'green' | 'amber' | 'blue' | 'purple' | 'red';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  color = 'green'
}: MetricCardProps) {
  const colorMap = {
    green: 'bg-emerald-50 text-[#01411c] border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    red: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <IconWrapper icon={Icon} className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={trendPositive ? 'text-[#01411c] font-bold' : 'text-amber-700 font-bold'}>{trend}</span>
          <span className="text-slate-400">vs historical baseline</span>
        </div>
      )}
    </div>
  );
}
