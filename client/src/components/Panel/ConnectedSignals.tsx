import React, { useEffect, useState } from 'react';
import { RelatedSignal } from '../../types';
import { DOMAIN_CONFIG } from '../../config/domains';
import { useOrbitStore } from '../../store/orbitStore';
import { ArrowRight, Link2 } from 'lucide-react';
import { GlobalEvent } from '../../types';

interface ConnectedSignalsProps {
  eventTitle: string;
  region: string;
  domain: string;
  currentEvent: GlobalEvent;
}

export const ConnectedSignals: React.FC<ConnectedSignalsProps> = ({
  eventTitle,
  region,
  domain,
  currentEvent,
}) => {
  const [signals, setSignals] = useState<RelatedSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const setArcs = useOrbitStore((s) => s.setArcs);
  const clearArcs = useOrbitStore((s) => s.clearArcs);

  useEffect(() => {
    const fetchSignals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/analyze/related', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventTitle, region, domain }),
        });
        const data = await res.json();
        const fetched: RelatedSignal[] = data.signals || [];
        setSignals(fetched);

        // Draw arcs on the globe for signals that have coordinates
        const arcs = fetched
          .filter((s) => s.lat != null && s.lng != null)
          .map((s) => ({
            startLat: currentEvent.lat,
            startLng: currentEvent.lng,
            endLat: s.lat!,
            endLng: s.lng!,
            color: DOMAIN_CONFIG[s.domain].hex,
            label: s.signal,
          }));
        setArcs(arcs);
      } catch {
        setSignals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    return () => clearArcs();
  }, [eventTitle, region, domain]);

  const STRENGTH_COLORS: Record<'high' | 'medium' | 'low', string> = {
    high: 'text-red-400 border-red-500/30 bg-red-500/10',
    medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    low: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-3.5 h-3.5 text-blue-400" />
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Connected Signals
        </h3>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-3">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-slate-500 font-mono">Scanning cross-domain signals...</span>
        </div>
      )}

      {!loading && signals.length === 0 && (
        <p className="text-xs text-slate-500 italic">No cross-domain signals identified.</p>
      )}

      <div className="space-y-2">
        {signals.map((sig, idx) => {
          const cfg = DOMAIN_CONFIG[sig.domain];
          return (
            <div
              key={idx}
              className="rounded-lg border p-3 transition-all hover:scale-[1.01]"
              style={{
                background: `${cfg.hex}08`,
                borderColor: `${cfg.hex}25`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-slate-200 leading-snug">
                  {sig.signal}
                </span>
                <span
                  className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${STRENGTH_COLORS[sig.strength]}`}
                >
                  {sig.strength}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{ color: cfg.hex, borderColor: `${cfg.hex}30`, background: `${cfg.hex}10` }}
                >
                  {cfg.icon} {cfg.label}
                </span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                <span className="text-[10px] text-slate-500 italic">{sig.connection_type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
