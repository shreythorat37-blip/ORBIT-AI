export type DomainType = 'geopolitical' | 'health' | 'environmental' | 'economic';
export type SeverityLevel = 1 | 2 | 3 | 4 | 5;
export type TrendDirection = 'escalating' | 'stable' | 'de-escalating' | 'emerging';

export interface GlobalEvent {
  id: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  domain: DomainType;
  severity: SeverityLevel;
  title: string;
  summary: string;
  updatedAt: string;
  trend?: TrendDirection;
}

export interface RelatedSignal {
  signal: string;
  domain: DomainType;
  connection_type: string;
  strength: 'high' | 'medium' | 'low';
  lat?: number;
  lng?: number;
  country?: string;
}

export interface TrendPoint {
  month: string;
  severity: number;
}

export interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label?: string;
}

export interface OrbitFilters {
  domains: DomainType[];
  minSeverity: number;
}
