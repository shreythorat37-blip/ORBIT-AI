import { Router, Request, Response } from 'express';
import { fetchGlobalFeed } from '../gemini';

const router = Router();

let cachedFeed: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

router.post('/', async (_req: Request, res: Response) => {
  try {
    // Serve from cache if fresh
    if (cachedFeed && Date.now() - cachedFeed.timestamp < CACHE_TTL) {
      console.log('[ORBIT] Serving feed from cache');
      return res.json(cachedFeed.data);
    }

    console.log('[ORBIT] Fetching fresh global feed from Gemini...');
    const events = await fetchGlobalFeed();

    const response = {
      events,
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    cachedFeed = { data: response, timestamp: Date.now() };
    return res.json(response);
  } catch (err) {
    console.error('[ORBIT] Feed route error:', err);
    return res.status(500).json({ error: 'Failed to fetch global feed', events: [] });
  }
});

// Force refresh — clears cache
router.post('/refresh', async (_req: Request, res: Response) => {
  cachedFeed = null;
  try {
    const events = await fetchGlobalFeed();
    const response = { events, generatedAt: new Date().toISOString(), cached: false };
    cachedFeed = { data: response, timestamp: Date.now() };
    return res.json(response);
  } catch (err) {
    console.error('[ORBIT] Refresh error:', err);
    return res.status(500).json({ error: 'Failed to refresh feed', events: [] });
  }
});

export default router;
