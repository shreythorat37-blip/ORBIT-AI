import { DomainType, SeverityLevel, TrendDirection } from '../types';

export const DOMAIN_CONFIG: Record<DomainType, {
  label: string;
  color: string;
  hex: string;
  bgClass: string;
  icon: string;
}> = {
  geopolitical: {
    label: 'Geopolitical',
    color: 'text-red-400',
    hex: '#ef4444',
    bgClass: 'bg-domain-geopolitical',
    icon: '⚔️',
  },
  health: {
    label: 'Health',
    color: 'text-orange-400',
    hex: '#f97316',
    bgClass: 'bg-domain-health',
    icon: '🏥',
  },
  environmental: {
    label: 'Environmental',
    color: 'text-purple-400',
    hex: '#8b5cf6',
    bgClass: 'bg-domain-environmental',
    icon: '🌿',
  },
  economic: {
    label: 'Economic',
    color: 'text-yellow-400',
    hex: '#eab308',
    bgClass: 'bg-domain-economic',
    icon: '📊',
  },
};

export const SEVERITY_CONFIG: Record<SeverityLevel, {
  label: string;
  color: string;
  hex: string;
  pulse: boolean;
}> = {
  1: { label: 'Minor',    color: 'text-green-400',  hex: '#22c55e', pulse: false },
  2: { label: 'Low',      color: 'text-lime-400',   hex: '#84cc16', pulse: false },
  3: { label: 'Moderate', color: 'text-yellow-400', hex: '#eab308', pulse: false },
  4: { label: 'High',     color: 'text-orange-400', hex: '#f97316', pulse: true  },
  5: { label: 'Critical', color: 'text-red-400',    hex: '#ef4444', pulse: true  },
};

export const TREND_CONFIG: Record<TrendDirection, { label: string; icon: string; color: string }> = {
  escalating:     { label: 'Escalating',     icon: '↑', color: 'text-red-400' },
  stable:         { label: 'Stable',         icon: '→', color: 'text-yellow-400' },
  'de-escalating':{ label: 'De-escalating', icon: '↓', color: 'text-green-400' },
  emerging:       { label: 'Emerging',       icon: '⚡', color: 'text-blue-400' },
};
