import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import feedRouter from './routes/feed';
import analyzeRouter from './routes/analyze';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'ORBIT Intelligence API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiKey: process.env.GEMINI_API_KEY ? '✓ configured' : '✗ missing',
  });
});

// Routes
app.use('/api/feed', feedRouter);
app.use('/api/analyze', analyzeRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'ORBIT: endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`
  ██████╗ ██████╗ ██████╗ ██╗████████╗
 ██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝
 ██║   ██║██████╔╝██████╔╝██║   ██║   
 ██║   ██║██╔══██╗██╔══██╗██║   ██║   
 ╚██████╔╝██║  ██║██████╔╝██║   ██║   
  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   

  Global Intelligence Platform
  API Server running at http://localhost:${PORT}
  Gemini API: ${process.env.GEMINI_API_KEY ? '✓ Connected' : '✗ No API Key — set GEMINI_API_KEY in .env'}
  `);
});

export default app;
