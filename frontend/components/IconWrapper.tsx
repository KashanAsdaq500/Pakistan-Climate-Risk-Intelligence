import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

export default function IconWrapper({ icon: Icon, className = 'w-4 h-4', size }: IconWrapperProps) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center select-none" aria-hidden="true">
      <Icon className={className} size={size} aria-hidden="true" focusable="false" />
    </span>
  );
}
