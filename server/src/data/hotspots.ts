import { GlobalEvent } from '../types';

// Pre-seeded global hotspots for AI enrichment — geographic diversity across all domains
export const HOTSPOTS: Omit<GlobalEvent, 'title' | 'summary' | 'trend' | 'updatedAt'>[] = [
  // GEOPOLITICAL
  { id: 'ukr-001', lat: 48.3794, lng: 31.1656, country: 'Ukraine', region: 'Eastern Ukraine', domain: 'geopolitical', severity: 5 },
  { id: 'mme-001', lat: 16.8719, lng: 96.1972, country: 'Myanmar', region: 'Rakhine State', domain: 'geopolitical', severity: 4 },
  { id: 'sdn-001', lat: 15.5007, lng: 32.5599, country: 'Sudan', region: 'Khartoum', domain: 'geopolitical', severity: 5 },
  { id: 'isr-001', lat: 31.5, lng: 34.75, country: 'Gaza', region: 'Gaza Strip', domain: 'geopolitical', severity: 5 },
  { id: 'eth-001', lat: 9.145, lng: 40.4897, country: 'Ethiopia', region: 'Amhara Region', domain: 'geopolitical', severity: 3 },
  { id: 'pak-001', lat: 30.3753, lng: 69.3451, country: 'Pakistan', region: 'Balochistan', domain: 'geopolitical', severity: 3 },
  { id: 'mex-001', lat: 23.6345, lng: -102.5528, country: 'Mexico', region: 'Sinaloa', domain: 'geopolitical', severity: 3 },
  { id: 'ven-001', lat: 6.4238, lng: -66.5897, country: 'Venezuela', region: 'Caracas', domain: 'geopolitical', severity: 3 },
  { id: 'hti-001', lat: 18.9712, lng: -72.2852, country: 'Haiti', region: 'Port-au-Prince', domain: 'geopolitical', severity: 4 },
  { id: 'som-001', lat: 5.1521, lng: 46.1996, country: 'Somalia', region: 'Mogadishu', domain: 'geopolitical', severity: 4 },

  // HEALTH
  { id: 'cdo-001', lat: -4.0383, lng: 21.7587, country: 'DRC', region: 'North Kivu', domain: 'health', severity: 4 },
  { id: 'nig-001', lat: 9.0579, lng: 8.6753, country: 'Nigeria', region: 'Abuja Region', domain: 'health', severity: 3 },
  { id: 'ind-001', lat: 20.5937, lng: 78.9629, country: 'India', region: 'Kerala', domain: 'health', severity: 2 },
  { id: 'bra-001', lat: -14.235, lng: -51.9253, country: 'Brazil', region: 'Amazonas', domain: 'health', severity: 3 },
  { id: 'bgd-001', lat: 23.685, lng: 90.3563, country: 'Bangladesh', region: 'Dhaka', domain: 'health', severity: 3 },
  { id: 'phl-001', lat: 12.8797, lng: 121.774, country: 'Philippines', region: 'Mindanao', domain: 'health', severity: 2 },
  { id: 'yem-001', lat: 15.5527, lng: 48.5164, country: 'Yemen', region: 'Aden Governorate', domain: 'health', severity: 4 },

  // ENVIRONMENTAL
  { id: 'aus-001', lat: -25.2744, lng: 133.7751, country: 'Australia', region: 'Queensland', domain: 'environmental', severity: 3 },
  { id: 'usa-001', lat: 36.7783, lng: -119.4179, country: 'USA', region: 'California', domain: 'environmental', severity: 3 },
  { id: 'can-001', lat: 60.0, lng: -113.0, country: 'Canada', region: 'British Columbia', domain: 'environmental', severity: 4 },
  { id: 'idn-001', lat: -0.7893, lng: 113.9213, country: 'Indonesia', region: 'Kalimantan', domain: 'environmental', severity: 4 },
  { id: 'grc-001', lat: 39.0742, lng: 21.8243, country: 'Greece', region: 'Attica', domain: 'environmental', severity: 3 },
  { id: 'pka-001', lat: 30.3753, lng: 69.3451, country: 'Pakistan', region: 'Sindh', domain: 'environmental', severity: 4 },
  { id: 'chl-001', lat: -35.6751, lng: -71.543, country: 'Chile', region: 'Valparaíso Region', domain: 'environmental', severity: 3 },

  // ECONOMIC
  { id: 'arg-001', lat: -38.4161, lng: -63.6167, country: 'Argentina', region: 'Buenos Aires', domain: 'economic', severity: 3 },
  { id: 'tur-001', lat: 38.9637, lng: 35.2433, country: 'Turkey', region: 'Istanbul', domain: 'economic', severity: 3 },
  { id: 'lbn-001', lat: 33.8547, lng: 35.8623, country: 'Lebanon', region: 'Beirut', domain: 'economic', severity: 4 },
  { id: 'zim-001', lat: -19.0154, lng: 29.1549, country: 'Zimbabwe', region: 'Harare', domain: 'economic', severity: 3 },
  { id: 'srl-001', lat: 7.8731, lng: 80.7718, country: 'Sri Lanka', region: 'Colombo', domain: 'economic', severity: 2 },
];
