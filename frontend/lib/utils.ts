import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeatRiskColor(risk: string) {
  switch (risk?.toUpperCase()) {
    case 'EXTREME':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-700',
        dot: 'bg-red-600',
        badge: 'bg-red-700 text-white',
        borderLeft: 'border-l-red-600',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-800',
        dot: 'bg-orange-500',
        badge: 'bg-orange-600 text-white',
        borderLeft: 'border-l-orange-500',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        dot: 'bg-amber-500',
        badge: 'bg-amber-600 text-white',
        borderLeft: 'border-l-amber-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-[#01411c]',
        dot: 'bg-[#01411c]',
        badge: 'bg-[#01411c] text-white',
        borderLeft: 'border-l-[#01411c]',
      };
  }
}
