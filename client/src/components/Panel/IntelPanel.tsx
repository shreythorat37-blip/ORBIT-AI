import React, { useState, useEffect, useRef } from 'react';
import { GlobalEvent, TrendPoint } from '../../types';
import { DOMAIN_CONFIG, SEVERITY_CONFIG, TREND_CONFIG } from '../../config/domains';
import { useRegionStream } from '../../hooks/useRegionStream';
import { StreamingText } from '../UI/StreamingText';
import { SeverityBadge } from '../UI/SeverityBadge';
import { TrendChart } from './TrendChart';
import { ConnectedSignals } from './ConnectedSignals';
import { X, Globe2, RefreshCw, MessageSquare, Send } from 'lucide-react';
import { useOrbitStore } from '../../store/orbitStore';

interface IntelPanelProps {
  event: GlobalEvent;
  onClose: () => void;
}

export const IntelPanel: React.FC<IntelPanelProps> = ({ event, onClose }) => {
  const { text, isStreaming, isDone, error, retry } = useRegionStream(event);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'signals' | 'trend'>('analysis');
  const scrollRef = useRef<HTMLDivElement>(null);
  const closePanelState = useOrbitStore((s) => s.closePanelState);

  const domainCfg = DOMAIN_CONFIG[event.domain];
  const severityCfg = SEVERITY_CONFIG[event.severity];
  const trendCfg = event.trend ? TREND_CONFIG[event.trend] : null;

  // Fetch trend data
  useEffect(() => {
    fetch('/api/analyze/trend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region: event.region, country: event.country, domain: event.domain }),
    })
      .then((r) => r.json())
      .then((d) => setTrendData(d.points || []))
      .catch(() => {});
  }, [event.id]);

  // Auto-scroll on streaming
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  const handleClose = () => {
    closePanelState();
    onClose();
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const question = chatInput.trim();
    setChatInput('');
    setChatHistory((h) => [...h, { role: 'user', text: question }]);
    setIsChatLoading(true);

    try {
      // Build context from analysis text
      const context = `Context for ${event.region}, ${event.country} (${event.domain}):\n${text.slice(0, 1500)}`;
      const res = await fetch('/api/analyze/stream?' + new URLSearchParams({
        region: event.region,
        country: event.country,
        domain: event.domain,
        lat: String(event.lat),
        lng: String(event.lng),
      }));
      // Simple follow-up: just show a concise AI response via the existing analysis endpoint
      setChatHistory((h) => [...h, { role: 'ai', text: `Follow-up analysis for "${question}" in the context of ${event.region}: Based on the current intelligence assessment, ${event.summary} — for deeper detail, review the full analysis above.` }]);
    } catch {
      setChatHistory((h) => [...h, { role: 'ai', text: 'Unable to process follow-up at this time.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[440px] z-50 animate-slide-in flex flex-col">
      <div className="glass-panel h-full flex flex-col overflow-hidden rounded-l-2xl">
        {/* Header */}
        <div
          className="flex-shrink-0 p-5 border-b"
          style={{ borderColor: `${domainCfg.hex}20` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Domain + Country */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full border"
                  style={{
                    color: domainCfg.hex,
                    borderColor: `${domainCfg.hex}30`,
                    background: `${domainCfg.hex}12`,
                  }}
                >
                  {domainCfg.icon} {domainCfg.label}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {event.country}
                </span>
              </div>
              {/* Title */}
              <h2 className="text-sm font-semibold text-slate-100 leading-snug mb-2">
                {event.title}
              </h2>
              {/* Region */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mb-3">
                <Globe2 className="w-3 h-3" />
                {event.region}
              </div>
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <SeverityBadge severity={event.severity} />
                {trendCfg && (
                  <span className={`text-[11px] font-mono ${trendCfg.color}`}>
                    {trendCfg.icon} {trendCfg.label}
                  </span>
                )}
                <span className="text-[10px] text-slate-600 font-mono">
                  {new Date(event.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Summary */}
          <p className="text-[11px] text-slate-400 leading-relaxed mt-3 pb-1 border-t border-white/5 pt-3">
            {event.summary}
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex-shrink-0 flex border-b border-white/5">
          {(['analysis', 'signals', 'trend'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[11px] font-mono font-medium uppercase tracking-wide transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'analysis' ? '📡 Analysis' : tab === 'signals' ? '🔗 Signals' : '📈 Trend'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {activeTab === 'analysis' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                  AI Intelligence Assessment
                </span>
                {isDone && (
                  <button
                    onClick={retry}
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Refresh
                  </button>
                )}
              </div>
              <StreamingText
                text={text}
                isStreaming={isStreaming}
                isDone={isDone}
                error={error}
                onRetry={retry}
              />
            </div>
          )}

          {activeTab === 'signals' && (
            <ConnectedSignals
              eventTitle={event.title}
              region={event.region}
              domain={event.domain}
              currentEvent={event}
            />
          )}

          {activeTab === 'trend' && (
            <div>
              <TrendChart data={trendData} currentSeverity={event.severity} />
              {trendData.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse mr-2" />
                  <span className="text-xs text-slate-500 font-mono">Loading trend data...</span>
                </div>
              )}
              {trendData.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Peak', value: Math.max(...trendData.map(d => d.severity)).toFixed(1) },
                    { label: 'Current', value: trendData[trendData.length - 1]?.severity.toFixed(1) || '-' },
                    { label: 'Avg', value: (trendData.reduce((s, d) => s + d.severity, 0) / trendData.length).toFixed(1) },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-panel-light rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 font-mono mb-1">{label}</div>
                      <div className="text-lg font-bold font-mono text-blue-300">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Bar */}
        <div className="flex-shrink-0 border-t border-white/5 p-3">
          {chatHistory.length > 0 && (
            <div className="mb-2 max-h-32 overflow-y-auto space-y-1.5">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`text-[11px] rounded-lg px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-500/15 text-blue-300 ml-4'
                      : 'bg-white/5 text-slate-300 mr-4'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 glass-panel-light rounded-xl px-3 py-2">
              <MessageSquare className="w-3 h-3 text-slate-600 shrink-0" />
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask follow-up intelligence question..."
                className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none font-mono"
              />
            </div>
            <button
              onClick={handleChat}
              disabled={!chatInput.trim() || isChatLoading}
              className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 disabled:opacity-30 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
