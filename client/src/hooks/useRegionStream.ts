import { useState, useEffect, useRef, useCallback } from 'react';
import { GlobalEvent } from '../types';

interface StreamState {
  text: string;
  isStreaming: boolean;
  isDone: boolean;
  error: string | null;
}

export function useRegionStream(event: GlobalEvent | null) {
  const [state, setState] = useState<StreamState>({
    text: '',
    isStreaming: false,
    isDone: false,
    error: null,
  });

  const esRef = useRef<EventSource | null>(null);

  const startStream = useCallback((ev: GlobalEvent) => {
    // Close any existing stream
    if (esRef.current) {
      esRef.current.close();
    }

    setState({ text: '', isStreaming: true, isDone: false, error: null });

    const params = new URLSearchParams({
      region: ev.region,
      country: ev.country,
      domain: ev.domain,
      lat: String(ev.lat),
      lng: String(ev.lng),
    });

    const es = new EventSource(`/api/analyze/stream?${params}`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.type === 'text') {
          setState((prev) => ({ ...prev, text: prev.text + parsed.text }));
        } else if (parsed.type === 'done') {
          setState((prev) => ({ ...prev, isStreaming: false, isDone: true }));
          es.close();
        } else if (parsed.type === 'error') {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            error: parsed.message,
          }));
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: 'Connection lost. Please try again.',
      }));
      es.close();
    };
  }, []);

  useEffect(() => {
    if (event) {
      startStream(event);
    }
    return () => {
      esRef.current?.close();
    };
  }, [event?.id]);

  const retry = useCallback(() => {
    if (event) startStream(event);
  }, [event, startStream]);

  return { ...state, retry };
}
