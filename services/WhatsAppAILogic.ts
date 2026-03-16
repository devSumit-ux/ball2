import { generateChatResponse, processPrescription, checkOllamaStatus } from './ollamaService';

/**
 * Logic for WhatsApp AI chat simulation
 */

export interface WhatsAppMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isPrescription?: boolean;
  image?: string;
}

/**
 * Handle an incoming WhatsApp message and get AI response
 */
export async function handleWhatsAppMessage(message: string, context?: any): Promise<string> {
  const isOllamaRunning = await checkOllamaStatus();
  
  if (!isOllamaRunning) {
    return "I'm sorry, I'm currently offline. (Ollama not detected)";
  }

  const appStateContext = context ? `
CURRENT APP STATE:
- User: ${context.user?.name || 'Unknown'}
- Cart: ${context.cart?.length ? context.cart.map((c: any) => `${c.qty}x ${c.product.name}`).join(', ') : 'Empty'}
- Pending Bookings: ${context.bookings?.length || 0}
- Health Records: ${context.records?.length || 0}
` : '';

  const systemPrompt = `You are Pharmelo AI (Solan, HP). 
Role: Professional Pharmacy Assistant & Ecosystem Guide.
${appStateContext}
Instructions:
- Use *Exactly One Asterisk* for bolding (e.g., *Paracetamol*).
- Use professional emojis (💊, 🏥, ✅, 👨‍⚕️).
- ABSOLUTE LIMIT: Max 2 short sentences.
- Be direct. No filler phrases like "I've detected" or "Based on".
Example: *Paracetamol* 500mg added to cart. ✅ Anything else?`;
  
  const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAI:`;
  
  return await generateChatResponse(fullPrompt);
}

/**
 * Handle a prescription upload through WhatsApp chat
 */
export async function handleWhatsAppPrescription(base64Image: string): Promise<{ medicines: string[], response: string }> {
  const aiResponse = await processPrescription(base64Image);
  
  // Basic parsing logic (can be improved)
  const medicines = aiResponse.split('\n').filter(line => line.trim().length > 0);
  
  return {
    medicines,
    response: aiResponse
  };
}

/**
 * AI Logic Functions requested by the user
 */
export const WhatsAppAILogic = {
  processIncoming: handleWhatsAppMessage,
  processImage: handleWhatsAppPrescription,
  checkStatus: checkOllamaStatus
};
