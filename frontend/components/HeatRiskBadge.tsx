import React from 'react';
import { formatHeatRiskColor } from '../lib/utils';
import { HeatRiskLevel } from '../types';

interface HeatRiskBadgeProps {
  risk: HeatRiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export default function HeatRiskBadge({ risk, size = 'md', showDot = true }: HeatRiskBadgeProps) {
  const styles = formatHeatRiskColor(risk);
  
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3 py-1 font-bold tracking-wide shadow-sm',
    lg: 'text-sm px-4 py-1.5 font-extrabold tracking-wider shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
        </span>
      )}
      <span>{risk?.toUpperCase()} RISK</span>
    </span>
  );
}
