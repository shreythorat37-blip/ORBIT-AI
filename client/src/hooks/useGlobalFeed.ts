import { useQuery } from '@tanstack/react-query';
import { useOrbitStore } from '../store/orbitStore';
import { GlobalEvent } from '../types';

interface FeedResponse {
  events: GlobalEvent[];
  generatedAt: string;
  cached?: boolean;
}

async function fetchFeed(refresh = false): Promise<FeedResponse> {
  const endpoint = refresh ? '/api/feed/refresh' : '/api/feed';
  const res = await fetch(endpoint, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch global feed');
  return res.json();
}

export function useGlobalFeed() {
  const setEvents = useOrbitStore((s) => s.setEvents);
  const setFeedLoading = useOrbitStore((s) => s.setFeedLoading);

  return useQuery<FeedResponse>({
    queryKey: ['global-feed'],
    queryFn: async () => {
      setFeedLoading(true);
      try {
        const data = await fetchFeed();
        setEvents(data.events);
        return data;
      } finally {
        setFeedLoading(false);
      }
    },
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });
}

export async function refreshFeed(setEvents: (e: GlobalEvent[]) => void): Promise<void> {
  const data = await fetchFeed(true);
  setEvents(data.events);
}
