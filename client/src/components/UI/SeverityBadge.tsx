import React from 'react';
import { SeverityLevel } from '../../types';
import { SEVERITY_CONFIG } from '../../config/domains';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  showLabel = true,
  size = 'sm',
}) => {
  const config = SEVERITY_CONFIG[severity];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium ${sizeClass} ${config.pulse ? 'animate-pulse-orbit' : ''}`}
      style={{
        color: config.hex,
        borderColor: `${config.hex}40`,
        background: `${config.hex}15`,
      }}
    >
      <span className="font-bold">{severity}</span>
      {showLabel && <span className="opacity-80">/ {config.label}</span>}
    </span>
  );
};
