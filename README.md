# 🌍 ORBIT — AI-Powered Global Intelligence Platform

> Transforms fragmented global information into an explainable, real-time situational-awareness system on an interactive 3D globe.

![ORBIT Banner](https://img.shields.io/badge/ORBIT-Global%20Intelligence-0a1628?style=for-the-badge&logo=globe&logoColor=3b82f6)
![Gemini AI](https://img.shields.io/badge/Gemini%203.8%20Flash-AI%20Powered-4285f4?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Full%20Stack-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🚀 What is ORBIT?

ORBIT combines **geopolitical intelligence, healthcare signals, environmental warnings, and economic indicators** into a single interactive 3D globe. Powered by Gemini AI with Google Search grounding, it automatically:

- 📡 **Extracts** global events from real-time news and classifies them by domain and severity
- 🔍 **Analyzes** any region with structured 5-section AI intelligence assessments
- 🔗 **Connects** cross-domain signals (e.g. conflict → food crisis → health outbreak)
- 📈 **Tracks** 12-month severity trends with visual sparklines
- 🌐 **Renders** everything on a beautiful dark-theme 3D globe with animated event pins and arc connections

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 Interactive 3D Globe | `globe.gl` (Three.js) with event pins scaled by severity |
| 🎨 Domain Color Coding | ⚔️ Geopolitical (red), 🏥 Health (orange), 🌿 Environmental (purple), 📊 Economic (yellow) |
| 📡 Live AI Feed | Gemini + Google Search grounding fetches ~30 global events on load |
| 📊 5-Section Intel Panel | What happened · Why it matters · How it's evolving · Connected signals · Severity |
| 🌊 Streaming Analysis | AI analysis streams progressively character-by-character via SSE |
| 🔗 Cross-Domain Arcs | Connected signals drawn as animated arcs on the globe |
| 📈 Trend Charts | 12-month severity sparklines via Recharts |
| 🔎 Search & Filter | Search by region/country, filter by domain and min severity |
| 💬 Follow-up Chat | Ask drill-down intelligence questions in a chat interface |

---

## 🏗️ Architecture

```
client/ (Vite + React 19 + TypeScript)
  ├── GlobeView       — globe.gl 3D globe
  ├── IntelPanel      — sliding analysis panel (tabbed)
  ├── FilterBar       — domain toggles + severity slider
  ├── SearchBar       — live region search
  └── Zustand store   — global event/filter/arc state

server/ (Node + Express + TypeScript)
  ├── /api/feed       — Gemini AI global event extraction
  ├── /api/analyze/stream   — SSE streaming region analysis
  ├── /api/analyze/related  — cross-domain signal detection
  └── /api/analyze/trend    — 12-month trend generation
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd hackathon
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Run
```bash
npm run dev
```

Opens:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🖥️ Usage

1. **Globe loads** → ORBIT scans ~30 global hotspots via Gemini AI with live news
2. **Click any pin** → Intel panel slides open with 5-section AI analysis streaming in real-time
3. **Switch tabs** → Analysis · Connected Signals · Trend Chart
4. **Filter** → Toggle domains (top-right) or set minimum severity threshold
5. **Search** → Type any country/region to fly the globe camera there
6. **Ask questions** → Use the chat input at the bottom of the panel for follow-up analysis
7. **Refresh** → Click "Refresh Feed" to re-scan with latest intelligence

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| 3D Globe | `globe.gl` (Three.js) |
| Styling | Tailwind CSS + custom glassmorphism |
| State | Zustand |
| Data fetching | TanStack Query |
| Backend | Node.js + Express |
| AI | Gemini 3.8 Flash (`@google/genai`) |
| AI Grounding | Google Search (real-time news) |
| Charts | Recharts |
| Streaming | Server-Sent Events (SSE) |

---

## 📁 Project Structure

```
hackathon/
├── .env.example
├── package.json           ← root workspaces
├── client/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       │   ├── Globe/GlobeView.tsx
│       │   ├── Panel/IntelPanel.tsx
│       │   ├── Panel/TrendChart.tsx
│       │   ├── Panel/ConnectedSignals.tsx
│       │   ├── Controls/FilterBar.tsx
│       │   ├── Controls/SearchBar.tsx
│       │   └── UI/{SeverityBadge,StreamingText}.tsx
│       ├── hooks/{useGlobalFeed,useRegionStream}.ts
│       ├── store/orbitStore.ts
│       └── config/domains.ts
└── server/
    └── src/
        ├── index.ts
        ├── gemini.ts      ← all AI logic
        ├── types.ts
        ├── data/hotspots.ts
        └── routes/{feed,analyze}.ts
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key from [AI Studio](https://aistudio.google.com) |
| `PORT` | Optional | Backend port (default: 3001) |

---

## 📜 License

MIT — Built for Hackathon 2026