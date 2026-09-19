import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useOrbitStore } from '../../store/orbitStore';
import { GlobalEvent } from '../../types';

interface SearchBarProps {
  onFlyTo?: (lat: number, lng: number) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onFlyTo }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GlobalEvent[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const events = useOrbitStore((s) => s.events);
  const selectEvent = useOrbitStore((s) => s.selectEvent);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      const lower = q.toLowerCase();
      const matches = events
        .filter(
          (e) =>
            e.country.toLowerCase().includes(lower) ||
            e.region.toLowerCase().includes(lower) ||
            e.title.toLowerCase().includes(lower)
        )
        .slice(0, 5);
      setSuggestions(matches);
    },
    [events]
  );

  const handleSelect = (event: GlobalEvent) => {
    setQuery(event.country);
    setSuggestions([]);
    selectEvent(event);
    onFlyTo?.(event.lat, event.lng);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-80">
      <div className="glass-panel rounded-2xl overflow-visible">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search regions, countries, events..."
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none font-mono"
          />
          {query && (
            <button onClick={handleClear} className="text-slate-600 hover:text-slate-400">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {isFocused && suggestions.length > 0 && (
          <div className="border-t border-white/5 max-h-64 overflow-y-auto">
            {suggestions.map((ev) => (
              <button
                key={ev.id}
                onClick={() => handleSelect(ev)}
                className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-base mt-0.5">
                  {ev.domain === 'geopolitical'
                    ? '⚔️'
                    : ev.domain === 'health'
                    ? '🏥'
                    : ev.domain === 'environmental'
                    ? '🌿'
                    : '📊'}
                </span>
                <div>
                  <p className="text-xs text-slate-200 font-medium leading-snug">{ev.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {ev.region}, {ev.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
