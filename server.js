import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = 'http://localhost:11434/api';

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Added Debug Logger to verify Vercel connection
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Add a catch-all OPTIONS handler for preflight, compatible with Express 5
app.options(/.*/, cors());
app.use(express.json({ limit: '50mb' }));

// Root Endpoint - Premium UI Landing Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pharmelo AI Server | Online</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #3b82f6;
                --bg: #0f172a;
                --card-bg: #1e293b;
                --text: #f8fafc;
                --text-dim: #94a3b8;
            }
            body {
                margin: 0;
                font-family: 'Outfit', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                overflow: hidden;
            }
            .container {
                text-align: center;
                background: var(--card-bg);
                padding: 3rem;
                border-radius: 2rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255,255,255,0.1);
                max-width: 500px;
                animation: fadeIn 0.8s ease-out;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .status-badge {
                display: inline-flex;
                align-items: center;
                background: rgba(34, 197, 94, 0.2);
                color: #4ade80;
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.875rem;
                margin-bottom: 1.5rem;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                margin-right: 8px;
                box-shadow: 0 0 10px #4ade80;
                animation: pulse 2s infinite;
            }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
            h1 { font-size: 2.5rem; margin: 0 0 0.5rem 0; font-weight: 600; background: linear-gradient(to right, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            p { color: var(--text-dim); margin-bottom: 2rem; line-height: 1.6; }
            .endpoints { text-align: left; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 1rem; font-family: monospace; font-size: 0.85rem; }
            .endpoint { margin: 0.5rem 0; color: #60a5fa; }
            .method { color: #f472b6; font-weight: bold; margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status-badge"><div class="status-dot"></div> AI Server Active</div>
            <h1>Pharmelo AI</h1>
            <p>Your local AI brain is now accessible to your Vercel web application. All systems functional.</p>
            <div class="endpoints">
                <div class="endpoint"><span class="method">GET</span> /api/health</div>
                <div class="endpoint"><span class="method">POST</span> /api/ai/chat</div>
                <div class="endpoint"><span class="method">POST</span> /api/ai/whatsapp</div>
            </div>
        </div>
    </body>
    </html>
  `);
});

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
  const { prompt, model = 'pharmelo_ai' } = req.body;
  
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
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Ollama error: ${response.statusText}`, details: errorText });
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
  const { image, model = 'llava:latest' } = req.body;
  
  try {
    if (!image) {
       return res.status(400).json({ error: 'No image data provided' });
    }

    let cleanImage = image;
    
    // If it's a URL, fetch it and convert to base64
    if (image.startsWith('http')) {
      console.log(`[PRESCRIPTION] Fetching image from URL: ${image}`);
      const imgResponse = await fetch(image);
      const arrayBuffer = await imgResponse.arrayBuffer();
      cleanImage = Buffer.from(arrayBuffer).toString('base64');
    } else {
      // Strip data URL prefix if present
      cleanImage = image.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    
    console.log(`[PRESCRIPTION] Processing with model: ${model}. Image length: ${cleanImage.length}`);
    
    const response = await fetch(`${OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: "You are a specialized medical OCR assistant. Read the handwritten text in the image. Here is our pharmacy catalog: Paracetamol, Ibuprofen, Aspirin, Diclofenac, Combiflam, Azithromycin, Amoxicillin, Cefixime, Ofloxacin, Pantoprazole, Digene, Omeprazole, Vitamin C, Calcium, B-Complex. Only list the exact names of the medications you can read that match this catalog, one per line. Do not include any other text.",
        images: [cleanImage],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PRESCRIPTION ERROR] Ollama returned:', errorText);
      return res.status(response.status).json({ error: `Ollama error: ${response.statusText}`, details: errorText });
    }

    const data = await response.json();
    console.log('[PRESCRIPTION SUCCESS] Analysis complete.');
    res.json(data);
  } catch (error) {
    console.error('[PRESCRIPTION EXCEPTION]:', error);
    res.status(500).json({ error: 'Internal server error connecting to Ollama Vision' });
  }
});

/**
 * NEW: WhatsApp AI Proxy Endpoint
 * Exposes the internal logic to external REST calls
 */
app.post('/api/ai/whatsapp', async (req, res) => {
  const { message, context, history, image } = req.body;
  
  try {
    // Import dynamically to avoid issues if needed, but since server.js is ES module, we can use top-level too.
    // However, WhatsAppAILogic.ts is TypeScript, so we'd need to compile it or use ts-node/register.
    // For now, let's keep it simple: the UI calls handleWhatsAppMessage which then calls this server's /chat.
    // If the user wants to call "the logic" directly from elsewhere, we can proxy it.
    
    const response = await fetch(`${OLLAMA_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'pharmelo_ai',
        prompt: `System: Handle this WhatsApp message based on your training.\nUser: ${message}`, // Simplified for now
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Ollama error: ${response.statusText}`, details: errorText });
    }

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error('WhatsApp proxy error:', error);
    res.status(500).json({ error: 'Internal server error in WhatsApp proxy' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
