/**
 * Ollama Service to interact with the local Ollama API
 */

// Automatically uses localhost in local dev, and the Cloudflare tunnel in production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lance-limit-tough-obligations.trycloudflare.com';
const OLLAMA_URL = `${BACKEND_URL}/api/ai`;

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/status`);
    const data = await response.json();
    return data.running;
  } catch (error) {
    console.warn('Backend server not found at', OLLAMA_URL);
    return false;
  }
}

/**
 * Generate a response from Ollama
 * @param prompt The message to send to the AI
 * @param model The model to use (default: llama3)
 */
export async function generateChatResponse(prompt: string, model: string = 'llama3'): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating Ollama response:', error);
    return "I'm sorry, I'm having trouble connecting to my local brain right now. Please make sure Ollama is running!";
  }
}

/**
 * Process a prescription image using a multimodal model (e.g., llava)
 * @param base64Image Base64 encoded image string
 * @param model Multimodal model name
 */
export async function processPrescription(base64Image: string, model: string = 'llava:latest'): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/prescription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        image: base64Image,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error processing prescription with Ollama:', error);
    throw new Error("VISION_ERROR: Process failed. Is model 'llava' installed?");
  }
}
