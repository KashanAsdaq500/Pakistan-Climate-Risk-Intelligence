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
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      <span>{risk?.toUpperCase()} RISK</span>
    </span>
  );
}
