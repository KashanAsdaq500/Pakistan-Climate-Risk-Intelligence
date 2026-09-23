import React from 'react';

interface CrescentStarLogoProps {
  className?: string;
  size?: number;
}

export default function CrescentStarLogo({ className = '', size = 28 }: CrescentStarLogoProps) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center select-none ${className}`} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        {/* Deep Pakistan green rounded badge base */}
        <rect
          width="100"
          height="100"
          rx="22"
          fill="#01411C"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="3"
        />

        {/* Pure white Pakistan flag crescent moon */}
        <path
          d="M 39.0 26.9 A 28 28 0 1 0 73.1 61.0 A 24.5 24.5 0 1 1 39.0 26.9 Z"
          fill="#FFFFFF"
        />

        {/* Pure white Pakistan flag five-pointed star pointing toward upper-fly */}
        <polygon
          points="70.7,29.3 67.6,35.4 72.5,40.3 65.6,39.2 62.5,45.4 61.4,38.6 54.6,37.5 60.8,34.4 59.7,27.5 64.6,32.4"
          fill="#FFFFFF"
        />
      </svg>
    </span>
  );
}
