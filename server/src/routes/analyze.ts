import { Router, Request, Response } from 'express';
import { streamRegionAnalysis, fetchRelatedSignals, fetchTrendPoints } from '../gemini';
import { AnalyzeRequest } from '../types';

const router = Router();

// SSE streaming analysis
router.get('/stream', async (req: Request, res: Response) => {
  const { region, country, domain, lat, lng } = req.query;

  if (!region || !country) {
    return res.status(400).json({ error: 'region and country are required' });
  }

  const analyzeReq: AnalyzeRequest = {
    region: String(region),
    country: String(country),
    domain: domain ? (String(domain) as AnalyzeRequest['domain']) : undefined,
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
  };

  await streamRegionAnalysis(analyzeReq, res);
});

// Related signals (non-streaming)
router.post('/related', async (req: Request, res: Response) => {
  const { eventTitle, region, domain } = req.body;
  if (!eventTitle || !region) {
    return res.status(400).json({ error: 'eventTitle and region required' });
  }
  try {
    const signals = await fetchRelatedSignals(eventTitle, region, domain || 'geopolitical');
    return res.json({ signals });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch related signals', signals: [] });
  }
});

// Trend points
router.post('/trend', async (req: Request, res: Response) => {
  const { region, country, domain } = req.body;
  if (!region || !country) {
    return res.status(400).json({ error: 'region and country required' });
  }
  try {
    const points = await fetchTrendPoints(region, country, domain || 'geopolitical');
    return res.json({ points });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trend', points: [] });
  }
});

export default router;
