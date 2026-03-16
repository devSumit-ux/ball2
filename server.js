import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = 'http://localhost:11434/api';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Proxy to Ollama for status check
app.get('/api/ai/status', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/tags`);
    if (response.ok) {
      res.json({ running: true });
    } else {
      res.json({ running: false, error: 'Ollama returned non-ok status' });
    }
  } catch (error) {
    res.json({ running: false, error: 'Ollama not detected' });
  }
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, model = 'llama3' } = req.body;
  
  try {
    const response = await fetch(`${OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Ollama error: ${response.statusText}`, details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error connecting to Ollama' });
  }
});

// AI Prescription processing endpoint
app.post('/api/ai/prescription', async (req, res) => {
  const { image, model = 'llava' } = req.body;
  
  try {
    const response = await fetch(`${OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: "List the exact drugs and dosages written in this prescription.",
        images: [image],
        stream: false,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Ollama error: ${response.statusText}`, details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Prescription error:', error);
    res.status(500).json({ error: 'Internal server error connecting to Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
