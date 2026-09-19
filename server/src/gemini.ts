import { GoogleGenAI } from '@google/genai';
import { GlobalEvent, RegionAnalysis, RelatedSignal, TrendPoint, AnalyzeRequest } from './types';
import { HOTSPOTS } from './data/hotspots';
import * as http from 'http';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const MODEL = 'gemini-3.8-flash';

// ─── Global Feed ──────────────────────────────────────────────────────────────

export async function fetchGlobalFeed(): Promise<GlobalEvent[]> {
  const hotspotDescriptions = HOTSPOTS.map(h =>
    `${h.id}: ${h.country} / ${h.region} [${h.domain}] (severity hint: ${h.severity})`
  ).join('\n');

  const prompt = `You are ORBIT, a global intelligence analyst. Using Google Search to access current news (September 2026), enrich the following pre-seeded global hotspots with real, current intelligence.

For each hotspot, return a JSON object with the exact structure. Use current information from your search to fill title, summary, and trend.

HOTSPOTS TO ENRICH:
${hotspotDescriptions}

Return a JSON array with exactly this structure for each hotspot:
{
  "id": "<same id from above>",
  "lat": <number>,
  "lng": <number>,
  "country": "<country name>",
  "region": "<region name>",
  "domain": "<geopolitical|health|environmental|economic>",
  "severity": <1-5 integer>,
  "title": "<concise 8-12 word title of current situation>",
  "summary": "<2-3 sentence current intelligence summary with key facts>",
  "trend": "<escalating|stable|de-escalating|emerging>",
  "updatedAt": "<ISO 8601 timestamp>"
}

SEVERITY SCALE: 1=Minor, 2=Low, 3=Moderate, 4=High, 5=Critical
Return ONLY a valid JSON array. No markdown, no explanation.`;

  try {
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: prompt,
      tools: [{ googleSearch: {} }],
    });

    const raw = interaction.output_text || '[]';
    // Strip markdown fences if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned) as GlobalEvent[];
    return parsed;
  } catch (err) {
    console.error('[ORBIT] Feed fetch error:', err);
    // Fallback: return hotspots with placeholder data
    return HOTSPOTS.map(h => ({
      ...h,
      title: `Situation developing in ${h.region}`,
      summary: `Ongoing ${h.domain} situation in ${h.country}. AI enrichment temporarily unavailable.`,
      trend: 'stable' as const,
      updatedAt: new Date().toISOString(),
    }));
  }
}

// ─── Streaming Region Analysis ────────────────────────────────────────────────

export async function streamRegionAnalysis(
  req: AnalyzeRequest,
  res: http.ServerResponse
): Promise<void> {
  const { region, country, domain } = req;

  const prompt = `You are ORBIT, an elite global intelligence analyst. Using Google Search to access real-time news and historical data, produce a comprehensive intelligence assessment for the following situation.

REGION: ${region}, ${country}
DOMAIN FOCUS: ${domain || 'all domains (geopolitical, health, environmental, economic)'}
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

Structure your analysis in EXACTLY these five sections with these exact headers:

## 🔍 What Happened
Provide a factual timeline of key recent events (last 3-6 months). Include specific dates, actors, and verified facts from current news. 3-4 paragraphs.

## 🧠 Why It Matters
Explain strategic significance: affected populations, regional implications, global ripple effects, key stakeholders, and what is at stake. 2-3 paragraphs.

## 📈 How It's Evolving
Describe the trajectory over the last 12 months. Is this escalating, stabilizing, or de-escalating? What are the leading indicators? What scenarios are most likely in the next 3 months? 2-3 paragraphs.

## 🔗 Connected Signals
Identify 3-4 cross-domain connections. For example: how does this geopolitical conflict connect to health crises, food security, refugee flows, or economic collapse? Be specific with evidence. Use bullet points.

## 📊 Severity Assessment
Provide: Severity Score (1-5), current trend direction (one of: escalating/stable/de-escalating/emerging), confidence level (%), and 2-3 sentence rationale. Format as:
**Score**: X/5
**Trend**: [direction]
**Confidence**: XX%
**Rationale**: [text]

Be precise, evidence-based, and analytically rigorous. Use specific names, dates, and verified facts from Google Search.`;

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  try {
    const stream = await ai.interactions.create({
      model: MODEL,
      input: prompt,
      tools: [{ googleSearch: {} }],
      stream: true,
    });

    for await (const event of stream) {
      if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
        const data = JSON.stringify({ type: 'text', text: event.delta.text });
        res.write(`data: ${data}\n\n`);
      } else if (event.event_type === 'interaction.completed') {
        const usage = event.interaction?.usage;
        res.write(`data: ${JSON.stringify({ type: 'done', usage })}\n\n`);
      }
    }
  } catch (err) {
    console.error('[ORBIT] Stream error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Analysis failed. Please retry.' })}\n\n`);
  } finally {
    res.end();
  }
}

// ─── Related Signals (non-streaming) ─────────────────────────────────────────

export async function fetchRelatedSignals(
  eventTitle: string,
  region: string,
  domain: string
): Promise<RelatedSignal[]> {
  const prompt = `You are ORBIT. For this global event, identify 3-4 connected signals in adjacent domains.

EVENT: "${eventTitle}" in ${region}
PRIMARY DOMAIN: ${domain}

Return a JSON array of related signals:
[
  {
    "signal": "<concise description of the connected signal>",
    "domain": "<geopolitical|health|environmental|economic>",
    "connection_type": "<e.g., 'Conflict-driven displacement', 'Food insecurity cascade', 'Economic sanctions spillover'>",
    "strength": "<high|medium|low>",
    "lat": <approximate latitude or null>,
    "lng": <approximate longitude or null>,
    "country": "<country name or null>"
  }
]

Focus on REAL, evidence-based cross-domain connections. Return ONLY valid JSON, no markdown.`;

  try {
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: prompt,
      tools: [{ googleSearch: {} }],
    });

    const raw = interaction.output_text || '[]';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as RelatedSignal[];
  } catch {
    return [];
  }
}

// ─── Trend Points Generator ───────────────────────────────────────────────────

export async function fetchTrendPoints(
  region: string,
  country: string,
  domain: string
): Promise<TrendPoint[]> {
  const prompt = `Generate a 12-month severity trend (monthly) for the ${domain} situation in ${region}, ${country}.
Use current knowledge. Return a JSON array of 12 objects:
[{ "month": "Oct 2025", "severity": 3.2 }, ...]
Severity is a float between 1.0 and 5.0. Start from October 2025 through September 2026.
Return ONLY valid JSON array, no markdown.`;

  try {
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: prompt,
    });

    const raw = interaction.output_text || '[]';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as TrendPoint[];
  } catch {
    // Fallback: generate synthetic trend
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((m, i) => ({
      month: m,
      severity: 2 + Math.sin(i * 0.5) * 1.5 + Math.random() * 0.5,
    }));
  }
}
