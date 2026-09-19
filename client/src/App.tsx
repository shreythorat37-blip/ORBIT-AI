import React, { useRef, useCallback } from 'react';
import { GlobeView } from './components/Globe/GlobeView';
import { IntelPanel } from './components/Panel/IntelPanel';
import { FilterBar } from './components/Controls/FilterBar';
import { SearchBar } from './components/Controls/SearchBar';
import { useOrbitStore } from './store/orbitStore';
import { useGlobalFeed } from './hooks/useGlobalFeed';
import { Satellite, Wifi, AlertTriangle } from 'lucide-react';
import './styles/orbit.css';

function App() {
  const { selectedEvent, isPanelOpen, closePanelState, events, isFeedLoading } = useOrbitStore();
  const flyToRef = useRef<((lat: number, lng: number) => void) | null>(null);

  // Load global feed on mount
  const { isError } = useGlobalFeed();

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    flyToRef.current?.(lat, lng);
  }, []);

  const handleFlyToRef = useCallback((fn: (lat: number, lng: number) => void) => {
    flyToRef.current = fn;
  }, []);

  return (
    <div className="relative w-full h-full hud-grid overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* 3D Globe — fullscreen */}
      <div className="absolute inset-0">
        <GlobeView onFlyToRef={handleFlyToRef} />
      </div>

      {/* Top bar — ORBIT branding */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-bold tracking-[0.2em] text-white font-mono">ORBIT</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[10px] text-slate-500 font-mono">
              Global Intelligence Platform
            </span>
          </div>

          {/* Status indicators */}
          <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-slate-400 font-mono">LIVE</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Satellite className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-mono">
                {isFeedLoading ? 'Scanning...' : `${events.length} Events`}
              </span>
            </div>
          </div>
        </div>

        {/* Error toast */}
        {isError && (
          <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-2 pointer-events-auto border border-red-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400 font-mono">API connection error — check GEMINI_API_KEY</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <SearchBar onFlyTo={handleFlyTo} />

      {/* Filter Bar (top-right) */}
      <div className="absolute top-16 right-0 z-40">
        <FilterBar />
      </div>

      {/* Loading overlay */}
      {isFeedLoading && events.length === 0 && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="glass-panel rounded-2xl px-8 py-6 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
              <Satellite className="absolute inset-0 m-auto w-5 h-5 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-mono text-white font-semibold mb-1">
                ORBIT Initializing
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Scanning global intelligence sources via Gemini AI...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom status bar */}
      <div className="absolute bottom-4 left-6 z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          {[
            { color: '#ef4444', label: 'Geopolitical' },
            { color: '#f97316', label: 'Health' },
            { color: '#8b5cf6', label: 'Environmental' },
            { color: '#eab308', label: 'Economic' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 glass-panel-light rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[9px] font-mono text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intel Panel */}
      {isPanelOpen && selectedEvent && (
        <IntelPanel
          event={selectedEvent}
          onClose={closePanelState}
        />
      )}
    </div>
  );
}

export default App;
