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
      // Strip data URL prefix if present (more robust than just looking for base64,)
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
