import { create } from 'zustand';
import { GlobalEvent, OrbitFilters, GlobeArc, DomainType } from '../types';

interface OrbitStore {
  // Events
  events: GlobalEvent[];
  setEvents: (events: GlobalEvent[]) => void;

  // Selection
  selectedEvent: GlobalEvent | null;
  selectEvent: (event: GlobalEvent | null) => void;
  isPanelOpen: boolean;
  closePanelState: () => void;

  // Filters
  filters: OrbitFilters;
  setFilters: (filters: Partial<OrbitFilters>) => void;
  toggleDomain: (domain: DomainType) => void;

  // Globe arcs (connected signals)
  arcs: GlobeArc[];
  setArcs: (arcs: GlobeArc[]) => void;
  clearArcs: () => void;

  // Loading
  isFeedLoading: boolean;
  setFeedLoading: (v: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useOrbitStore = create<OrbitStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),

  selectedEvent: null,
  isPanelOpen: false,
  selectEvent: (event) => set({ selectedEvent: event, isPanelOpen: event !== null }),
  closePanelState: () => set({ isPanelOpen: false, selectedEvent: null }),

  filters: {
    domains: ['geopolitical', 'health', 'environmental', 'economic'],
    minSeverity: 1,
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  toggleDomain: (domain) =>
    set((state) => {
      const current = state.filters.domains;
      const next = current.includes(domain)
        ? current.filter((d) => d !== domain)
        : [...current, domain];
      return { filters: { ...state.filters, domains: next.length ? next : current } };
    }),

  arcs: [],
  setArcs: (arcs) => set({ arcs }),
  clearArcs: () => set({ arcs: [] }),

  isFeedLoading: false,
  setFeedLoading: (v) => set({ isFeedLoading: v }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
