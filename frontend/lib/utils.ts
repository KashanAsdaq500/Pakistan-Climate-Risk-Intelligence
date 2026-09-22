import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeatRiskColor(risk: string) {
  switch (risk?.toUpperCase()) {
    case 'EXTREME':
      return {
        bg: 'bg-red-500/15',
        border: 'border-red-500',
        text: 'text-red-600',
        dot: 'bg-red-500',
        badge: 'bg-red-600 text-white',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/15',
        border: 'border-orange-500',
        text: 'text-orange-600',
        dot: 'bg-orange-500',
        badge: 'bg-orange-600 text-white',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500',
        text: 'text-amber-600',
        dot: 'bg-amber-500',
        badge: 'bg-amber-500 text-white',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-600 text-white',
      };
  }
}
