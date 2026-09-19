import React from 'react';
import { DomainType } from '../../types';
import { DOMAIN_CONFIG } from '../../config/domains';
import { useOrbitStore } from '../../store/orbitStore';
import { RefreshCw, Filter, Layers } from 'lucide-react';
import { refreshFeed } from '../../hooks/useGlobalFeed';
import { useQueryClient } from '@tanstack/react-query';

export const FilterBar: React.FC = () => {
  const { filters, toggleDomain, setFilters, setEvents, isFeedLoading } = useOrbitStore();
  const queryClient = useQueryClient();

  const domains: DomainType[] = ['geopolitical', 'health', 'environmental', 'economic'];

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['global-feed'] });
    await refreshFeed(setEvents);
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-3">
      {/* Domain Filters */}
      <div className="glass-panel rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <Layers className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            Domains
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {domains.map((d) => {
            const cfg = DOMAIN_CONFIG[d];
            const active = filters.domains.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDomain(d)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: active ? `${cfg.hex}18` : 'transparent',
                  border: `1px solid ${active ? `${cfg.hex}40` : 'transparent'}`,
                  color: active ? cfg.hex : '#475569',
                  opacity: active ? 1 : 0.5,
                }}
              >
                <span>{cfg.icon}</span>
                <span className="font-mono">{cfg.label}</span>
                <div
                  className="ml-auto w-2 h-2 rounded-full transition-opacity"
                  style={{ background: cfg.hex, opacity: active ? 1 : 0.2 }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Severity Filter */}
      <div className="glass-panel rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            Min Severity
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={filters.minSeverity}
            onChange={(e) => setFilters({ minSeverity: Number(e.target.value) })}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs font-mono text-blue-400 w-4 text-center">
            {filters.minSeverity}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <span key={v} className="text-[9px] font-mono text-slate-600">{v}</span>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isFeedLoading}
        className="glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-blue-400 transition-all hover:border-blue-500/30 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFeedLoading ? 'animate-spin' : ''}`} />
        {isFeedLoading ? 'Scanning...' : 'Refresh Feed'}
      </button>
    </div>
  );
};
